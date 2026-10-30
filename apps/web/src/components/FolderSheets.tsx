import { useId, useState } from "react";
import { ApiError, type CourseDetail, type CourseExam, type CourseFolder } from "../api";
import { folderGroups, folderMeta } from "../course/folders";
import { kindWords, nextPageName, pageMeta } from "../course/pages";
import { createExamPage, createFolder, moveSet, putOnExamPage, renameFolder } from "../course/requests";
import { FormSheet } from "./FormSheet";

/** Rename folder: only the name changes. A name another folder in the same list has is refused by the server. */
export function RenameFolderSheet({
  folder,
  onSaved,
  onClose,
}: {
  folder: CourseFolder;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(folder.name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const next = name.trim();
    if (next === folder.name) {
      onClose();
      return;
    }
    if (next === "") {
      setError("Give the folder a name.");
      return;
    }
    setBusy(true);
    setError(null);
    renameFolder(folder.id, next).then(onSaved, (caught: unknown) => {
      setBusy(false);
      setError(refusal(caught, "Could not rename the folder."));
    });
  };

  return (
    <FormSheet title="Rename folder" doneLabel="Save" busy={busy} error={error} onDone={save} onClose={onClose}>
      <label className="field">
        <span className="field-label">Folder name</span>
        <input
          className="control"
          aria-label="Folder name"
          value={name}
          maxLength={80}
          autoFocus
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </label>
      <p className="sheet-hint">Only the name changes. Its sets, their progress, its page, and your past exams stay with it.</p>
    </FormSheet>
  );
}

/**
 * New folder, from the + of a course (it goes at the end of its Folders list) or of a page
 * (made on that page, in one step). A name another folder in the same list has is refused by the server.
 */
export function NewFolderSheet({
  course,
  page,
  onMade,
  onClose,
}: {
  course: CourseDetail;
  /** The page to make it on, or null for the course's Folders list. */
  page: CourseExam | null;
  onMade: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const words = kindWords(course.kind);

  const save = () => {
    const next = name.trim();
    if (next === "") {
      setError("Give the folder a name.");
      return;
    }
    setBusy(true);
    setError(null);
    createFolder(course.id, next, page?.id ?? null).then(onMade, (caught: unknown) => {
      setBusy(false);
      setError(refusal(caught, "Could not make the folder."));
    });
  };

  return (
    <FormSheet title={page === null ? "New folder" : `New folder on ${page.name}`} busy={busy} error={error} onDone={save} onClose={onClose}>
      <label className="field">
        <span className="field-label">Folder name</span>
        <input
          className="control"
          aria-label="Folder name"
          value={name}
          maxLength={80}
          autoFocus
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </label>
      <p className="sheet-hint">{page === null ? `It goes at the end of the ${words.container}’s Folders list.` : `It goes on ${page.name}, after its other folders.`}</p>
    </FormSheet>
  );
}

/** Page: which page the folder is on, if any. "New page" makes one with just this folder. */
export function FolderPageSheet({
  course,
  folder,
  onSaved,
  onChanged,
  onClose,
}: {
  course: CourseDetail;
  folder: CourseFolder;
  onSaved: () => void;
  /** Something was saved before a refusal, so the page underneath should load the course again. */
  onChanged: () => void;
  onClose: () => void;
}) {
  const name = useId();
  const current = folder.examPageId ?? "none";
  const [picked, setPicked] = useState(current);
  // A page made by an earlier try that putting the folder on then failed for: a retry uses it
  // instead of making another, which the server would refuse for having the same name.
  const [made, setMade] = useState<{ id: string; name: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const words = kindWords(course.kind);
  const newName = nextPageName(course.exams);

  const save = async () => {
    if (picked === current) {
      onClose();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (picked !== "new") {
        await putOnExamPage(folder.id, picked === "none" ? null : picked);
      } else if (made === null && folder.examPageId === null) {
        // A folder on no page goes onto the new page in the same request.
        await createExamPage(course.id, newName, [folder.id]);
      } else {
        // A folder on another page is taken off it by the move, so the page is made first.
        let page = made;
        if (page === null) {
          const created = await createExamPage(course.id, newName, []);
          page = { id: created.id, name: created.name };
          setMade(page);
          onChanged();
        }
        await putOnExamPage(folder.id, page.id);
      }
    } catch (caught: unknown) {
      setBusy(false);
      setError(refusal(caught, "Could not change the folder's page."));
      return;
    }
    onSaved();
  };

  const option = (value: string, title: string, meta: string) => (
    <li key={value}>
      <label className="radio-row">
        <input
          type="radio"
          className="radio-input"
          name={name}
          value={value}
          checked={picked === value}
          onChange={() => {
            setPicked(value);
          }}
        />
        <span className="radio-dot" aria-hidden="true" />
        <span className="radio-copy">
          <span className="radio-title">{title}</span>
          <span className="radio-meta">{meta}</span>
        </span>
      </label>
    </li>
  );

  return (
    <FormSheet
      title="Page"
      busy={busy}
      error={error}
      onDone={() => {
        void save();
      }}
      onClose={onClose}
    >
      <p className="sheet-hint">
        {folder.name} can be on one page. Its sets and their progress stay in the folder.
      </p>
      <ul className="radio-list" aria-label="Pages">
        {/* The page an earlier try made is offered once, as the new one, after the course is read again. */}
        {course.exams.filter((page) => page.id !== made?.id).map((page) => option(page.id, page.name, pageMeta(course, page)))}
        {option("none", "No page", `Stays in the ${words.container}’s Folders list`)}
        {made === null ? option("new", "New page", newName) : option("new", made.name, "Made just now")}
      </ul>
    </FormSheet>
  );
}

/**
 * Move to: another folder of the course for the sets she selected, grouped by exam page, or a new
 * folder. Each set moves with every older version of it, so its answers and progress go too.
 */
export function MoveSetsSheet({
  course,
  from,
  setIds,
  onMoved,
  onChanged,
  onClose,
}: {
  course: CourseDetail;
  from: CourseFolder;
  setIds: readonly string[];
  /** Every set moved, into the folder named. */
  onMoved: (folderName: string) => void;
  /** Something was saved before a refusal, so the page underneath should load the course again. */
  onChanged: () => void;
  onClose: () => void;
}) {
  const name = useId();
  const [picked, setPicked] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  // A folder made by an earlier try that a move then failed for: a retry moves into it instead of making another.
  const [made, setMade] = useState<{ id: string; name: string } | null>(null);
  const [left, setLeft] = useState<readonly string[]>(setIds);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const moving = from.sets.filter((set) => setIds.includes(set.id));
  const what = moving.length === 1 && moving[0] !== undefined ? `“${moving[0].title}”` : `${String(setIds.length)} sets`;

  const save = async () => {
    if (picked === null) {
      setError("Pick a folder to move to.");
      return;
    }
    const typed = newName.trim();
    if (picked === "new" && made === null && typed === "") {
      setError("Give the new folder a name.");
      return;
    }
    setBusy(true);
    setError(null);
    let target: { id: string; name: string };
    let remaining = left;
    try {
      if (picked !== "new") {
        target = { id: picked, name: course.folders.find((folder) => folder.id === picked)?.name ?? "" };
      } else if (made !== null) {
        target = made;
      } else {
        const folder = await createFolder(course.id, typed);
        target = { id: folder.id, name: folder.name };
        setMade(target);
        onChanged();
      }
      for (const setId of left) {
        await moveSet(setId, target.id);
        remaining = remaining.filter((id) => id !== setId);
      }
    } catch (caught: unknown) {
      setLeft(remaining);
      setBusy(false);
      setError(refusal(caught, "Could not move the sets."));
      if (remaining.length < left.length) onChanged();
      return;
    }
    onMoved(target.name);
  };

  const groups = folderGroups(course);
  return (
    <FormSheet
      title="Move to"
      doneLabel="Move"
      busy={busy}
      error={error}
      onDone={() => {
        void save();
      }}
      onClose={onClose}
    >
      <p className="sheet-hint">
        Moving {what} out of {from.name}.
      </p>
      {groups.map((group) => (
        <div key={group.key} className="radio-group">
          <h3 className="group-header">{group.title}</h3>
          <ul className="radio-list" aria-label={group.title}>
            {group.folders.map((folder) => {
              const here = folder.id === from.id;
              return (
                <li key={folder.id}>
                  <label className={here ? "radio-row radio-row-off" : "radio-row"}>
                    <input
                      type="radio"
                      className="radio-input"
                      name={name}
                      value={folder.id}
                      checked={picked === folder.id}
                      disabled={here}
                      onChange={() => {
                        setPicked(folder.id);
                      }}
                    />
                    <span className="radio-dot" aria-hidden="true" />
                    <span className="radio-copy">
                      <span className="radio-title">{folder.name}</span>
                      <span className="radio-meta">{here ? "Here now" : folderMeta(folder)}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="radio-group">
        <h3 className="group-header">Or</h3>
        <ul className="radio-list" aria-label="New folder">
          <li>
            <label className="radio-row">
              <input
                type="radio"
                className="radio-input"
                name={name}
                value="new"
                checked={picked === "new"}
                onChange={() => {
                  setPicked("new");
                }}
              />
              <span className="radio-dot" aria-hidden="true" />
              <span className="radio-copy">
                <span className="radio-title">{made === null ? "New folder" : made.name}</span>
                <span className="radio-meta">{made === null ? `In the ${kindWords(course.kind).container}’s Folders list` : "Made just now"}</span>
              </span>
            </label>
          </li>
        </ul>
        {picked === "new" && made === null ? (
          <input
            className="control"
            aria-label="New folder name"
            placeholder="Folder name"
            value={newName}
            maxLength={80}
            autoFocus
            onChange={(event) => {
              setNewName(event.target.value);
            }}
          />
        ) : null}
      </div>
      <p className="sheet-hint">Answers and progress move with the set.</p>
    </FormSheet>
  );
}

function refusal(caught: unknown, fallback: string): string {
  return caught instanceof ApiError ? caught.message : fallback;
}

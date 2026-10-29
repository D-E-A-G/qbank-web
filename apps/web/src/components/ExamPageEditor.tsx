import { useState } from "react";
import { ApiError, type CourseDetail, type CourseExam, type CourseFolder } from "../api";
import { looseFolders, pageFolders } from "../course/folders";
import { chipState, kindWords, nextPageName, pickedSummary } from "../course/pages";
import { createExamPage, updateExamPage } from "../course/requests";
import { Button } from "./Button";
import { FormSheet } from "./FormSheet";
import { Icon } from "./Icon";

/**
 * A new exam page, or an existing one's name and folders, with the course's folders as chips. A
 * folder on another exam page is greyed and names it, so no folder is on two. A topic's study page
 * also takes its primer link. Nothing is saved until Done. An existing page ends with Delete.
 */
export function ExamPageEditor({
  course,
  page,
  onSaved,
  onDelete,
  onClose,
}: {
  course: CourseDetail;
  /** The exam page to edit, or null for a new one. */
  page: CourseExam | null;
  onSaved: (page: CourseExam) => void;
  /** Asks to delete the exam page, after its warning; only for an existing one. */
  onDelete?: () => void;
  onClose: () => void;
}) {
  const words = kindWords(course.kind);
  const topic = course.kind === "topic";
  const [name, setName] = useState(page?.name ?? nextPageName(course.exams, course.kind));
  const [link, setLink] = useState(page?.linkUrl ?? "");
  const [picked, setPicked] = useState<string[]>(() => (page === null ? [] : pageFolders(course, page.id).map((folder) => folder.id)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editing = page?.id ?? null;
  // Its own folders first, then the ones on no exam page, then the ones other exam pages hold.
  const others = course.exams.filter((other) => other.id !== editing).flatMap((other) => pageFolders(course, other.id));
  const chips: CourseFolder[] = [...(editing === null ? [] : pageFolders(course, editing)), ...looseFolders(course), ...others];

  const save = () => {
    const next = name.trim();
    if (next === "") {
      setError(`Give the ${words.page} a name.`);
      return;
    }
    setBusy(true);
    setError(null);
    // A course's exam page has no link field, so saving it leaves its link as it is.
    const linkUrl = topic ? link.trim() || null : undefined;
    const saving = page === null ? createExamPage(course.id, next, picked, linkUrl) : updateExamPage(page.id, next, picked, linkUrl);
    saving.then(onSaved, (caught: unknown) => {
      setBusy(false);
      setError(caught instanceof ApiError ? caught.message : `Could not save the ${words.page}.`);
    });
  };

  return (
    <FormSheet title={page === null ? `New ${words.page}` : `Edit ${words.page}`} busy={busy} error={error} onDone={save} onClose={onClose}>
      <div className="exam-edit">
        <input
          className="control exam-edit-input"
          aria-label={`${words.Page} name`}
          value={name}
          maxLength={80}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        {chips.length > 0 ? (
          <div className="folder-chips" role="group" aria-label={`Folders on this ${words.page}`}>
            {chips.map((folder) => {
              const state = chipState(course, editing, picked, folder.id);
              return (
                <button
                  key={folder.id}
                  type="button"
                  className="folder-chip"
                  aria-pressed={state.kind === "on"}
                  disabled={state.kind === "taken"}
                  onClick={() => {
                    setPicked((list) => (list.includes(folder.id) ? list.filter((id) => id !== folder.id) : [...list, folder.id]));
                  }}
                >
                  {folder.name}
                  {state.kind === "taken" ? <small className="folder-chip-owner">{state.pageName}</small> : null}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="exam-edit-summary">This {words.container} has no folders yet.</p>
        )}
        <p className="exam-edit-summary">{pickedSummary(course, picked)}</p>
      </div>
      <p className="sheet-hint">Tap the folders on this page. A folder on another {words.page} is greyed and says which.</p>
      {topic ? (
        <label className="field">
          <span className="field-label">Primer link</span>
          <input
            className="control"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Primer link"
            placeholder="https://"
            value={link}
            maxLength={2000}
            onChange={(event) => {
              setLink(event.target.value);
            }}
          />
          <span className="field-hint">Where you wrote this page up. The page opens it; leave it empty for none.</span>
        </label>
      ) : null}
      {onDelete === undefined ? null : (
        <Button variant="secondary" fullWidth className="text-danger" disabled={busy} onClick={onDelete}>
          <Icon name="trash-2" size={18} />
          Delete this {words.page}
        </Button>
      )}
    </FormSheet>
  );
}

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { DeletedExam, DeletedFolder, DeletedSet, RecentlyDeleted } from "../api";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Icon, type IconName } from "../components/Icon";
import { ReadOnlyBanner } from "../components/ReadOnlyBanner";
import { courseChanged, recentlyDeleted, refusalText, undoDeletion, useCourseVersion, type Doomed } from "../course/deletion";
import { courseName } from "../course/pages";
import { useCourse, useCourseNaming } from "../course/useCourse";
import { foldersText } from "../exam/names";
import { useSession } from "../login/session-context";
import { Screen } from "../shell/Screen";
import { ShellLink } from "../shell/ShellLink";
import { when } from "../when";

/**
 * Recently deleted: the course's folders, sets and past exams she deleted in the last 30 days,
 * newest first, each with Undo until its 30 days run out. A set that went with its folder comes
 * back with the folder, so it is listed under the folder, not on its own.
 */
export function DeletedScreen({ courseId }: { courseId: string }) {
  const session = useSession();
  const readOnly = session.user.role !== "student";
  const { course } = useCourse(courseId);
  const { name, words } = useCourseNaming(courseId, course);
  const version = useCourseVersion(courseId);
  const [deleted, setDeleted] = useState<RecentlyDeleted | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Every Undo on its way, and each that worked until the list is read again without it: its button stays off, so it is never sent twice.
  const [busy, setBusy] = useState<ReadonlySet<string>>(() => new Set());
  const inFlight = useRef(new Set<string>());
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (course) document.title = `Recently deleted · ${courseName(course)} · Qbank`;
  }, [course]);

  useEffect(() => {
    let cancel = false;
    recentlyDeleted(courseId).then(
      (body) => {
        if (cancel) return;
        setLoadError(null);
        setDeleted(body);
        // The list now says what came back, so only the Undos still on their way stay off.
        setBusy(new Set(inFlight.current));
      },
      (caught: unknown) => {
        if (!cancel) setLoadError(refusalText(caught, "Could not load Recently deleted."));
      },
    );
    return () => {
      cancel = true;
    };
  }, [courseId, version]);

  const undo = (item: Doomed, name: string) => {
    inFlight.current.add(item.id);
    setBusy((current) => new Set(current).add(item.id));
    setError(null);
    setDone(null);
    undoDeletion(item).then(
      () => {
        inFlight.current.delete(item.id);
        setDone(`Brought back ${name}.`);
        courseChanged(courseId);
      },
      (caught: unknown) => {
        inFlight.current.delete(item.id);
        setBusy((current) => {
          const next = new Set(current);
          next.delete(item.id);
          return next;
        });
        setError(refusalText(caught, "Could not bring it back."));
        courseChanged(courseId);
      },
    );
  };

  const empty = deleted !== null && deleted.folders.length + deleted.sets.length + deleted.exams.length === 0;
  const days = deleted?.undoDays ?? 30;

  return (
    <Screen title="Recently deleted">
      {session.user.role === "admin" ? <ReadOnlyBanner /> : null}
      <ShellLink to={`/course/${courseId}`} className="text-action" current={false}>
        {name ?? "Course"}
      </ShellLink>
      <p className="note">
        {readOnly
          ? `What she deleted in this ${words.container} in the last ${String(days)} days. She can bring each back as it was.`
          : `What you deleted in this ${words.container} in the last ${String(days)} days. Undo brings each back as it was, with your answers counting again.`}
      </p>
      {loadError ? <p className="form-error">{loadError}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {done ? (
        <p className="status-banner" role="status">
          <Icon name="check" size={16} strokeWidth={2} />
          <span>{done}</span>
        </p>
      ) : null}
      {deleted === null ? (
        loadError ? null : <p className="note">Loading Recently deleted.</p>
      ) : empty ? (
        <div className="empty-card">
          <EmptyState icon="trash-2" message={`Nothing was deleted in the last ${String(days)} days.`} />
        </div>
      ) : (
        <>
          {deleted.folders.length > 0 ? (
            <DeletedGroup title="Folders">
              {deleted.folders.map((folder) => (
                <DeletedRow
                  key={folder.id}
                  icon="folder"
                  title={folder.name}
                  meta={`${folderSets(folder)} · Deleted ${when(folder.deletedAt)}`}
                  refusal={folder.undoRefusal}
                  readOnly={readOnly}
                  busy={busy.has(folder.id)}
                  label={`Undo deleting ${folder.name}`}
                  onUndo={() => {
                    undo({ kind: "folder", id: folder.id }, folder.name);
                  }}
                />
              ))}
            </DeletedGroup>
          ) : null}
          {deleted.sets.length > 0 ? (
            <DeletedGroup title="Sets">
              {deleted.sets.map((set) => (
                <DeletedRow
                  key={set.id}
                  title={set.title}
                  meta={`${setMeta(set)} · Deleted ${when(set.deletedAt)}`}
                  refusal={set.undoRefusal}
                  readOnly={readOnly}
                  busy={busy.has(set.id)}
                  label={`Undo deleting ${set.title}`}
                  onUndo={() => {
                    undo({ kind: "set", id: set.id }, `“${set.title}”`);
                  }}
                />
              ))}
            </DeletedGroup>
          ) : null}
          {deleted.exams.length > 0 ? (
            <DeletedGroup title={readOnly ? "Her exams" : "Past exams"}>
              {deleted.exams.map((exam) => (
                <DeletedRow
                  key={exam.id}
                  title={`${foldersText(exam.weeks)} · ${when(exam.finishedAt ?? exam.startedAt)}`}
                  meta={`${examMeta(exam)} · Deleted ${when(exam.deletedAt)}`}
                  refusal={null}
                  readOnly={readOnly}
                  busy={busy.has(exam.id)}
                  label={`Undo deleting the exam over ${foldersText(exam.weeks)}`}
                  onUndo={() => {
                    undo({ kind: "exam", id: exam.id }, "the exam");
                  }}
                />
              ))}
            </DeletedGroup>
          ) : null}
          <p className="group-footer">Each one can be brought back for {days} days after it was deleted. After that it stays deleted.</p>
        </>
      )}
    </Screen>
  );
}

function DeletedGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="group">
      <h2 className="group-header">{title}</h2>
      <ul className="list-group" aria-label={`Deleted ${title.toLowerCase()}`}>
        {children}
      </ul>
    </section>
  );
}

function DeletedRow({
  icon = null,
  title,
  meta,
  refusal,
  readOnly,
  busy,
  label,
  onUndo,
}: {
  /** Folders have their folder icon; sets and exams have none, as in their own lists. */
  icon?: IconName | null;
  title: string;
  meta: string;
  /** Why Undo would be refused now, as the server says it ("Its folder Week 4 is deleted. Bring the folder back first."). */
  refusal: string | null;
  readOnly: boolean;
  busy: boolean;
  label: string;
  onUndo: () => void;
}) {
  return (
    <li>
      <div className="list-row">
        {icon === null ? null : (
          <span className="list-icon">
            <Icon name={icon} size={22} />
          </span>
        )}
        <span className="list-copy">
          <span className="list-title list-title-strong">{title}</span>
          <span className="list-meta">{meta}</span>
        </span>
        {readOnly ? null : (
          <Button variant="secondary" className="row-undo" aria-label={label} disabled={busy || refusal !== null} onClick={onUndo}>
            <Icon name="rotate-ccw" size={16} strokeWidth={2} />
            Undo
          </Button>
        )}
      </div>
      {refusal !== null ? <p className="list-row-note">{refusal}</p> : null}
    </li>
  );
}

/** "Anxiety disorders, Harder A", or "No sets" for an empty folder. */
function folderSets(folder: DeletedFolder): string {
  if (folder.sets.length === 0) return "No sets";
  return foldersText(folder.sets.map((set) => set.title));
}

/** "From Week 4 · 12 questions", with "exam bank" for an exam set. */
function setMeta(set: DeletedSet): string {
  const questions = `${String(set.questionCount)} ${set.questionCount === 1 ? "question" : "questions"}`;
  return `From ${set.folderName}${set.kind === "exam" ? " exam bank" : ""} · ${questions}`;
}

function examMeta(exam: DeletedExam): string {
  return `${String(exam.fullyRight ?? 0)} of ${String(exam.questionCount)} fully right`;
}

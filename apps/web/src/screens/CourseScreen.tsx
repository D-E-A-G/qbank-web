import { useCallback, useEffect, useState } from "react";
import type { CourseDetail } from "../api";
import { EmptyState } from "../components/EmptyState";
import { ExamPageEditor } from "../components/ExamPageEditor";
import { FolderRows } from "../components/FolderRows";
import { Icon } from "../components/Icon";
import { NavRow, RowBody } from "../components/NavRow";
import { ReadOnlyBanner } from "../components/ReadOnlyBanner";
import { recentlyDeleted, useCourseVersion } from "../course/deletion";
import { looseFolders } from "../course/folders";
import { courseName, nextPageName, pageProgress, pageRowMeta } from "../course/pages";
import { useCourse, useCourseNaming, useRememberPlace } from "../course/useCourse";
import { useFolderOrder } from "../course/useFolderOrder";
import { useSession } from "../login/session-context";
import { deletedPath, examPagePath, navigate } from "../router";
import { Screen } from "../shell/Screen";
import { ShellLink } from "../shell/ShellLink";

/**
 * A course, as in the iPhone's Files app: the study tiles, then two lists. Exam pages, one row
 * each, and the folders on no exam page, one row each, in her order. Each opens its own screen.
 * A study topic is the same screen, called by its name, with study pages for exam pages.
 */
export function CourseScreen({ courseId }: { courseId: string }) {
  const session = useSession();
  const readOnly = session.user.role !== "student";
  const { course, error, reload, replace } = useCourse(courseId);
  const [ordering, setOrdering] = useState(false);
  const [making, setMaking] = useState(false);
  const deleted = useRecentlyDeleted(courseId);
  const { name, words } = useCourseNaming(courseId, course);
  useRememberPlace(courseId);

  useEffect(() => {
    if (course) document.title = `${courseName(course)} · Qbank`;
  }, [course]);

  const closeEditor = useCallback(() => {
    setMaking(false);
  }, []);

  const loose = course ? looseFolders(course) : [];
  const order = useFolderOrder({ course, examPageId: null, folders: loose, replace, reload });
  // Ordering needs two folders; if another device leaves one, edit mode ends with its Done button.
  const editing = ordering && !readOnly && loose.length > 1;

  return (
    <Screen title={name ?? "Course"}>
      {session.user.role === "admin" ? <ReadOnlyBanner /> : null}
      <ShellLink to="/" className="text-action" current={false}>
        {words.home}
      </ShellLink>
      {error ? <p className="form-error">{error}</p> : null}
      {course ? (
        <>
          <p className="note">
            {/* A topic's name is its title already. */}
            {course.kind === "topic" ? null : `${course.title} · `}
            {plural(course.questionCount, "question")} · {plural(course.folders.length, "folder")}
            {course.answeredCount > 0 ? (
              <>
                <br />
                {scoreLine(course)}
              </>
            ) : null}
          </p>
          <div className="tile-row">
            <ShellLink to={`/course/${course.id}/exam`} className="study-tile" current={false}>
              <Icon name="timer" size={22} />
              <span className="tile-copy">
                <span className="tile-value">Exam</span>
                <span className="tile-label">{examLine(course)}</span>
              </span>
            </ShellLink>
            <ShellLink to={`/course/${course.id}/review`} className="study-tile" current={false}>
              <Icon name="inbox" size={22} />
              <span className="tile-copy">
                <span className="tile-value">{course.reviewCount}</span>
                <span className="tile-label">to review</span>
              </span>
            </ShellLink>
            <ShellLink to={`/course/${course.id}/terms`} className="study-tile" current={false}>
              <Icon name="book-open" size={22} />
              <span className="tile-copy">
                <span className="tile-value">{course.termCount}</span>
                <span className="tile-label">{course.termCount === 1 ? "term" : "terms"}</span>
              </span>
            </ShellLink>
          </div>
          {course.folders.length === 0 && course.exams.length === 0 ? (
            <div className="empty-card">
              <EmptyState icon="layers" message={`This ${words.container} has no question sets yet.`} />
            </div>
          ) : (
            <>
              <section className="group">
                <div className="group-head">
                  <h2 className="group-header">{words.pages}</h2>
                  {readOnly ? null : (
                    <button
                      type="button"
                      className="group-action"
                      aria-label={`New ${words.page}`}
                      onClick={() => {
                        setMaking(true);
                      }}
                    >
                      New
                    </button>
                  )}
                </div>
                {course.exams.length === 0 ? (
                  <p className="folder-empty">
                    {readOnly
                      ? `No ${words.pages.toLowerCase()} yet.`
                      : `No ${words.pages.toLowerCase()} yet. Tap New to make ${nextPageName(course.exams, course.kind)}.`}
                  </p>
                ) : (
                  <ul className="list-group" aria-label={words.pages}>
                    {course.exams.map((page) => (
                      <li key={page.id}>
                        <NavRow
                          to={examPagePath(course.id, page.id)}
                          icon="layers"
                          title={page.name}
                          strong
                          meta={pageRowMeta(course, page)}
                          progress={pageProgress(course, page)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              {loose.length > 0 ? (
                <section className="group">
                  <div className="group-head">
                    <h2 className="group-header">Folders</h2>
                    {readOnly || loose.length < 2 ? null : (
                      <button
                        type="button"
                        className="group-action"
                        aria-label={editing ? "Done ordering folders" : "Edit folder order"}
                        onClick={() => {
                          setOrdering(!editing);
                        }}
                      >
                        {editing ? "Done" : "Edit"}
                      </button>
                    )}
                  </div>
                  <FolderRows courseId={course.id} folders={loose} editing={editing} label="Folders" onMove={order.move} />
                  {order.error ? <p className="form-error">{order.error}</p> : null}
                  <p className="group-footer">
                    {editing
                      ? "Drag a folder by its handle, or move it up or down."
                      : course.exams.length === 0
                        ? "Open a folder to see its sets."
                        : `Folders on no ${words.page}. Open one to see its sets.`}
                  </p>
                </section>
              ) : null}
            </>
          )}
          {deleted !== null && deleted.count > 0 ? (
            <section className="group">
              <ul className="list-group" aria-label="Recently deleted">
                <li>
                  <ShellLink to={deletedPath(course.id)} className="list-row" current={false}>
                    <RowBody icon="trash-2" title="Recently deleted" meta={`${plural(deleted.count, "item")} · Undo for ${String(deleted.undoDays)} days`} />
                    <span className="list-chevron">
                      <Icon name="chevron-right" size={18} strokeWidth={2} />
                    </span>
                  </ShellLink>
                </li>
              </ul>
            </section>
          ) : null}
        </>
      ) : error ? null : (
        <p className="note">Loading the {words.container}.</p>
      )}
      {making && course ? (
        <ExamPageEditor
          course={course}
          page={null}
          onSaved={(page) => {
            navigate(examPagePath(course.id, page.id));
          }}
          onClose={closeEditor}
        />
      ) : null}
    </Screen>
  );
}

/** How many folders, sets and past exams of the course Undo can still bring back, and for how long; null until it is read. */
function useRecentlyDeleted(courseId: string): { count: number; undoDays: number } | null {
  const version = useCourseVersion(courseId);
  const [loaded, setLoaded] = useState<{ courseId: string; count: number; undoDays: number } | null>(null);
  useEffect(() => {
    let cancel = false;
    recentlyDeleted(courseId).then(
      (deleted) => {
        if (!cancel) setLoaded({ courseId, count: deleted.folders.length + deleted.sets.length + deleted.exams.length, undoDays: deleted.undoDays });
      },
      (caught: unknown) => {
        console.error(caught);
      },
    );
    return () => {
      cancel = true;
    };
  }, [courseId, version]);
  return loaded?.courseId === courseId ? loaded : null;
}

/** How long an exam over every folder takes: 60 minutes for 40, or 1.5 minutes a question when there are fewer. */
function examLine(course: CourseDetail): string {
  if (course.examQuestionCount === 0) return "Not ready";
  const minutes = course.examTimeLimitSeconds / 60;
  return `${Number.isInteger(minutes) ? String(minutes) : minutes.toFixed(1)} min`;
}

function scoreLine(course: CourseDetail): string {
  return `${String(course.answeredCount)} of ${String(course.questionCount)} answered · ${String(course.fullyRightCount)} fully right · ${String(course.points)} of ${String(course.maxPoints)} points`;
}

function plural(count: number, noun: string): string {
  return `${String(count)} ${count === 1 ? noun : `${noun}s`}`;
}

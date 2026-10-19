import { useCallback, useEffect, useState } from "react";
import { ApiError, type CourseDetail, type CourseExam, type ExamSetup } from "../api";
import { Button } from "../components/Button";
import { ConfirmSheet } from "../components/ConfirmSheet";
import { EmptyState } from "../components/EmptyState";
import { ExamPageEditor } from "../components/ExamPageEditor";
import { FolderRows } from "../components/FolderRows";
import { Icon } from "../components/Icon";
import { ReadOnlyBanner } from "../components/ReadOnlyBanner";
import { pageFolders } from "../course/folders";
import { examSetupPath, examTwinsLine, pageMeta, pageSittings } from "../course/pages";
import { deleteExamPage } from "../course/requests";
import { useCourse, useRememberPlace } from "../course/useCourse";
import { useFolderOrder } from "../course/useFolderOrder";
import { PastExamList } from "../exam/PastExamList";
import { useSession } from "../login/session-context";
import { navigate } from "../router";
import { Screen } from "../shell/Screen";
import { ShellLink } from "../shell/ShellLink";

/** One exam page: Start exam over its folders, its folders in her order, and the exams she took over them. */
export function ExamPageScreen({ courseId, examPageId }: { courseId: string; examPageId: string }) {
  const session = useSession();
  const readOnly = session.user.role !== "student";
  const { course, setup, error, setupError, reload, replace } = useCourse(courseId, true);
  const page = course?.exams.find((item) => item.id === examPageId) ?? null;
  const [ordering, setOrdering] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  useRememberPlace(courseId);

  useEffect(() => {
    if (course && page) document.title = `${page.name} · ${course.code} · Qbank`;
  }, [course, page]);

  const closeEditor = useCallback(() => {
    setEditing(false);
  }, []);

  const keep = useCallback(() => {
    setRemoving(false);
  }, []);

  const folders = course && page ? pageFolders(course, page.id) : [];
  // An empty page has Add folders instead, so Edit (her order, then its name and folders) waits for one.
  const canEdit = !readOnly && folders.length > 0;
  const edit = ordering && canEdit;
  const order = useFolderOrder({ course, examPageId, folders, replace, reload });

  const remove = () => {
    if (!page) return;
    setRemoving(false);
    deleteExamPage(page.id).then(
      () => {
        navigate(`/course/${courseId}`);
      },
      (caught: unknown) => {
        setActionError(caught instanceof ApiError ? caught.message : "Could not remove the exam page.");
        reload();
      },
    );
  };

  return (
    <Screen title={page?.name ?? "Exam page"}>
      {session.user.role === "admin" ? <ReadOnlyBanner /> : null}
      <ShellLink to={`/course/${courseId}`} className="text-action" current={false}>
        {course?.code ?? "Course"}
      </ShellLink>
      {error ? <p className="form-error">{error}</p> : null}
      {actionError ? <p className="form-error">{actionError}</p> : null}
      {order.error ? <p className="form-error">{order.error}</p> : null}
      {course === null ? (
        error ? null : <p className="note">Loading the exam page.</p>
      ) : page === null ? (
        <div className="empty-card">
          <EmptyState icon="layers" message="This exam page is not in the course anymore. It may have been removed on another device." />
        </div>
      ) : (
        <>
          <p className="note">{pageMeta(course, page)}</p>
          {readOnly ? null : <StartExam course={course} page={page} setup={setup} />}
          <section className="group">
            <div className="group-head">
              <h2 className="group-header">Study material</h2>
              {canEdit ? (
                <button
                  type="button"
                  className="group-action"
                  aria-label={edit ? "Done editing the exam page" : "Edit the exam page"}
                  onClick={() => {
                    setOrdering(!edit);
                  }}
                >
                  {edit ? "Done" : "Edit"}
                </button>
              ) : null}
            </div>
            {edit ? (
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setEditing(true);
                }}
              >
                <Icon name="pencil" size={18} />
                Name and folders
              </Button>
            ) : null}
            {folders.length === 0 ? (
              <div className="empty-card">
                <EmptyState
                  icon="folder"
                  message={readOnly ? "No folders on this page yet." : "No folders on this page yet. Add the folders this exam covers."}
                  action={
                    readOnly ? null : (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditing(true);
                        }}
                      >
                        <Icon name="plus" size={18} strokeWidth={2} />
                        Add folders
                      </Button>
                    )
                  }
                />
              </div>
            ) : (
              <FolderRows courseId={course.id} folders={folders} editing={edit} label={`Study material on ${page.name}`} onMove={order.move} />
            )}
            {edit && folders.length > 1 ? <p className="group-footer">Drag a folder by its handle, or move it up or down.</p> : null}
          </section>
          {setup === null ? (
            <section className="group">
              <h2 className="group-header">{readOnly ? "Her past exams" : "Past exams"}</h2>
              <p className={setupError ? "form-error" : "note"}>{setupError ?? "Loading the exams."}</p>
            </section>
          ) : (
            <PastExamList
              courseId={course.id}
              exams={pageSittings(setup.exams, page.id)}
              title={readOnly ? "Her past exams" : "Past exams"}
              readOnly={readOnly}
              empty={
                <p className="folder-empty">
                  {readOnly ? `Her finished exams over ${page.name} show up here with their scores.` : `Exams you finish over ${page.name} show up here with their scores.`}
                </p>
              }
            />
          )}
        </>
      )}
      {editing && course && page ? (
        <ExamPageEditor
          course={course}
          page={page}
          onSaved={() => {
            setEditing(false);
            reload();
          }}
          onRemove={() => {
            setEditing(false);
            setRemoving(true);
          }}
          onClose={closeEditor}
        />
      ) : null}
      {removing && page ? (
        <ConfirmSheet
          title={`Remove ${page.name}?`}
          message="Its folders go back to the course’s Folders list. No set moves, and your answers and past exams are kept."
          confirmLabel="Remove"
          confirmVariant="destructive"
          onConfirm={remove}
          onCancel={keep}
        />
      ) : null}
    </Screen>
  );
}

/** Start exam, opening Exam setup with the page's folders ticked, and what that exam would draw. */
function StartExam({ course, page, setup }: { course: CourseDetail; page: CourseExam; setup: ExamSetup | null }) {
  // The server leaves out a folder with no question, so the plan names the folders an exam can draw from.
  const preview = setup?.courseExams.find((item) => item.courseExamId === page.id)?.preview ?? null;
  const pool = preview?.folders ?? [];
  if (preview === null || pool.length === 0) return null;
  const total = pool.reduce((sum, folder) => sum + folder.questionCount, 0);
  const where = pool.every((folder) => folder.source === "exam") ? "its exam banks" : pool.length === 1 ? "this folder" : `these ${String(pool.length)} folders`;
  // Twins are what the next exam draws from, not a place to open, so this stays a line under the draw.
  const twins = examTwinsLine(pageFolders(course, page.id));
  return (
    <div className="start-block">
      <ShellLink
        to={examSetupPath(
          course.id,
          page.name,
          pool.map((folder) => folder.id),
        )}
        className="btn btn-primary btn-full"
        current={false}
      >
        <Icon name="timer" size={18} />
        Start exam
      </ShellLink>
      <p className="folder-note">
        {preview.questionCount < total
          ? `${String(preview.questionCount)} questions from the ${String(total)} in ${where}, or Wrong questions only.`
          : `All ${String(total)} ${total === 1 ? "question" : "questions"} in ${where}, or Wrong questions only.`}
      </p>
      {twins === "" ? null : (
        <p className="folder-bank">
          <Icon name="timer" size={16} />
          {twins}
        </p>
      )}
    </div>
  );
}

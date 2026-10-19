import type { ExamSummary } from "../api";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { navigate } from "../router";
import { when } from "../when";
import { foldersText } from "./names";

/**
 * A finished exam: its folders and date, minutes and pool, and its score. It opens the exam's
 * result; while its list is in Edit (`onDelete`), it has Delete instead.
 */
export function PastExamRow({ courseId, exam, onDelete = null }: { courseId: string; exam: ExamSummary; onDelete?: (() => void) | null }) {
  const copy = (
    <>
      <span className="review-copy">
        <span className="review-topic">{examName(exam)}</span>
        <span className="review-meta">
          {exam.minutesUsed ?? 0} min{exam.pool === "wrong" ? " · Wrong questions only" : ""}
          {exam.endReason === "timeout" ? " · Time ran out" : exam.endReason === "left" ? " · Ended early" : ""}
        </span>
      </span>
      <span className="exam-score">
        {exam.fullyRight ?? 0} of {exam.questionCount}
      </span>
    </>
  );
  if (onDelete !== null) {
    return (
      <div className="review-row">
        {copy}
        <Button variant="destructive" className="row-delete" aria-label={`Delete the exam over ${examName(exam)}`} onClick={onDelete}>
          Delete
        </Button>
      </div>
    );
  }
  return (
    <button
      type="button"
      className="review-row"
      onClick={() => {
        navigate(`/course/${courseId}/exam/${exam.id}`);
      }}
    >
      {copy}
      <span className="review-chevron">
        <Icon name="chevron-right" size={18} />
      </span>
    </button>
  );
}

/** "Week 1, Week 2 · Oct 12": its folders and the day it ended. */
function examName(exam: ExamSummary): string {
  return `${foldersText(exam.weeks)} · ${when(exam.finishedAt ?? exam.startedAt)}`;
}

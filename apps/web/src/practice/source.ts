import { folderPath, type PracticeMatch } from "../router";

/** Where the runner reads its questions from and where closing it goes. */
export interface PracticeSource {
  kind: "set" | "review";
  /** Changes when the questions change, so the runner starts over. */
  key: string;
  loadPath: string;
  closeTo: string;
  /** The button that closes the results: "Back to folder", "Back to course", or "Back to Review". */
  closeLabel: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** A practice set, opened from its folder (`?folder=`), or the course's Review list with `?filter=` or one `?question=`. */
export function practiceSource(match: PracticeMatch, search: string): PracticeSource {
  const params = new URLSearchParams(search);
  if (match.kind === "set") {
    const folder = params.get("folder");
    const key = match.setId;
    const loadPath = `/api/practice-sets/${match.setId}`;
    if (folder !== null && UUID.test(folder)) return { kind: "set", key, loadPath, closeTo: folderPath(match.courseId, folder), closeLabel: "Back to folder" };
    return { kind: "set", key, loadPath, closeTo: `/course/${match.courseId}`, closeLabel: "Back to course" };
  }
  const question = params.get("question");
  const filter = params.get("filter");
  const query = new URLSearchParams();
  if (question !== null) query.set("question", question);
  else if (filter === "missed" || filter === "partial" || filter === "guessed") query.set("filter", filter);
  const suffix = query.toString() === "" ? "" : `?${query.toString()}`;
  return {
    kind: "review",
    key: `review${suffix}`,
    loadPath: `/api/courses/${match.courseId}/review/practice${suffix}`,
    closeTo: `/course/${match.courseId}/review`,
    closeLabel: "Back to Review",
  };
}

import type { components } from "./api-schema";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(messageFrom(body));
    this.status = status;
    this.body = body;
  }
}

/** The API's shapes, generated from its pinned contract (contract/openapi.json). */
type Schemas = components["schemas"];

/** "exam" for an exam set: questions asked only on exams. */
export type SetKind = Schemas["ImportReport"]["kind"];
export type ImportReport = Schemas["ImportReport"];
export type ImportConflict = Schemas["ImportConflict"];
export type ImportedSet = Schemas["ImportedSet"];
export type SemesterRecord = Schemas["Semester"];
export type SemesterCourse = SemesterRecord["courses"][number];
export type CourseDetail = Schemas["CourseDetail"];
export type SetSummary = Schemas["SetSummary"];
/** A folder of a course: her name for it, the exam page it is on, its place in its list, and its sets. */
export type CourseFolder = Schemas["Folder"];
/** An exam page of a course (a course exam) and the folders on it. A folder is on one exam page at most. */
export type CourseExam = Schemas["CourseExam"];
export type ReviewQuestion = Schemas["ReviewQuestion"];
export type ReviewList = Schemas["ReviewList"];
export type RepairPlan = Schemas["RepairPlan"];
export type CourseTerm = Schemas["Term"];
export type ExamEndReason = NonNullable<ExamSummary["endReason"]>;
/** All questions in the ticked folders, or only the ones she last answered not fully right. */
export type ExamPool = ExamSummary["pool"];
export type ExamSummary = Schemas["ExamSummary"];
export type ExamSetup = Schemas["ExamSetup"];
export type ExamSetupFolder = ExamSetup["folders"][number];
/** What an exam over some folders would draw from each, and its time, worked out as starting it does. */
export type ExamPreview = Schemas["ExamPreview"];
export type ExamResult = Schemas["ExamResult"];
export type ExamBreakdownRow = ExamResult["byStep"][number];
export type ExamItemResult = ExamResult["items"][number];
/** An exam as the server sends it. Questions keep the practice-set shape plus their week. */
export type ExamView = Schemas["Exam"];
/** Whether this account may make questions now (Make questions and exam twins), and why not. */
export type QuestionMakerStatus = Schemas["QuestionMakerStatus"];
/** Exam twins of the folders and pool she picked on Exam setup, written in the background. */
export type TwinJob = Schemas["QuestionTwinJob"];
export type TwinJobStep = TwinJob["steps"][number];
export type TwinSet = Schemas["QuestionTwinSet"];
/** Once a twin job is done: the body of POST /api/courses/{id}/exams that starts the exam on the twins. */
export type TwinExam = Schemas["QuestionTwinExam"];
/** What deleting a set, a folder (with its sets) or a past exam takes with it: the warning, and the `confirm` that deletes exactly that. */
export type SetDeletion = Schemas["SetDeletion"];
export type FolderDeletion = Schemas["FolderDeletion"];
export type ExamDeletion = Schemas["ExamDeletion"];
/** A course's folders, sets and past exams deleted in the last 30 days: everything Undo can still bring back. */
export type RecentlyDeleted = Schemas["RecentlyDeleted"];
export type DeletedFolder = Schemas["DeletedFolder"];
export type DeletedSet = Schemas["DeletedSet"];
export type DeletedExam = Schemas["DeletedExam"];

export async function api<T>(path: string, init: { method?: string; json?: unknown } = {}): Promise<T> {
  const request: RequestInit = { method: init.method ?? "GET" };
  if (init.json !== undefined) {
    request.headers = { "content-type": "application/json" };
    request.body = JSON.stringify(init.json);
  }
  const response = await fetch(path, request);
  const text = await response.text();
  const body: unknown = text === "" ? null : (JSON.parse(text) as unknown);
  if (!response.ok) throw new ApiError(response.status, body);
  return body as T;
}

export function isConflict(body: unknown): body is ImportConflict {
  return typeof body === "object" && body !== null && "conflict" in body && body.conflict === true;
}

function messageFrom(body: unknown): string {
  if (typeof body === "object" && body !== null && "message" in body && typeof body.message === "string") return body.message;
  if (typeof body === "object" && body !== null && "error" in body && typeof body.error === "string") return body.error;
  return "Something went wrong.";
}

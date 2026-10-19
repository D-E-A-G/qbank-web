import type { QuestionMakerStatus, TwinJob, TwinJobStep } from "../api";
import type { IconName } from "../components/Icon";
import { foldersText } from "./names";

/** How often a running twin job is read again. It never waits for her, so this only moves its steps along. */
export const TWIN_POLL_MS = 2000;

/** The address of a twin job's page. */
export function twinJobPath(courseId: string, jobId: string): string {
  return `/course/${courseId}/twins/${jobId}`;
}

/** The Twin option shows only while the server says this account may make questions now. */
export function canTwin(status: QuestionMakerStatus | null): boolean {
  return status?.available === true;
}

/**
 * Whether her twin jobs can be listed: she may make questions, now or once the daily limit passes.
 * Any other account is refused by the twin-job routes, so they are not asked.
 */
export function listsTwinJobs(status: QuestionMakerStatus | null): boolean {
  return status !== null && (status.available || status.nextAvailableAt !== null);
}

/** Her twin jobs over this course, newest first as the server sends them. */
export function courseTwinJobs(jobs: readonly TwinJob[], courseId: string): TwinJob[] {
  return jobs.filter((job) => job.course.id === courseId);
}

/** A job that is still writing is read again until it is done, failed, or cancelled. */
export function isRunning(job: TwinJob): boolean {
  return job.status === "running";
}

/** The word at the right of a twin job's row: what it is doing, or how it ended. */
export function twinJobState(job: TwinJob): string {
  if (job.status === "running") return "Writing";
  if (job.status === "done") return "Ready";
  if (job.status === "failed") return "Failed";
  return "Cancelled";
}

/** "Week 5", or "Week 4, Week 5, Week 6": the folders she picked, as a past exam names them. */
export function twinJobTitle(job: TwinJob): string {
  return foldersText(job.folders.map((folder) => folder.name));
}

/** "1 exam twin", "5 exam twins". */
export function twinCountText(job: TwinJob): string {
  return `${String(job.twinCount)} ${job.twinCount === 1 ? "exam twin" : "exam twins"}`;
}

/** "5 exam twins · Wrong questions only". */
export function twinJobMeta(job: TwinJob): string {
  const count = twinCountText(job);
  return job.pool === "wrong" ? `${count} · Wrong questions only` : count;
}

/** How far a step is: "Done", "2 of 5" while it runs, or how it stopped. A step not reached yet says nothing. */
export function stepProgress(step: TwinJobStep): string {
  if (step.state === "done") return "Done";
  if (step.state === "failed") return "Failed";
  if (step.state === "cancelled") return "Cancelled";
  if (step.state === "todo") return "";
  if (step.done !== null && step.total !== null) return `${String(step.done)} of ${String(step.total)}`;
  return "Working";
}

/** The mark before a step's label. */
export function stepIcon(step: TwinJobStep): IconName {
  if (step.state === "done") return "circle-check";
  if (step.state === "current") return "clock";
  if (step.state === "failed") return "circle-x";
  if (step.state === "cancelled") return "circle-minus";
  return "circle";
}

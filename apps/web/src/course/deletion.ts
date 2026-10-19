import { useSyncExternalStore } from "react";
import { refreshCatalog } from "../catalog";
import { ApiError, api, type ExamDeletion, type FolderDeletion, type RecentlyDeleted, type SetDeletion } from "../api";

/**
 * Deleting takes three steps, each the server's: the preview names what goes and gives a `confirm`
 * token, the delete sends that token back so it deletes exactly what she was shown, and Undo brings
 * it back as it was for 30 days. Nothing is deleted except by her confirmed delete.
 */
export type Doomed = { kind: "set"; id: string } | { kind: "folder"; id: string } | { kind: "exam"; id: string };

export type DeletionPreview = { kind: "set"; preview: SetDeletion } | { kind: "folder"; preview: FolderDeletion } | { kind: "exam"; preview: ExamDeletion };

const BASE: Record<Doomed["kind"], string> = {
  set: "/api/practice-sets",
  folder: "/api/folders",
  exam: "/api/exams",
};

export async function previewDeletion(item: Doomed): Promise<DeletionPreview> {
  const path = `${BASE[item.kind]}/${item.id}/delete-preview`;
  if (item.kind === "set") return { kind: "set", preview: await api<SetDeletion>(path) };
  if (item.kind === "folder") return { kind: "folder", preview: await api<FolderDeletion>(path) };
  return { kind: "exam", preview: await api<ExamDeletion>(path) };
}

/** Deletes what the preview named, with its `confirm`. One that changed since is refused with 409 `deletion_changed`. */
export async function deleteConfirmed(item: Doomed, confirm: string): Promise<void> {
  await api(`${BASE[item.kind]}/${item.id}?${new URLSearchParams({ confirm }).toString()}`, { method: "DELETE" });
}

/** Brings it back as it was, within its 30 days; the server's refusal sentence says why not otherwise. */
export async function undoDeletion(item: Doomed): Promise<void> {
  await api(`${BASE[item.kind]}/${item.id}/undo-delete`, { method: "POST" });
}

export async function recentlyDeleted(courseId: string): Promise<RecentlyDeleted> {
  return api<RecentlyDeleted>(`/api/courses/${courseId}/deleted`);
}

/** What she is deleting, from her own preview: the set's or folder's name, or "this exam". */
export function doomedName(deletion: DeletionPreview): string {
  if (deletion.kind === "set") return deletion.preview.title;
  if (deletion.kind === "folder") return deletion.preview.name;
  return "this exam";
}

/**
 * The server's warning, split for a sheet: its first sentence, the question ("Delete Week 4?"),
 * is the title, and the rest is the message, word for word. A name may itself hold a "?", so the
 * question is looked for after the name.
 */
export function warningParts(deletion: DeletionPreview): { title: string; message: string } {
  const text = deletion.preview.message.trim();
  const from = text.indexOf(doomedName(deletion));
  const end = text.indexOf("?", from === -1 ? 0 : from + doomedName(deletion).length);
  if (end === -1) return { title: "Delete?", message: text };
  return { title: text.slice(0, end + 1), message: text.slice(end + 1).trim() };
}

/**
 * What the Undo offer says: "Deleted “Anxiety disorders”.", "Deleted Week 4 and its 3 sets.", or
 * "Deleted 2 sets.", and once Undo worked, the same with "Brought back".
 */
export function deletionSummary(deletions: readonly DeletionPreview[], done: "Deleted" | "Brought back"): string {
  const [only] = deletions;
  if (only === undefined) return "";
  if (deletions.length > 1) return `${done} ${String(deletions.length)} sets.`;
  if (only.kind === "set") return `${done} “${only.preview.title}”.`;
  if (only.kind === "exam") return `${done} the exam.`;
  const sets = only.preview.setCount;
  return sets === 0 ? `${done} ${only.preview.name}.` : `${done} ${only.preview.name} and its ${sets === 1 ? "set" : `${String(sets)} sets`}.`;
}

/** The server's refusal sentence, or the fallback when there was none. */
export function refusalText(caught: unknown, fallback: string): string {
  return caught instanceof ApiError ? caught.message : fallback;
}

/** The delete was refused because what goes changed since the preview: look again, then confirm again. */
export function isDeletionChanged(caught: unknown): boolean {
  return caught instanceof ApiError && caught.status === 409 && errorCode(caught.body) === "deletion_changed";
}

function errorCode(body: unknown): string | null {
  return typeof body === "object" && body !== null && "error" in body && typeof body.error === "string" ? body.error : null;
}

/**
 * The Undo offered right after a delete, one at a time: a newer delete replaces it. It belongs to
 * the shell, so it stays while the screen changes (a deleted folder's screen goes back).
 */
export interface UndoOffer {
  id: number;
  courseId: string;
  text: string;
  /** What it says once Undo brought everything back. */
  undoneText: string;
  items: readonly Doomed[];
  /** Set once Undo was tapped: what it says now ("Brought back …", or the refusal), with no button. */
  outcome: { state: "working" | "done" | "failed"; text: string } | null;
}

let offer: UndoOffer | null = null;
let nextOffer = 1;
const offerListeners = new Set<() => void>();

function publishOffer(next: UndoOffer | null): void {
  offer = next;
  for (const listener of offerListeners) listener();
}

/** Offers Undo for what was just deleted, and has every screen of the course read it again. */
export function offerUndo(courseId: string, deletions: readonly DeletionPreview[]): void {
  publishOffer({
    id: nextOffer++,
    courseId,
    text: deletionSummary(deletions, "Deleted"),
    undoneText: deletionSummary(deletions, "Brought back"),
    items: deletions.map(doomedOf),
    outcome: null,
  });
  courseChanged(courseId);
}

export function doomedOf(deletion: DeletionPreview): Doomed {
  if (deletion.kind === "set") return { kind: "set", id: deletion.preview.setId };
  if (deletion.kind === "folder") return { kind: "folder", id: deletion.preview.folderId };
  return { kind: "exam", id: deletion.preview.examId };
}

export function dismissUndo(id: number): void {
  if (offer?.id === id) publishOffer(null);
}

/** Undo for the offer: brings each item back, in the order they were deleted, and says how it went. */
export async function takeUndo(id: number): Promise<void> {
  const current = offer;
  if (current?.id !== id || current.outcome !== null) return;
  publishOffer({ ...current, outcome: { state: "working", text: "Bringing it back." } });
  let back = 0;
  try {
    for (const item of current.items) {
      await undoDeletion(item);
      back += 1;
    }
  } catch (caught: unknown) {
    if (back > 0) courseChanged(current.courseId);
    if (offer?.id === id) publishOffer({ ...current, outcome: { state: "failed", text: refusalText(caught, "Could not bring it back.") } });
    return;
  }
  courseChanged(current.courseId);
  if (offer?.id === id) publishOffer({ ...current, outcome: { state: "done", text: current.undoneText } });
}

function subscribeOffer(listener: () => void): () => void {
  offerListeners.add(listener);
  return () => {
    offerListeners.delete(listener);
  };
}

/** The Undo on offer now, or null. */
export function currentUndoOffer(): UndoOffer | null {
  return offer;
}

export function useUndoOffer(): UndoOffer | null {
  return useSyncExternalStore(subscribeOffer, currentUndoOffer, () => null);
}

/**
 * A course's version: it goes up when a delete or an Undo changed the course, so every screen
 * showing it (the course, its folders, exam pages, Exam setup, Recently deleted) reads it again.
 */
const versions = new Map<string, number>();
const versionListeners = new Set<() => void>();

export function courseChanged(courseId: string): void {
  versions.set(courseId, (versions.get(courseId) ?? 0) + 1);
  for (const listener of versionListeners) listener();
  // Home's course cards count questions and Review too.
  void refreshCatalog();
}

function subscribeVersion(listener: () => void): () => void {
  versionListeners.add(listener);
  return () => {
    versionListeners.delete(listener);
  };
}

export function useCourseVersion(courseId: string): number {
  return useSyncExternalStore(
    subscribeVersion,
    () => versions.get(courseId) ?? 0,
    () => 0,
  );
}

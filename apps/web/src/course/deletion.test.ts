import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, type ExamDeletion, type FolderDeletion, type SetDeletion } from "../api";
import {
  currentUndoOffer,
  deleteConfirmed,
  deletionSummary,
  dismissUndo,
  doomedOf,
  isDeletionChanged,
  offerUndo,
  takeUndo,
  warningParts,
  type DeletionPreview,
} from "./deletion";

const SET = "0b9c8d7e-6f5a-4b3c-8d2e-1f0a9b8c7d6e";
const FOLDER = "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d";
const EXAM = "2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f";
const COURSE = "8d3c56f1-5f43-4c62-9d0e-7a3b1f2e4c55";

const unchanged = { before: 0, after: 0 };
const progress = { answeredCount: unchanged, fullyRightCount: unchanged, reviewCount: unchanged, points: unchanged, maxPoints: unchanged, wrongCount: unchanged };

function set(title: string, message: string): DeletionPreview {
  const preview: SetDeletion = {
    setId: SET,
    title,
    kind: "practice",
    folderId: FOLDER,
    folderName: "Week 4",
    examPageId: null,
    questionCount: 3,
    versionCount: 1,
    answeredCount: 0,
    reviewCount: 0,
    progress,
    message,
    refusal: null,
    confirm: "set-token",
    undoDays: 30,
  };
  return { kind: "set", preview };
}

function folder(name: string, setCount: number, message: string): DeletionPreview {
  const preview: FolderDeletion = {
    folderId: FOLDER,
    name,
    examPageId: null,
    examPageName: null,
    sets: [],
    setCount,
    questionCount: 5,
    answeredCount: 0,
    reviewCount: 0,
    pastExamCount: 0,
    progress,
    message,
    refusal: null,
    confirm: "folder-token",
    undoDays: 30,
  };
  return { kind: "folder", preview };
}

function exam(message: string): DeletionPreview {
  const preview: ExamDeletion = {
    examId: EXAM,
    courseId: COURSE,
    startedAt: "2026-10-12T14:00:00Z",
    finishedAt: "2026-10-12T15:00:00Z",
    questionCount: 21,
    answeredCount: 0,
    changedCount: 0,
    unansweredCount: 0,
    progress,
    message,
    refusal: null,
    confirm: "exam-token",
    undoDays: 30,
  };
  return { kind: "exam", preview };
}

/** Stands in for the API: each request gets the next answer, and is recorded. */
function fakeApi(...answers: { status: number; body?: unknown }[]) {
  const calls: { url: string; method: string }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, init?: RequestInit) => {
      calls.push({ url, method: init?.method ?? "GET" });
      // Home's course cards are read again after every change; they are not what is tested here.
      if (url === "/api/semesters") return Promise.resolve(new Response(JSON.stringify({ semesters: [] }), { status: 200 }));
      const answer = answers.shift() ?? { status: 204 };
      return Promise.resolve(new Response(answer.body === undefined ? null : JSON.stringify(answer.body), { status: answer.status }));
    }),
  );
  return calls;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("warningParts", () => {
  it("makes the server's question the title and keeps the rest word for word", () => {
    const warning = folder("Week 4", 2, "Delete Week 4? Its 2 sets go with it: Anxiety A and Anxiety B, 5 questions in all. You can undo this for 30 days.");
    expect(warningParts(warning)).toEqual({
      title: "Delete Week 4?",
      message: "Its 2 sets go with it: Anxiety A and Anxiety B, 5 questions in all. You can undo this for 30 days.",
    });
  });

  it("finds the question after a name that holds a question mark itself", () => {
    const warning = set("Why? Because", "Delete Why? Because? Its 3 questions go with it. You can undo this for 30 days.");
    expect(warningParts(warning)).toEqual({ title: "Delete Why? Because?", message: "Its 3 questions go with it. You can undo this for 30 days." });
  });

  it("titles a past exam's warning by its question", () => {
    expect(warningParts(exam("Delete this exam? You answered none of its questions, so your progress stays as it is.")).title).toBe("Delete this exam?");
  });
});

describe("deletionSummary", () => {
  it("names what went, and what came back", () => {
    expect(deletionSummary([set("Anxiety A", "")], "Deleted")).toBe("Deleted “Anxiety A”.");
    expect(deletionSummary([folder("Week 4", 3, "")], "Deleted")).toBe("Deleted Week 4 and its 3 sets.");
    expect(deletionSummary([folder("Week 4", 1, "")], "Brought back")).toBe("Brought back Week 4 and its set.");
    expect(deletionSummary([folder("Week 4", 0, "")], "Deleted")).toBe("Deleted Week 4.");
    expect(deletionSummary([exam("")], "Brought back")).toBe("Brought back the exam.");
    expect(deletionSummary([set("Anxiety A", ""), set("Anxiety B", "")], "Deleted")).toBe("Deleted 2 sets.");
  });
});

describe("deleting", () => {
  it("sends the preview's confirm with the delete", async () => {
    const calls = fakeApi({ status: 204 });
    await deleteConfirmed(doomedOf(folder("Week 4", 2, "")), "folder token/1");
    expect(calls).toEqual([{ url: `/api/folders/${FOLDER}?confirm=folder+token%2F1`, method: "DELETE" }]);
  });

  it("tells a changed deletion from another refusal", async () => {
    fakeApi(
      { status: 409, body: { error: "deletion_changed", message: "Week 4 changed since you were warned. Look again before deleting it." } },
      { status: 409, body: { error: "in_use", message: "An exam in progress asks questions from Week 4. Finish or leave that exam first." } },
    );
    const changed = await deleteConfirmed({ kind: "folder", id: FOLDER }, "old").catch((caught: unknown) => caught);
    expect(changed).toBeInstanceOf(ApiError);
    expect(isDeletionChanged(changed)).toBe(true);
    expect((changed as ApiError).message).toBe("Week 4 changed since you were warned. Look again before deleting it.");
    const inUse = await deleteConfirmed({ kind: "folder", id: FOLDER }, "token").catch((caught: unknown) => caught);
    expect(isDeletionChanged(inUse)).toBe(false);
  });
});

describe("the Undo offer", () => {
  it("brings each item back, in order, and says so", async () => {
    const calls = fakeApi({ status: 200, body: {} }, { status: 200, body: {} });
    offerUndo(COURSE, [set("Anxiety A", ""), set("Anxiety B", "")]);
    const offer = currentUndoOffer();
    expect(offer?.text).toBe("Deleted 2 sets.");
    if (offer === null) throw new Error("no offer");
    await takeUndo(offer.id);
    expect(calls.filter((call) => call.method === "POST").map((call) => call.url)).toEqual([`/api/practice-sets/${SET}/undo-delete`, `/api/practice-sets/${SET}/undo-delete`]);
    expect(currentUndoOffer()?.outcome).toEqual({ state: "done", text: "Brought back 2 sets." });
    dismissUndo(offer.id);
    expect(currentUndoOffer()).toBeNull();
  });

  it("shows the server's sentence when Undo is refused", async () => {
    fakeApi({ status: 409, body: { error: "undo_expired", message: "Week 4 was deleted more than 30 days ago, so it can't be brought back." } });
    offerUndo(COURSE, [folder("Week 4", 2, "")]);
    const offer = currentUndoOffer();
    if (offer === null) throw new Error("no offer");
    await takeUndo(offer.id);
    expect(currentUndoOffer()?.outcome).toEqual({ state: "failed", text: "Week 4 was deleted more than 30 days ago, so it can't be brought back." });
    dismissUndo(offer.id);
  });
});

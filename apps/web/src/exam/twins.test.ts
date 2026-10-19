import { describe, expect, it } from "vitest";
import type { QuestionMakerStatus, TwinJob, TwinJobStep } from "../api";
import { canTwin, courseTwinJobs, isRunning, listsTwinJobs, stepIcon, stepProgress, twinJobMeta, twinJobPath, twinJobState, twinJobTitle } from "./twins";

const COURSE = "8d3c56f1-5f43-4c62-9d0e-7a3b1f2e4c55";
const OTHER = "1b2c3d4e-5f60-4718-8a9b-0c1d2e3f4a5b";

function status(available: boolean, nextAvailableAt: string | null = null): QuestionMakerStatus {
  return {
    available,
    reason: available ? null : "Making questions is not available on this account. Import works on every account.",
    dailyLimit: 5,
    startedToday: 0,
    nextAvailableAt,
    levels: [],
    defaultLevel: "exam",
    sampleSize: 5,
    limits: { photos: 10, photoBytes: 5_000_000, fileBytes: 20_000_000, textCharacters: 200_000 },
    imageTypes: [],
    fileTypes: [],
  };
}

function job(over: Partial<TwinJob> = {}): TwinJob {
  return {
    id: "6a1f0b8e-2c4d-4e6f-8a0b-1c2d3e4f5a6b",
    status: "running",
    step: "twins",
    steps: [],
    course: { id: COURSE, code: "NURS 406", title: "Mental Health" },
    level: "exam",
    pool: "wrong",
    folders: [{ id: "f5", name: "Week 5", questionCount: 5, twinCount: 5, alreadyTwinned: 0 }],
    twinCount: 5,
    note: "QBank writes exam twins of 5 wrong questions in Week 5.",
    sets: [],
    exam: null,
    createdAt: "2026-10-18T17:00:00.000Z",
    updatedAt: "2026-10-18T17:00:00.000Z",
    finishedAt: null,
    failure: null,
    warnings: [],
    usage: { calls: 0, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
    ...over,
  };
}

function step(state: TwinJobStep["state"], done: number | null = null, total: number | null = null): TwinJobStep {
  return { key: "twins", label: "Exam twins", state, done, total };
}

describe("the Twin option", () => {
  it("shows only while the server says she may make questions now", () => {
    expect(canTwin(status(true))).toBe(true);
    expect(canTwin(status(false))).toBe(false);
    expect(canTwin(status(false, "2026-10-19T09:00:00.000Z"))).toBe(false);
    expect(canTwin(null)).toBe(false);
  });

  it("lists her twin jobs when she may make questions, also at the daily limit, and never for other accounts", () => {
    expect(listsTwinJobs(status(true))).toBe(true);
    expect(listsTwinJobs(status(false, "2026-10-19T09:00:00.000Z"))).toBe(true);
    expect(listsTwinJobs(status(false))).toBe(false);
    expect(listsTwinJobs(null)).toBe(false);
  });
});

describe("twin jobs", () => {
  it("keeps only the course's jobs, in the server's order", () => {
    const first = job({ id: "a" });
    const other = job({ id: "b", course: { id: OTHER, code: "NURS 401", title: "Adult Health" } });
    const last = job({ id: "c" });
    expect(courseTwinJobs([first, other, last], COURSE).map((item) => item.id)).toEqual(["a", "c"]);
  });

  it("names the folders and the pool, and says what the job is doing", () => {
    expect(twinJobTitle(job())).toBe("Week 5");
    expect(twinJobMeta(job())).toBe("5 exam twins · Wrong questions only");
    expect(twinJobMeta(job({ pool: "all", twinCount: 1 }))).toBe("1 exam twin");
    expect(twinJobState(job())).toBe("Writing");
    expect(twinJobState(job({ status: "done" }))).toBe("Ready");
    expect(twinJobState(job({ status: "failed" }))).toBe("Failed");
    expect(twinJobState(job({ status: "cancelled" }))).toBe("Cancelled");
    expect(isRunning(job())).toBe(true);
    expect(isRunning(job({ status: "done" }))).toBe(false);
  });

  it("has its own page under the course", () => {
    expect(twinJobPath(COURSE, "6a1f0b8e-2c4d-4e6f-8a0b-1c2d3e4f5a6b")).toBe(`/course/${COURSE}/twins/6a1f0b8e-2c4d-4e6f-8a0b-1c2d3e4f5a6b`);
  });
});

describe("a twin job's steps", () => {
  it("say how far each step is", () => {
    expect(stepProgress(step("done", 3, 3))).toBe("Done");
    expect(stepProgress(step("current", 2, 5))).toBe("2 of 5");
    expect(stepProgress(step("current"))).toBe("Working");
    expect(stepProgress(step("todo"))).toBe("");
    expect(stepProgress(step("failed", 1, 5))).toBe("Failed");
    expect(stepProgress(step("cancelled", 1, 5))).toBe("Cancelled");
  });

  it("mark each step by its state", () => {
    expect(stepIcon(step("done"))).toBe("circle-check");
    expect(stepIcon(step("current"))).toBe("clock");
    expect(stepIcon(step("failed"))).toBe("circle-x");
    expect(stepIcon(step("cancelled"))).toBe("circle-minus");
    expect(stepIcon(step("todo"))).toBe("circle");
  });
});

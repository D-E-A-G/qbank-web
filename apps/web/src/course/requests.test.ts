import { afterEach, describe, expect, it, vi } from "vitest";
import { createExamPage, updateExamPage } from "./requests";

const COURSE = "8d3c56f1-5f43-4c62-9d0e-7a3b1f2e4c55";
const PAGE = "3e4f5a6b-7c8d-4e9f-8a0b-2c3d4e5f6a7b";
const FOLDER = "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d";

/** Answers every request with a page and keeps what each one sent. */
function fakeApi() {
  const calls: { url: string; method: string; body: unknown }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, init?: RequestInit) => {
      calls.push({ url, method: init?.method ?? "GET", body: JSON.parse(init?.body as string) });
      const page = { id: PAGE, name: "Page 1", sortOrder: 0, weekLabels: [], folderIds: [], linkUrl: null };
      return Promise.resolve(new Response(JSON.stringify(page), { status: 200 }));
    }),
  );
  return calls;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("a page's badge in its requests", () => {
  it("is set and taken off through the page's update", async () => {
    const calls = fakeApi();
    await updateExamPage(PAGE, "Exam 1", [FOLDER], undefined, "concept");
    await updateExamPage(PAGE, "Exam 1", [FOLDER], undefined, null);
    expect(calls).toEqual([
      { url: `/api/course-exams/${PAGE}`, method: "PUT", body: { name: "Exam 1", folderIds: [FOLDER], badge: "concept" } },
      { url: `/api/course-exams/${PAGE}`, method: "PUT", body: { name: "Exam 1", folderIds: [FOLDER], badge: null } },
    ]);
  });

  it("is left out when not given, so the page keeps it", async () => {
    const calls = fakeApi();
    await updateExamPage(PAGE, "Exam 1", [FOLDER]);
    expect(calls[0]?.body).toEqual({ name: "Exam 1", folderIds: [FOLDER] });
  });

  it("is not asked for when a page is made", async () => {
    const calls = fakeApi();
    await createExamPage(COURSE, "Page 1", []);
    expect(calls).toEqual([{ url: `/api/courses/${COURSE}/course-exams`, method: "POST", body: { name: "Page 1", folderIds: [] } }]);
  });
});

import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD, STUDENT_EMAIL, signIn } from "./sign-in";

interface ExportFile {
  format: string;
  version: number;
  account: { email: string };
  courses: { id: string; answeredCount: number; reviewCount: number; review: { questionId: string }[] }[];
  attempts: { questionId: string; status: string }[];
  questionProgress: { inReview: boolean }[];
  studySessions: unknown[];
}

function bank(topic: string): string {
  return JSON.stringify({
    title: `${topic} set`,
    desc: "Invented practice set.",
    terms: {},
    questions: [
      {
        id: "Q1",
        type: "single",
        topic,
        stem: `Invented stem for ${topic}.`,
        ask: "Which action comes first?",
        options: [
          { t: "The useful action", ok: true, why: "It addresses the finding." },
          { t: "A distractor", why: "It does not change the finding." },
          { t: "Another distractor", why: "It does not change the finding either." },
        ],
        rationale: "The useful action matches the finding.",
        takeaway: "Match the action to the finding.",
        terms: [],
      },
    ],
  });
}

/** Imports a one-question course and answers it wrong, so it lands in Review. */
async function missOneQuestion(page: Page): Promise<{ courseId: string; questionId: string }> {
  const code = `X${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
  const imported = await page.request.post("/api/imports", {
    data: { source: bank("Export"), folderName: "Week 1", newCourse: { code, title: `${code} export`, semesterNumber: 1 } },
  });
  expect(imported.status(), await imported.text()).toBe(201);
  const { courseId } = (await imported.json()) as { courseId: string };
  const detail = (await (await page.request.get(`/api/courses/${courseId}`)).json()) as { folders: { sets: { questionIds: string[] }[] }[] };
  const questionId = detail.folders[0]?.sets[0]?.questionIds[0] ?? "";
  const answered = await page.request.post("/api/attempts", {
    data: { clientAttemptId: crypto.randomUUID(), questionId, response: { type: "single", choice: 1 }, guessed: false },
  });
  expect(answered.status()).toBe(201);
  return { courseId, questionId };
}

test.describe("export my progress", () => {
  test.afterEach(async ({ page }) => {
    const response = await page.request.get("/api/semesters");
    if (!response.ok()) return;
    const body = (await response.json()) as { semesters: { courses: { id: string; archivedAt: string | null }[] }[] };
    for (const course of body.semesters.flatMap((semester) => semester.courses)) {
      if (course.archivedAt === null) await page.request.patch(`/api/courses/${course.id}`, { data: { archived: true } });
    }
  });

  test("Settings downloads her answers and progress as a JSON file", async ({ page }) => {
    await signIn(page);
    const { courseId, questionId } = await missOneQuestion(page);

    await page.goto("/settings");
    await expect(page.getByText("Downloads your answers and progress as a JSON file.")).toBeVisible();
    const exportButton = page.getByRole("button", { name: "Export my progress" });
    const [download] = await Promise.all([page.waitForEvent("download"), exportButton.click()]);
    expect(download.suggestedFilename()).toMatch(/^qbank-progress-\d{4}-\d{2}-\d{2}\.json$/);
    await expect(page.getByText(`Downloaded ${download.suggestedFilename()}`)).toBeVisible();

    const file = JSON.parse(await readFile(await download.path(), "utf8")) as ExportFile;
    expect(file.format).toBe("nclex-qbank-progress");
    expect(file.version).toBe(1);
    expect(file.account.email).toBe(STUDENT_EMAIL);
    expect(file.attempts).toContainEqual(expect.objectContaining({ questionId, status: "incorrect" }));
    const course = file.courses.find((row) => row.id === courseId);
    expect(course).toMatchObject({ answeredCount: 1, reviewCount: 1 });
    expect(course?.review.map((row) => row.questionId)).toEqual([questionId]);
    expect(Array.isArray(file.studySessions)).toBe(true);

    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
  });

  test("the admin has no export, and a signed-out request gets nothing", async ({ page, browser }) => {
    await signIn(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Look" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Export my progress" })).toHaveCount(0);
    expect((await page.request.get("/api/me/export")).status()).toBe(403);

    const context = await browser.newContext();
    expect((await context.request.get("/api/me/export")).status()).toBe(401);
    await context.close();
  });
});

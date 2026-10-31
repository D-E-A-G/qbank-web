import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./sign-in";

/** A set of single-answer questions; option 0 is right. */
function set(title: string): string {
  return JSON.stringify({
    title,
    desc: "Invented practice set.",
    terms: {},
    questions: [
      {
        id: "Q1",
        type: "single",
        topic: `${title} topic`,
        stem: "Invented stem.",
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

function topicName(): string {
  return `Topic ${Math.random().toString(36).slice(2, 8)}`;
}

/** What a rename must leave alone: folders, their sets, and the pages, apart from a page's name. */
interface Held {
  questionCount: number;
  folderCount: number;
  answeredCount: number;
  reviewCount: number;
  folders: { id: string; name: string; examPageId: string | null; setIds: string[] }[];
  exams: { id: string; name: string; folderIds: string[]; linkUrl: string | null; badge: string | null }[];
}

async function held(page: Page, courseId: string): Promise<Held> {
  const response = await page.request.get(`/api/courses/${courseId}`);
  expect(response.ok()).toBe(true);
  const body = (await response.json()) as {
    questionCount: number;
    folderCount: number;
    answeredCount: number;
    reviewCount: number;
    folders: { id: string; name: string; examPageId: string | null; sets: { id: string }[] }[];
    exams: { id: string; name: string; folderIds: string[]; linkUrl: string | null; badge: string | null }[];
  };
  return {
    questionCount: body.questionCount,
    folderCount: body.folderCount,
    answeredCount: body.answeredCount,
    reviewCount: body.reviewCount,
    folders: body.folders.map((folder) => ({ id: folder.id, name: folder.name, examPageId: folder.examPageId, setIds: folder.sets.map((item) => item.id) })),
    exams: body.exams.map((exam) => ({ id: exam.id, name: exam.name, folderIds: exam.folderIds, linkUrl: exam.linkUrl, badge: exam.badge })),
  };
}

async function openHome(page: Page): Promise<void> {
  await page.getByRole("navigation", { name: /^(Sections|Tabs)$/ }).getByRole("link", { name: "Home", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Home" })).toBeVisible();
}

function sheet(page: Page, title: string) {
  return page.getByRole("dialog", { name: title });
}

async function archiveEverything(page: Page): Promise<void> {
  const response = await page.request.get("/api/semesters");
  if (!response.ok()) return;
  const body = (await response.json()) as { semesters: { courses: { id: string; archivedAt: string | null }[] }[]; topics: { id: string; archivedAt: string | null }[] };
  for (const course of [...body.semesters.flatMap((semester) => semester.courses), ...body.topics]) {
    if (course.archivedAt !== null) continue;
    await page.request.patch(`/api/courses/${course.id}`, { data: { archived: true } });
  }
}

test.describe("renaming from the screen", () => {
  test.afterEach(async ({ page }) => {
    await archiveEverything(page);
  });

  test("she renames a page, a course and a topic from the screen itself", async ({ page }) => {
    const code = `R${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
    const nextCode = `G${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
    const topic = topicName();
    const nextTopic = topicName();
    await signIn(page);

    const imported = await page.request.post("/api/imports", {
      data: { source: set("Week 1 - Set 1"), folderName: "Week 1", newCourse: { code, title: "Testing course", semesterNumber: 1 } },
    });
    expect(imported.status()).toBe(201);
    const course = (await imported.json()) as { courseId: string; folderId: string };
    const made = await page.request.post(`/api/courses/${course.courseId}/course-exams`, {
      data: { name: "Testing, Got & Tooling", folderIds: [course.folderId] },
    });
    expect(made.status()).toBe(201);
    const examPage = (await made.json()) as { id: string };

    // The page's name is one step from the page: Edit page, not Study material's Edit.
    await page.goto(`/course/${course.courseId}/exam-page/${examPage.id}`);
    await expect(page.getByRole("heading", { level: 1, name: "Testing, Got & Tooling" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Edit page", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Name and folders" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Edit the page" })).toBeVisible();
    const beforePage = await held(page, course.courseId);
    await page.getByRole("button", { name: "Edit page", exact: true }).click();
    const editor = sheet(page, "Edit page");
    await expect(editor.getByRole("textbox", { name: "Page name" })).toHaveValue("Testing, Got & Tooling");
    await editor.getByRole("textbox", { name: "Page name" }).fill("Git page");
    await editor.getByRole("button", { name: "Done" }).click();
    await expect(editor).toBeHidden();
    await expect(page.getByRole("heading", { level: 1, name: "Git page" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Study material on Git page" }).getByRole("link")).toHaveText([/^Week 1/]);
    const afterPage = await held(page, course.courseId);
    expect(afterPage).toEqual({ ...beforePage, exams: [{ ...beforePage.exams[0], name: "Git page" }] });

    // The course's name is on the course, and Home's card menu still offers Rename.
    await page.getByRole("link", { name: code, exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: code })).toBeVisible();
    await expect(page.getByRole("button", { name: "Rename", exact: true })).toBeVisible();
    const beforeCourse = await held(page, course.courseId);
    await page.getByRole("button", { name: "Rename", exact: true }).click();
    const renameCourse = sheet(page, "Rename course");
    await expect(renameCourse.getByRole("textbox", { name: "Course code" })).toHaveValue(code);
    await expect(renameCourse.getByRole("textbox", { name: "Course name" })).toHaveValue("Testing course");
    await renameCourse.getByRole("textbox", { name: "Course code" }).fill(nextCode);
    await renameCourse.getByRole("textbox", { name: "Course name" }).fill("Testing course renamed");
    await renameCourse.getByRole("button", { name: "Save" }).click();
    await expect(renameCourse).toBeHidden();
    await expect(page.getByRole("heading", { level: 1, name: nextCode })).toBeVisible();
    await expect(page.getByText("Testing course renamed · 1 question · 1 folder", { exact: true })).toBeVisible();
    await expect(page.getByRole("list", { name: "Pages" }).getByRole("link")).toHaveText([/^Git page/]);
    expect(await held(page, course.courseId)).toEqual(beforeCourse);
    await openHome(page);
    await page.getByRole("button", { name: `Actions for ${nextCode}` }).click();
    await expect(page.getByRole("menu", { name: nextCode }).getByRole("menuitem", { name: "Rename" })).toBeVisible();
    await page.keyboard.press("Escape");

    // A topic is only a name, from the topic screen.
    const madeTopic = await page.request.post("/api/topics", { data: { title: topic } });
    expect(madeTopic.status()).toBe(201);
    const topicId = ((await madeTopic.json()) as { id: string }).id;
    const topicImport = await page.request.post("/api/imports", { data: { source: set("Notes - Set 1"), folderName: "Notes", courseId: topicId } });
    expect(topicImport.status()).toBe(201);
    await page.goto(`/course/${topicId}`);
    await expect(page.getByRole("heading", { level: 1, name: topic })).toBeVisible();
    await expect(page.getByRole("button", { name: "Rename", exact: true })).toBeVisible();
    const beforeTopic = await held(page, topicId);
    await page.getByRole("button", { name: "Rename", exact: true }).click();
    const renameTopic = sheet(page, "Rename topic");
    await expect(renameTopic.getByRole("textbox", { name: "Course code" })).toHaveCount(0);
    await expect(renameTopic.getByRole("textbox", { name: "Topic name" })).toHaveValue(topic);
    await renameTopic.getByRole("textbox", { name: "Topic name" }).fill(nextTopic);
    await renameTopic.getByRole("button", { name: "Save" }).click();
    await expect(renameTopic).toBeHidden();
    await expect(page.getByRole("heading", { level: 1, name: nextTopic })).toBeVisible();
    await expect(page.getByRole("list", { name: "Folders", exact: true }).getByRole("link")).toHaveText([/^Notes/]);
    expect(await held(page, topicId)).toEqual(beforeTopic);
  });
});

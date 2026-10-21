import { describe, expect, it } from "vitest";
import type { CourseDetail, CourseExam, CourseFolder, ExamSummary, SetSummary } from "../api";
import {
  chipState,
  courseLine,
  courseName,
  examSetupPath,
  examTwinsLine,
  kindWords,
  nextPageName,
  pageMeta,
  pageRowMeta,
  pageSittings,
  pickedSummary,
  readExamPreset,
} from "./pages";

function set(questionCount: number, answeredCount = 0): SetSummary {
  return {
    id: crypto.randomUUID(),
    title: "Invented set",
    description: "",
    questionCount,
    importedAt: "2026-10-01T00:00:00Z",
    activeSince: "2026-10-01T00:00:00Z",
    status: "imported",
    canRestore: false,
    answeredCount,
    fullyRightCount: answeredCount,
    lastAnsweredAt: null,
    questionIds: [],
  };
}

function folder(id: string, name: string, sets: SetSummary[], examPageId: string | null = null): CourseFolder {
  return { id, name, sets, examPageId, sortOrder: 0, examBankCount: 0, examSets: [] };
}

function page(id: string, name: string): CourseExam {
  return { id, name, sortOrder: 0, weekLabels: [], folderIds: [], linkUrl: null };
}

const exam1 = page("p1", "Exam 1");
const exam2 = page("p2", "Exam 2");
const detail = {
  kind: "course",
  folders: [
    folder("w1", "Week 1", [set(14, 14), set(13, 2)], "p1"),
    folder("w2", "Week 2", [set(12)], "p1"),
    folder("fp", "First Pass", [set(13), set(13)]),
    folder("un", "Unsorted", []),
  ],
  exams: [exam1, exam2],
} as unknown as CourseDetail;

describe("an exam page's lines", () => {
  it("counts its folders, sets, and questions", () => {
    expect(pageRowMeta(detail, exam1)).toBe("2 folders · 39 questions");
    expect(pageMeta(detail, exam1)).toBe("2 folders · 3 practice sets · 39 questions");
    expect(pageRowMeta(detail, exam2)).toBe("No folders yet");
    expect(pageMeta(detail, exam2)).toBe("No folders yet");
  });
});

describe("the exam twins line", () => {
  it("names the folders that have twins, and is absent when none do", () => {
    const week4 = { ...folder("w4", "Week 4", [], "p1"), examBankCount: 12 };
    const week5 = { ...folder("w5", "Week 5", [], "p1"), examBankCount: 14 };
    const week6 = { ...folder("w6", "Week 6", [set(27)], "p1"), examBankCount: 15 };
    expect(examTwinsLine([week5])).toBe("Exam twins: 14 in Week 5 · exams draw from these first");
    expect(examTwinsLine([week4, folder("plain", "Week 3", [], "p1"), week5, week6])).toBe(
      "Exam twins: 41 in Week 4, Week 5 and Week 6 · exams draw from these first",
    );
    expect(examTwinsLine([folder("plain", "Week 3", [], "p1")])).toBe("");
  });
});

describe("pageSittings", () => {
  it("keeps the exams the server says belong to the page", () => {
    const sittings = [{ id: "a", courseExamId: "p1" }, { id: "b", courseExamId: null }, { id: "c", courseExamId: "p2" }] as ExamSummary[];
    expect(pageSittings(sittings, "p1").map((sitting) => sitting.id)).toEqual(["a"]);
  });
});

describe("nextPageName", () => {
  it("counts on from the pages she has, skipping a name in use", () => {
    expect(nextPageName([], "course")).toBe("Exam 1");
    expect(nextPageName([{ name: "Exam 1" }], "course")).toBe("Exam 2");
    expect(nextPageName([{ name: "Midterm" }, { name: "exam 3" }], "course")).toBe("Exam 4");
  });

  it("names a topic's study pages Page 1, Page 2", () => {
    expect(nextPageName([], "topic")).toBe("Page 1");
    expect(nextPageName([{ name: "Systems design" }], "topic")).toBe("Page 2");
    expect(nextPageName([{ name: "Intro" }, { name: "page 3" }], "topic")).toBe("Page 4");
  });
});

describe("a course's and a topic's words", () => {
  it("keeps every word her courses say", () => {
    expect(kindWords("course")).toEqual({
      container: "course",
      Container: "Course",
      home: "Courses",
      page: "exam page",
      Page: "Exam page",
      pages: "Exam pages",
      numbered: "Exam",
      addFolders: "Add the folders this exam covers.",
    });
  });

  it("calls a topic's exam pages study pages, and goes back to Topics", () => {
    expect(kindWords("topic")).toEqual({
      container: "topic",
      Container: "Topic",
      home: "Topics",
      page: "study page",
      Page: "Study page",
      pages: "Study pages",
      numbered: "Page",
      addFolders: "Add the folders this page covers.",
    });
  });

  it("names a course by its code and a topic by its name", () => {
    const course = { kind: "course", code: "NURS 420", title: "Health assessment" } as const;
    const topic = { kind: "topic", code: "", title: "SWE Hire" } as const;
    expect(courseName(course)).toBe("NURS 420");
    expect(courseLine(course)).toBe("NURS 420 · Health assessment");
    expect(courseName(topic)).toBe("SWE Hire");
    expect(courseLine(topic)).toBe("SWE Hire");
  });
});

describe("Start exam's address", () => {
  it("carries the page's name and its folders to Exam setup", () => {
    const path = examSetupPath("course", "Exam 2", ["f1", "f2"]);
    expect(path).toBe("/course/course/exam?exam=Exam+2&folder=f1&folder=f2");
    expect(readExamPreset(path.slice(path.indexOf("?")))).toEqual({ name: "Exam 2", folderIds: ["f1", "f2"] });
  });

  it("is no preset without a name or a folder", () => {
    expect(readExamPreset("")).toBeNull();
    expect(readExamPreset("?exam=Exam+2")).toBeNull();
    expect(readExamPreset("?folder=f1")).toBeNull();
  });
});

describe("the exam page editor's chips", () => {
  it("greys a folder another page holds and names that page", () => {
    expect(chipState(detail, "p2", [], "w1")).toEqual({ kind: "taken", pageName: "Exam 1" });
    expect(chipState(detail, null, [], "w1")).toEqual({ kind: "taken", pageName: "Exam 1" });
    expect(chipState(detail, "p1", [], "w1")).toEqual({ kind: "off" });
    expect(chipState(detail, "p1", ["w1"], "w1")).toEqual({ kind: "on" });
    expect(chipState(detail, "p2", ["fp"], "fp")).toEqual({ kind: "on" });
    expect(chipState(detail, "p2", [], "fp")).toEqual({ kind: "off" });
  });

  it("names a page it no longer has by its kind", () => {
    const stray = { ...detail, folders: [folder("w9", "Week 9", [], "gone")] };
    expect(chipState(stray, null, [], "w9")).toEqual({ kind: "taken", pageName: "another exam page" });
    expect(chipState({ ...stray, kind: "topic" }, null, [], "w9")).toEqual({ kind: "taken", pageName: "another study page" });
  });

  it("sums what is ticked", () => {
    expect(pickedSummary(detail, [])).toBe("No folders yet");
    expect(pickedSummary(detail, ["fp"])).toBe("1 folder · 26 questions");
    expect(pickedSummary(detail, ["fp", "w2", "un"])).toBe("3 folders · 38 questions");
  });
});

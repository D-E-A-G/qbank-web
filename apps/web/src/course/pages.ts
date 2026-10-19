import type { CourseDetail, CourseExam, CourseFolder, ExamSummary } from "../api";
import { pageFolders, setsProgress, type FolderProgress } from "./folders";

/** How far she is through an exam page's folders, added up from their practice sets. */
export function pageProgress(course: CourseDetail, page: CourseExam): FolderProgress {
  return setsProgress(pageFolders(course, page.id).flatMap((folder) => folder.sets));
}

/** An exam page's row on the course page: "5 folders · 217 questions", or "No folders yet". */
export function pageRowMeta(course: CourseDetail, page: CourseExam): string {
  const folders = pageFolders(course, page.id);
  if (folders.length === 0) return "No folders yet";
  return `${plural(folders.length, "folder")} · ${plural(pageProgress(course, page).questionCount, "question")}`;
}

/** The line under an exam page's name: "5 folders · 16 practice sets · 217 questions", or "No folders yet". */
export function pageMeta(course: CourseDetail, page: CourseExam): string {
  const folders = pageFolders(course, page.id);
  if (folders.length === 0) return "No folders yet";
  const progress = pageProgress(course, page);
  return `${plural(folders.length, "folder")} · ${plural(progress.setCount, "practice set")} · ${plural(progress.questionCount, "question")}`;
}

/**
 * The line under Start exam when a folder on the page has exam twins, or "" when none do.
 * "Exam twins: 14 in Week 5 · exams draw from these first". Several folders are named in her order:
 * "41 in Week 4, Week 5 and Week 6".
 */
export function examTwinsLine(folders: readonly CourseFolder[]): string {
  const banks = folders.filter((folder) => folder.examBankCount > 0);
  if (banks.length === 0) return "";
  const count = banks.reduce((sum, folder) => sum + folder.examBankCount, 0);
  return `Exam twins: ${String(count)} in ${joined(banks.map((folder) => folder.name))} · exams draw from these first`;
}

/** Her finished exams that belong to an exam page: the server names the page that holds all their folders. */
export function pageSittings(sittings: readonly ExamSummary[], examPageId: string): ExamSummary[] {
  return sittings.filter((sitting) => sitting.courseExamId === examPageId);
}

/** "Exam 3" for a course with two exam pages, skipping a name already used. */
export function nextPageName(pages: readonly { name: string }[]): string {
  const used = new Set(pages.map((page) => page.name.trim().toLowerCase()));
  let number = pages.length + 1;
  while (used.has(`exam ${String(number)}`)) number += 1;
  return `Exam ${String(number)}`;
}

/** Where an exam page's Start exam goes: Exam setup with its folders ticked and its name shown. */
export function examSetupPath(courseId: string, name: string, folderIds: readonly string[]): string {
  const query = new URLSearchParams([["exam", name], ...folderIds.map((id): [string, string] => ["folder", id])]);
  return `/course/${courseId}/exam?${query.toString()}`;
}

/** The exam page and folders Exam setup arrives with, from the address Start exam opened. */
export interface ExamPreset {
  name: string;
  folderIds: string[];
}

export function readExamPreset(search: string): ExamPreset | null {
  const query = new URLSearchParams(search);
  const name = query.get("exam")?.trim() ?? "";
  const folderIds = query.getAll("folder").filter((id) => id.trim() !== "");
  return name === "" || folderIds.length === 0 ? null : { name, folderIds };
}

/** A folder chip in the exam page editor: on this page, on another one (named), or free to tap. */
export type ChipState = { kind: "on" } | { kind: "off" } | { kind: "taken"; pageName: string };

/** `editing` is the page being edited, or null for a new one; `picked` is what the editor has ticked. */
export function chipState(course: CourseDetail, editing: string | null, picked: readonly string[], folderId: string): ChipState {
  if (picked.includes(folderId)) return { kind: "on" };
  const holder = course.folders.find((item) => item.id === folderId)?.examPageId ?? null;
  if (holder === null || holder === editing) return { kind: "off" };
  const owner = course.exams.find((page) => page.id === holder);
  return { kind: "taken", pageName: owner?.name ?? "another exam page" };
}

/** The live line under the chips: "3 folders · 83 questions", or "No folders yet". */
export function pickedSummary(course: CourseDetail, picked: readonly string[]): string {
  if (picked.length === 0) return "No folders yet";
  const sets = course.folders.filter((folder) => picked.includes(folder.id)).flatMap((folder) => folder.sets);
  return `${plural(picked.length, "folder")} · ${plural(setsProgress(sets).questionCount, "question")}`;
}

function plural(count: number, noun: string): string {
  return `${String(count)} ${count === 1 ? noun : `${noun}s`}`;
}

/** "Week 5", "Week 4 and Week 5", or "Week 4, Week 5 and Week 6". */
function joined(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1) ?? ""}`;
}

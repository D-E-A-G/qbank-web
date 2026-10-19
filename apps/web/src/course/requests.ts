import { api, type CourseExam, type CourseFolder } from "../api";

/** Only the name changes: its sets, their progress, its exam page and her past exams stay with it. */
export async function renameFolder(folderId: string, name: string): Promise<void> {
  await api<CourseFolder>(`/api/folders/${folderId}`, { method: "PATCH", json: { name } });
}

/** Puts a folder on an exam page, or on none (null). It goes to the end of that list. */
export async function putOnExamPage(folderId: string, examPageId: string | null): Promise<void> {
  await api<CourseFolder>(`/api/folders/${folderId}`, { method: "PATCH", json: { examPageId } });
}

/** A new, empty folder at the end of the course's Folders list. */
export async function createFolder(courseId: string, name: string): Promise<CourseFolder> {
  return api<CourseFolder>(`/api/courses/${courseId}/folders`, { method: "POST", json: { name } });
}

/** Moves a set, with every older version of it, into another folder. Answers and progress go with it. */
export async function moveSet(setId: string, folderId: string): Promise<void> {
  await api<CourseFolder>(`/api/practice-sets/${setId}/move`, { method: "POST", json: { folderId } });
}

/** Saves one list's order: an exam page's folders, or the course's Folders list (null). */
export async function saveFolderOrder(courseId: string, examPageId: string | null, folderIds: readonly string[]): Promise<void> {
  await api(`/api/courses/${courseId}/folder-order`, { method: "PUT", json: { examPageId, folderIds } });
}

export async function createExamPage(courseId: string, name: string, folderIds: readonly string[]): Promise<CourseExam> {
  return api<CourseExam>(`/api/courses/${courseId}/course-exams`, { method: "POST", json: { name, folderIds } });
}

export async function updateExamPage(examPageId: string, name: string, folderIds: readonly string[]): Promise<CourseExam> {
  return api<CourseExam>(`/api/course-exams/${examPageId}`, { method: "PUT", json: { name, folderIds } });
}

/** Its folders go back to the course's Folders list. No set moves. */
export async function deleteExamPage(examPageId: string): Promise<void> {
  await api(`/api/course-exams/${examPageId}`, { method: "DELETE" });
}

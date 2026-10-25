import { api, type CourseExam, type CourseFolder, type SemesterCourse } from "../api";

/** Only the name changes: its sets, their progress, its exam page and her past exams stay with it. */
export async function renameFolder(folderId: string, name: string): Promise<void> {
  await api<CourseFolder>(`/api/folders/${folderId}`, { method: "PATCH", json: { name } });
}

/** Puts a folder on an exam page, or on none (null). It goes to the end of that list. */
export async function putOnExamPage(folderId: string, examPageId: string | null): Promise<void> {
  await api<CourseFolder>(`/api/folders/${folderId}`, { method: "PATCH", json: { examPageId } });
}

/** A new, empty folder at the end of the course's Folders list, or of an exam page's folders. */
export async function createFolder(courseId: string, name: string, examPageId: string | null = null): Promise<CourseFolder> {
  return api<CourseFolder>(`/api/courses/${courseId}/folders`, { method: "POST", json: examPageId === null ? { name } : { name, examPageId } });
}

/** Moves a set, with every older version of it, into another folder. Answers and progress go with it. */
export async function moveSet(setId: string, folderId: string): Promise<void> {
  await api<CourseFolder>(`/api/practice-sets/${setId}/move`, { method: "POST", json: { folderId } });
}

/** Saves one list's order: an exam page's folders, or the course's Folders list (null). */
export async function saveFolderOrder(courseId: string, examPageId: string | null, folderIds: readonly string[]): Promise<void> {
  await api(`/api/courses/${courseId}/folder-order`, { method: "PUT", json: { examPageId, folderIds } });
}

/** `linkUrl` is a study page's primer link; left out, the page has none. */
export async function createExamPage(courseId: string, name: string, folderIds: readonly string[], linkUrl?: string | null): Promise<CourseExam> {
  return api<CourseExam>(`/api/courses/${courseId}/course-exams`, { method: "POST", json: { name, folderIds, linkUrl } });
}

/** `linkUrl` null takes the primer link off; left out, the page keeps it. */
export async function updateExamPage(examPageId: string, name: string, folderIds: readonly string[], linkUrl?: string | null): Promise<CourseExam> {
  return api<CourseExam>(`/api/course-exams/${examPageId}`, { method: "PUT", json: { name, folderIds, linkUrl } });
}

/** Its folders go back to the course's Folders list. No set moves. */
export async function deleteExamPage(examPageId: string): Promise<void> {
  await api(`/api/course-exams/${examPageId}`, { method: "DELETE" });
}

/** A study topic of hers, after her other topics. A name another of her topics has is refused. */
export async function createTopic(title: string): Promise<SemesterCourse> {
  return api<SemesterCourse>("/api/topics", { method: "POST", json: { title } });
}

/** Her topics in this order. It must name every one of them, archived ones included. */
export async function saveTopicOrder(topicIds: readonly string[]): Promise<void> {
  await api("/api/topic-order", { method: "PUT", json: { topicIds } });
}

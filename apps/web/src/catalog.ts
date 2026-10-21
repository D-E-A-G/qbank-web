import { useSyncExternalStore } from "react";
import { api, type CatalogRecord, type CourseKind, type SemesterRecord } from "./api";

export interface CourseLink {
  id: string;
  /** "topic" for a study topic: a course with no semester, called by its title. */
  kind: CourseKind;
  code: string;
  title: string;
  sortOrder: number;
  archivedAt: string | null;
  questionCount: number;
  folderCount: number;
  reviewCount: number;
  answeredCount: number;
  fullyRightCount: number;
  points: number;
  maxPoints: number;
}

export interface SemesterGroup {
  id: string;
  number: number;
  label: string;
  name: string;
  startsOn: string | null;
  endsOn: string | null;
  /** Set when she archived the semester by hand; Home shows it in Archived. */
  archivedAt: string | null;
  courses: readonly CourseLink[];
  /** Shown before the server has answered, so the shell still has its three semesters. */
  placeholder: boolean;
}

interface CatalogSnapshot {
  semesters: readonly SemesterGroup[];
  /** Her study topics in her order, archived ones included. */
  topics: readonly CourseLink[];
  fromServer: boolean;
}

const listeners = new Set<() => void>();

function placeholders(): SemesterGroup[] {
  return [1, 2, 3].map((number) => ({
    id: `semester-${String(number)}`,
    number,
    label: `Semester ${String(number)}`,
    name: `Semester ${String(number)}`,
    startsOn: null,
    endsOn: null,
    archivedAt: null,
    courses: [],
    placeholder: true,
  }));
}

let snapshot: CatalogSnapshot = { semesters: placeholders(), topics: [], fromServer: false };

function publish(next: CatalogSnapshot): void {
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCatalog(): CatalogSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}

/** Her course or topic with this id, from Home's list, so a screen can name it before it loads. */
export function useCatalogCourse(courseId: string): CourseLink | undefined {
  const { semesters, topics } = useCatalog();
  return findCourse({ semesters, topics }, courseId);
}

export function findCourse(catalog: Pick<CatalogSnapshot, "semesters" | "topics">, courseId: string): CourseLink | undefined {
  return [...catalog.semesters.flatMap((semester) => semester.courses), ...catalog.topics].find((course) => course.id === courseId);
}

export interface HomeLayout {
  /** Her semesters in use, each with its courses in use. */
  semesters: { semester: SemesterGroup; courses: CourseLink[] }[];
  /** Her topics in use, in her order. */
  topics: CourseLink[];
  /** What she archived by hand, under its semester or Study topics: a semester with every course, or the courses and topics alone. */
  archived: { key: string; title: string; courses: CourseLink[] }[];
}

/** Home's groups, which the sidebar and Import's menu share: what she studies now, then what she archived. */
export function homeLayout(catalog: Pick<CatalogSnapshot, "semesters" | "topics">): HomeLayout {
  const inUse = (course: CourseLink) => course.archivedAt === null;
  const archived: HomeLayout["archived"] = [];
  for (const semester of catalog.semesters) {
    const courses = semester.archivedAt === null ? semester.courses.filter((course) => !inUse(course)) : [...semester.courses];
    if (semester.archivedAt !== null || courses.length > 0) archived.push({ key: semester.id, title: semester.label, courses });
  }
  const archivedTopics = catalog.topics.filter((topic) => !inUse(topic));
  if (archivedTopics.length > 0) archived.push({ key: "topics", title: "Study topics", courses: archivedTopics });
  return {
    semesters: catalog.semesters
      .filter((semester) => semester.archivedAt === null)
      .map((semester) => ({ semester, courses: semester.courses.filter(inUse) })),
    topics: catalog.topics.filter(inUse),
    archived,
  };
}

export async function refreshCatalog(): Promise<void> {
  try {
    publish(fromRecord(await api<CatalogRecord>("/api/semesters")));
  } catch {
    if (!snapshot.fromServer) publish({ semesters: placeholders(), topics: [], fromServer: false });
  }
}

/** What the server answered. A new account has no semester, so none is shown: no placeholders once the server has said so. */
export function fromRecord(record: CatalogRecord): CatalogSnapshot {
  return { semesters: record.semesters.map(toGroup), topics: record.topics, fromServer: true };
}

function toGroup(semester: SemesterRecord): SemesterGroup {
  return {
    id: semester.id,
    number: semester.number,
    label: semester.name,
    name: semester.name,
    startsOn: semester.startsOn,
    endsOn: semester.endsOn,
    archivedAt: semester.archivedAt,
    placeholder: false,
    courses: [...semester.courses].sort((a, b) => a.sortOrder - b.sortOrder || a.code.localeCompare(b.code)),
  };
}

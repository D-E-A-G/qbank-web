import { useSyncExternalStore } from "react";
import { api, type SemesterRecord } from "./api";

export interface CourseLink {
  id: string;
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
  courses: readonly CourseLink[];
  /** Shown before the server has answered, so the shell still has its three semesters. */
  placeholder: boolean;
}

interface CatalogSnapshot {
  semesters: readonly SemesterGroup[];
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
    courses: [],
    placeholder: true,
  }));
}

let snapshot: CatalogSnapshot = { semesters: placeholders(), fromServer: false };

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

export async function refreshCatalog(): Promise<void> {
  try {
    const body = await api<{ semesters: SemesterRecord[] }>("/api/semesters");
    const semesters = body.semesters.map(toGroup);
    publish({ semesters: semesters.length > 0 ? semesters : placeholders(), fromServer: true });
  } catch {
    if (!snapshot.fromServer) publish({ semesters: placeholders(), fromServer: false });
  }
}

function toGroup(semester: SemesterRecord): SemesterGroup {
  return {
    id: semester.id,
    number: semester.number,
    label: semester.name,
    name: semester.name,
    startsOn: semester.startsOn,
    endsOn: semester.endsOn,
    placeholder: false,
    courses: [...semester.courses].sort((a, b) => a.sortOrder - b.sortOrder || a.code.localeCompare(b.code)),
  };
}

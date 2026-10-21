import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, api, type CourseDetail, type CourseKind, type ExamSetup } from "../api";
import { useCatalogCourse } from "../catalog";
import { useSession } from "../login/session-context";
import { useCourseVersion } from "./deletion";
import { courseName, kindWords, type KindWords } from "./pages";

interface Loaded {
  courseId: string;
  course: CourseDetail | null;
  setup: ExamSetup | null;
  error: string | null;
  setupError: string | null;
}

/**
 * The course, and with `withSetup` her past exams and what each exam page would draw. The course
 * shows as soon as it arrives; the setup follows. `replace` shows a change before the server has
 * answered (her new folder order), and `reload` reads both again, as a delete or an Undo does.
 */
export function useCourse(courseId: string, withSetup = false) {
  const [loaded, setLoaded] = useState<Loaded>(() => blank(courseId));
  const [tick, setTick] = useState(0);
  const version = useCourseVersion(courseId);
  // Counts the changes `replace` showed. A course read that started before the latest one is older
  // than what is on screen, so it is dropped rather than undoing her change.
  const edits = useRef(0);

  useEffect(() => {
    let cancel = false;
    const startedAt = edits.current;
    const update = (change: Partial<Loaded>) => {
      if (cancel) return;
      setLoaded((current) => ({ ...(current.courseId === courseId ? current : blank(courseId)), ...change }));
    };
    void api<CourseDetail>(`/api/courses/${courseId}`).then(
      (course) => {
        if (edits.current === startedAt) update({ course, error: null });
      },
      (caught: unknown) => {
        update({ error: message(caught, "Could not load that course.") });
      },
    );
    if (withSetup) {
      void api<ExamSetup>(`/api/courses/${courseId}/exams`).then(
        (setup) => {
          update({ setup, setupError: null });
        },
        (caught: unknown) => {
          update({ setupError: message(caught, "Could not load the course's exams.") });
        },
      );
    }
    return () => {
      cancel = true;
    };
  }, [courseId, withSetup, tick, version]);

  const reload = useCallback(() => {
    setTick((value) => value + 1);
  }, []);

  const replace = useCallback(
    (course: CourseDetail) => {
      edits.current += 1;
      setLoaded((current) => (current.courseId === courseId ? { ...current, course } : current));
    },
    [courseId],
  );

  // What another course left behind is never shown while this one loads.
  const current = loaded.courseId === courseId ? loaded : blank(courseId);
  return { course: current.course, setup: current.setup, error: current.error, setupError: current.setupError, reload, replace };
}

/**
 * What a screen under a course or topic calls it: its name ("NURS 420", or a topic's title), or
 * null until it is known, and the words for its kind. Home's card answers before the course is read.
 */
export function useCourseNaming(courseId: string, course: { kind: CourseKind; code: string; title: string } | null): { name: string | null; words: KindWords } {
  const card = useCatalogCourse(courseId);
  const known = course ?? card;
  return { name: known ? courseName(known) : null, words: kindWords(known?.kind ?? "course") };
}

/** She lands on the course she used last, so opening it, or one of its folders or exam pages, says so. */
export function useRememberPlace(courseId: string): void {
  const session = useSession();
  useEffect(() => {
    if (session.user.role !== "student") return;
    void api("/api/me/place", { method: "PUT", json: { courseId } }).catch((caught: unknown) => {
      console.error(caught);
    });
  }, [courseId, session.user.role]);
}

function blank(courseId: string): Loaded {
  return { courseId, course: null, setup: null, error: null, setupError: null };
}

function message(caught: unknown, fallback: string): string {
  return caught instanceof ApiError ? caught.message : fallback;
}

import { useRef, useState } from "react";
import { ApiError, type CourseDetail, type CourseFolder } from "../api";
import { reordered, withOrder } from "./folders";
import { saveFolderOrder } from "./requests";

/**
 * Her order for one list of folders: an exam page's, or the course's Folders list (null). A move
 * shows at once, and the saves go one at a time, only the newest waiting order being sent, so the
 * server always ends on the order she sees. A refused save says why and reads the course again.
 */
export function useFolderOrder({
  course,
  examPageId,
  folders,
  replace,
  reload,
}: {
  course: CourseDetail | null;
  examPageId: string | null;
  folders: readonly CourseFolder[];
  replace: (course: CourseDetail) => void;
  reload: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const latest = useRef(0);

  const move = (from: number, to: number) => {
    if (!course) return;
    const ids = reordered(
      folders.map((folder) => folder.id),
      from,
      to,
    );
    replace(withOrder(course, ids));
    setError(null);
    latest.current += 1;
    const turn = latest.current;
    queue.current = queue.current
      .then(async () => {
        // A newer move is waiting, and it carries this one too.
        if (turn !== latest.current) return;
        await saveFolderOrder(course.id, examPageId, ids);
      })
      .catch((caught: unknown) => {
        // The moves still waiting were made on top of the refused one, so they are dropped too.
        latest.current += 1;
        setError(caught instanceof ApiError ? caught.message : "Could not save the new order.");
        reload();
      });
  };

  return { move, error };
}

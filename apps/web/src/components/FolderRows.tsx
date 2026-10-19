import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { CourseFolder } from "../api";
import { dragTo, shiftOf, type Drag } from "../course/drag";
import { folderMeta, folderProgress } from "../course/folders";
import { folderPath } from "../router";
import { Icon } from "./Icon";
import { NavRow, RowBody } from "./NavRow";

/**
 * One list of folders, in her order: each row opens the folder. In edit mode each row has up and
 * down buttons and a grip to drag it; `onMove` gets the old and the new position. Up and down are
 * there because dragging alone is unreliable on touch screens and with VoiceOver.
 */
export function FolderRows({
  courseId,
  folders,
  editing,
  label,
  onMove,
}: {
  courseId: string;
  folders: readonly CourseFolder[];
  editing: boolean;
  /** Names the list for VoiceOver, such as "Folders" or "Study material on Exam 2". */
  label: string;
  onMove: (from: number, to: number) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const listKey = folders.map((folder) => folder.id).join(" ");
  const [held, setHeld] = useState<{ list: string; drag: Drag } | null>(null);
  // A drag belongs to the list as it was when it began. If the list changes under it (a reload, or
  // another device) or edit mode ends, it is dropped rather than moving whatever row is there now.
  const drag = held !== null && editing && held.list === listKey ? held.drag : null;
  const [said, setSaid] = useState("");
  // The up or down button she used, so it keeps focus once its row has moved.
  const refocus = useRef<{ id: string; dir: "up" | "down" } | null>(null);

  useEffect(() => {
    const target = refocus.current;
    if (target === null) return;
    refocus.current = null;
    listRef.current?.querySelector<HTMLElement>(`[data-folder="${target.id}"][data-dir="${target.dir}"]`)?.focus();
  }, [listKey]);

  const move = (from: number, to: number) => {
    const folder = folders[from];
    if (folder === undefined || to < 0 || to >= folders.length || to === from) return;
    onMove(from, to);
    setSaid(`${folder.name} moved to ${String(to + 1)} of ${String(folders.length)}.`);
  };

  const step = (index: number, dir: "up" | "down") => {
    const folder = folders[index];
    if (folder === undefined) return;
    refocus.current = { id: folder.id, dir };
    move(index, dir === "up" ? index - 1 : index + 1);
  };

  const grab = (index: number, event: ReactPointerEvent<HTMLSpanElement>) => {
    const rows = listRef.current?.children;
    if (rows === undefined || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rects = Array.from(rows, (row) => row.getBoundingClientRect());
    setHeld({
      list: listKey,
      drag: {
        from: index,
        to: index,
        pointerId: event.pointerId,
        startY: event.clientY,
        offset: 0,
        tops: rects.map((rect) => rect.top),
        heights: rects.map((rect) => rect.height),
      },
    });
  };

  const follow = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (drag?.pointerId !== event.pointerId) return;
    setHeld({ list: listKey, drag: dragTo(drag, event.clientY - drag.startY) });
  };

  const drop = (event: ReactPointerEvent<HTMLSpanElement>) => {
    setHeld(null);
    if (drag?.pointerId !== event.pointerId) return;
    move(drag.from, drag.to);
  };

  const cancel = () => {
    setHeld(null);
  };

  return (
    <>
      <ul ref={listRef} className={drag ? "list-group list-dragging" : "list-group"} aria-label={label}>
        {folders.map((folder, index) => {
          const progress = folderProgress(folder);
          const meta = folderMeta(folder, progress);
          if (!editing) {
            return (
              <li key={folder.id}>
                <NavRow to={folderPath(courseId, folder.id)} icon="folder" title={folder.name} meta={meta} progress={progress} />
              </li>
            );
          }
          const shift = drag === null ? 0 : shiftOf(drag, index);
          return (
            <li
              key={folder.id}
              className={drag?.from === index ? "list-row-lifted" : undefined}
              style={shift === 0 ? undefined : { transform: `translateY(${String(shift)}px)` }}
            >
              <div className="list-row list-row-edit">
                <RowBody icon="folder" title={folder.name} meta={meta} />
                <span className="list-tools">
                  {/* aria-disabled, not disabled, so the button she just used keeps focus at the top or bottom. */}
                  <button
                    type="button"
                    className="icon-button list-move"
                    aria-label={`Move ${folder.name} up`}
                    aria-disabled={index === 0}
                    data-folder={folder.id}
                    data-dir="up"
                    onClick={() => {
                      step(index, "up");
                    }}
                  >
                    <Icon name="chevron-up" size={20} />
                  </button>
                  <button
                    type="button"
                    className="icon-button list-move"
                    aria-label={`Move ${folder.name} down`}
                    aria-disabled={index === folders.length - 1}
                    data-folder={folder.id}
                    data-dir="down"
                    onClick={() => {
                      step(index, "down");
                    }}
                  >
                    <Icon name="chevron-down" size={20} />
                  </button>
                  <span
                    className="list-grip"
                    aria-hidden="true"
                    title="Drag to reorder"
                    onPointerDown={(event) => {
                      grab(index, event);
                    }}
                    onPointerMove={follow}
                    onPointerUp={drop}
                    onPointerCancel={cancel}
                    onLostPointerCapture={cancel}
                  >
                    <Icon name="grip-vertical" size={20} />
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="sr-only" role="status">
        {said}
      </p>
    </>
  );
}

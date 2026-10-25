import { useEffect, useState } from "react";
import { Icon, type IconName } from "./Icon";

/** What a change on Home said, and how to take it back. A refusal has no Undo. */
export interface NoticeMessage {
  id: number;
  text: string;
  icon: IconName;
  failed?: boolean;
  undo?: () => void;
}

/** How long a notice stays; it waits while her mouse is on it or it has focus. */
const SHOW_MS = 6000;

/**
 * A card at the bottom of the screen after a change that moved something out of sight, such as
 * "Archived NURS 220." with Undo: the same card as Undo after a delete. It closes by itself.
 */
export function Notice({ notice, onDismiss }: { notice: NoticeMessage | null; onDismiss: (id: number) => void }) {
  const [held, setHeld] = useState<number | null>(null);

  useEffect(() => {
    if (notice === null || held === notice.id) return;
    const timer = setTimeout(() => {
      onDismiss(notice.id);
    }, SHOW_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [notice, held, onDismiss]);

  return (
    <div className="undo-toast-wrap" role="status">
      {notice === null ? null : (
        <div
          className="undo-toast"
          onPointerMove={(event) => {
            if (event.pointerType === "mouse") setHeld(notice.id);
          }}
          onPointerLeave={() => {
            setHeld(null);
          }}
          onFocus={() => {
            setHeld(notice.id);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setHeld(null);
          }}
        >
          <span className={notice.failed === true ? "undo-toast-icon undo-toast-icon-failed" : "undo-toast-icon"}>
            <Icon name={notice.failed === true ? "circle-alert" : notice.icon} size={18} strokeWidth={2} />
          </span>
          <span className="undo-toast-text">{notice.text}</span>
          {notice.undo === undefined ? null : (
            <button
              type="button"
              className="undo-toast-action"
              onClick={() => {
                onDismiss(notice.id);
                notice.undo?.();
              }}
            >
              Undo
            </button>
          )}
          <button
            type="button"
            className="undo-toast-close"
            aria-label="Dismiss"
            onClick={() => {
              onDismiss(notice.id);
            }}
          >
            <Icon name="x" size={16} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

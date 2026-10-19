import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * A sheet with a form: Cancel, the title, and Done stay put while the body scrolls. Nothing is
 * saved until Done; Cancel, Escape, and a tap outside change nothing. While `busy`, it stays open.
 */
export function FormSheet({
  title,
  doneLabel = "Done",
  busy = false,
  error = null,
  onDone,
  onClose,
  children,
}: {
  title: string;
  doneLabel?: string;
  busy?: boolean;
  /** The server's refusal, shown at the top of the body. */
  error?: string | null;
  onDone: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // A field that asked for focus keeps it; otherwise the sheet takes it, so Escape and VoiceOver start here.
  useEffect(() => {
    if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, busy]);

  return (
    <div
      className="sheet-backdrop"
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="sheet sheet-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="sheet-head">
          <button type="button" className="sheet-head-action" disabled={busy} onClick={onClose}>
            Cancel
          </button>
          <h2 id={titleId} className="sheet-head-title">
            {title}
          </h2>
          <button type="button" className="sheet-head-action sheet-head-done" disabled={busy} onClick={onDone}>
            {doneLabel}
          </button>
        </div>
        <form
          className="sheet-body"
          onSubmit={(event) => {
            event.preventDefault();
            if (!busy) onDone();
          }}
        >
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          {children}
        </form>
      </div>
    </div>
  );
}

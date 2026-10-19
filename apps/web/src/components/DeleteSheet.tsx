import { useEffect, useId, useRef, useState } from "react";
import { courseChanged, deleteConfirmed, doomedOf, offerUndo, previewDeletion, refusalText, warningParts, type DeletionPreview, type Doomed } from "../course/deletion";
import { Button } from "./Button";

/**
 * Asks before a delete, in the server's words: its preview names everything that goes (a folder's
 * sets by name, her answers, its exam page) and the 30 days of Undo. Delete sends the preview's
 * `confirm`, so exactly what she read is deleted. When the server refuses, its sentence shows and
 * the preview is read again, so a change since (another device, an exam started) is what she sees
 * next. Once deleted, Undo is offered at the bottom of the screen, for every set this sheet
 * deleted, even when a refusal stopped it partway and she then closed it.
 */
export function DeleteSheet({
  courseId,
  items,
  title,
  onDeleted,
  onClose,
}: {
  courseId: string;
  items: readonly Doomed[];
  /** The title while the preview loads, and for more than one item ("Delete 2 sets?"). One item's title is its warning's question. */
  title: string;
  onDeleted: () => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  // What is still to delete: after a refusal partway through several, the ones already deleted are left out.
  const [left, setLeft] = useState<readonly Doomed[]>(items);
  const [round, setRound] = useState(0);
  const [previews, setPreviews] = useState<{ round: number; deletions: DeletionPreview[] } | null>(null);
  const [loadError, setLoadError] = useState<{ round: number; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // What this sheet has deleted so far, for the one Undo offered when it closes.
  const gone = useRef<DeletionPreview[]>([]);

  const cancel = () => {
    if (gone.current.length > 0) offerUndo(courseId, gone.current);
    onClose();
  };

  // Escape cancels with the latest cancel, unless a delete is on its way.
  const close = useRef(cancel);
  const busyRef = useRef(false);
  useEffect(() => {
    close.current = cancel;
    busyRef.current = busy;
  });

  useEffect(() => {
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busyRef.current) close.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    let cancel = false;
    Promise.all(left.map(previewDeletion)).then(
      (deletions) => {
        if (!cancel) setPreviews({ round, deletions });
      },
      (caught: unknown) => {
        if (!cancel) setLoadError({ round, message: refusalText(caught, "Could not check what deleting it takes with it.") });
      },
    );
    return () => {
      cancel = true;
    };
  }, [left, round]);

  const deletions = previews?.round === round ? previews.deletions : null;
  const failed = loadError?.round === round ? loadError.message : null;
  const refusals = (deletions ?? []).flatMap((deletion) => (deletion.preview.refusal === null ? [] : [deletion.preview.refusal]));
  const blocked = failed !== null || refusals.length > 0;
  const only = deletions?.length === 1 && deletions[0] !== undefined && left.length === 1 ? warningParts(deletions[0]) : null;

  const remove = async () => {
    if (deletions === null || blocked) return;
    setBusy(true);
    setError(null);
    const before = gone.current.length;
    try {
      for (const deletion of deletions) {
        await deleteConfirmed(doomedOf(deletion), deletion.preview.confirm);
        gone.current = [...gone.current, deletion];
      }
    } catch (caught: unknown) {
      // The screen underneath shows what went; Undo for it is offered once the sheet closes.
      if (gone.current.length > before) courseChanged(courseId);
      const deletedIds = new Set(gone.current.map((deletion) => doomedOf(deletion).id));
      setBusy(false);
      setError(refusalText(caught, "Could not delete it."));
      setLeft((current) => current.filter((item) => !deletedIds.has(item.id)));
      setRound((value) => value + 1);
      return;
    }
    offerUndo(courseId, gone.current);
    onDeleted();
  };

  return (
    <div
      className="sheet-backdrop"
      onClick={() => {
        if (!busy) cancel();
      }}
    >
      <div
        ref={dialogRef}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-busy={deletions === null && failed === null ? true : undefined}
        tabIndex={-1}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h2 id={titleId} className="sheet-title">
          {only?.title ?? title}
        </h2>
        {/* A refusal from the delete is said once, even when the new preview refuses with the same sentence. */}
        {error !== null && !refusals.includes(error) ? (
          <p className="form-error sheet-error" role="alert">
            {error}
          </p>
        ) : null}
        {failed !== null ? (
          <p className="form-error sheet-error" role="alert">
            {failed}
          </p>
        ) : deletions === null ? (
          <p className="sheet-message">Checking what goes with it.</p>
        ) : only !== null ? (
          <p className="sheet-message">{only.message}</p>
        ) : (
          deletions.map((deletion) => (
            <p key={doomedOf(deletion).id} className="sheet-message">
              {deletion.preview.message}
            </p>
          ))
        )}
        {refusals.map((refusal) => (
          <p key={refusal} className="form-error sheet-error" role="alert">
            {refusal}
          </p>
        ))}
        <div className="sheet-actions">
          {blocked ? null : (
            <Button
              variant="destructive"
              fullWidth
              disabled={deletions === null || busy}
              onClick={() => {
                void remove();
              }}
            >
              Delete
            </Button>
          )}
          <Button variant="plain" fullWidth disabled={busy} onClick={cancel}>
            {blocked ? "OK" : "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}

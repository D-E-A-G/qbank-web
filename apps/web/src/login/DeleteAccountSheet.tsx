import { useEffect, useId, useRef, useState } from "react";
import { Button } from "../components/Button";
import { deletionWarning, requestDeletion, type DeletionOutcome } from "./delete-account";
import { TextField } from "./ui";

type Done = Exclude<DeletionOutcome, { kind: "refused" }>;

/**
 * Settings' Delete account: what goes, in plain words, her current password, and Delete account.
 * Once the server has deleted it (or the session had already ended, or she must choose a new
 * password first), `onDone` says which. A refusal deletes nothing: its sentence shows here and she
 * stays signed in; after too many wrong passwords, Delete waits until the lock ends. Cancel,
 * Escape, and a tap outside change nothing, except while the delete is on its way.
 */
export function DeleteAccountSheet({ email, onDone, onClose }: { email: string; onDone: (outcome: Done) => void; onClose: () => void }) {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  // Escape cancels with the latest onClose, unless the delete is on its way.
  const close = useRef(onClose);
  const busyRef = useRef(false);
  useEffect(() => {
    close.current = onClose;
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

  // Once the lock's time has passed she can try again, and the line that said how long goes.
  useEffect(() => {
    if (lockedUntil === null) return;
    const timer = setTimeout(
      () => {
        setLockedUntil(null);
        setError(null);
      },
      Math.max(0, lockedUntil - Date.now()),
    );
    return () => {
      clearTimeout(timer);
    };
  }, [lockedUntil]);

  const submit = async () => {
    if (busy || lockedUntil !== null) return;
    setBusy(true);
    setError(null);
    const outcome = await requestDeletion(password);
    if (outcome.kind !== "refused") {
      onDone(outcome);
      return;
    }
    setBusy(false);
    setError(outcome.message);
    if (outcome.clearPassword) setPassword("");
    setLockedUntil(outcome.lockedUntil);
  };

  return (
    <div
      className="sheet-backdrop"
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        tabIndex={-1}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h2 id={titleId} className="sheet-title">
          Delete your user account?
        </h2>
        <p id={messageId} className="sheet-message">
          {deletionWarning(email)}
        </p>
        <form
          className="sheet-fields"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <TextField
            id="delete-account-password"
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
          />
          {error !== null ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="sheet-actions">
            <Button type="submit" variant="destructive" fullWidth disabled={busy || lockedUntil !== null}>
              {busy ? "Deleting…" : "Delete account"}
            </Button>
            <Button variant="plain" fullWidth disabled={busy} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { Button } from "./Button";
import { Icon, type IconName } from "./Icon";

/** Why the list could not be read, why an Undo was refused, or what it brought back. */
export function UndoOutcome({ loadError, error, done }: { loadError: string | null; error: string | null; done: string | null }) {
  return (
    <>
      {loadError ? <p className="form-error">{loadError}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {done ? (
        <p className="status-banner" role="status">
          <Icon name="check" size={16} strokeWidth={2} />
          <span>{done}</span>
        </p>
      ) : null}
    </>
  );
}

export function DeletedGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="group">
      <h2 className="group-header">{title}</h2>
      <ul className="list-group" aria-label={`Deleted ${title.toLowerCase()}`}>
        {children}
      </ul>
    </section>
  );
}

export function DeletedRow({
  icon = null,
  title,
  meta,
  refusal,
  readOnly,
  busy,
  label,
  onUndo,
}: {
  /** Folders, courses and topics have their icon; sets and exams have none, as in their own lists. */
  icon?: IconName | null;
  title: string;
  meta: string;
  /** Why Undo would be refused now, as the server says it ("Its folder Week 4 is deleted. Bring the folder back first."). */
  refusal: string | null;
  readOnly: boolean;
  busy: boolean;
  label: string;
  onUndo: () => void;
}) {
  return (
    <li>
      <div className="list-row">
        {icon === null ? null : (
          <span className="list-icon">
            <Icon name={icon} size={22} />
          </span>
        )}
        <span className="list-copy">
          <span className="list-title list-title-strong">{title}</span>
          <span className="list-meta">{meta}</span>
        </span>
        {readOnly ? null : (
          <Button variant="secondary" className="row-undo" aria-label={label} disabled={busy || refusal !== null} onClick={onUndo}>
            <Icon name="rotate-ccw" size={16} strokeWidth={2} />
            Undo
          </Button>
        )}
      </div>
      {refusal !== null ? <p className="list-row-note">{refusal}</p> : null}
    </li>
  );
}

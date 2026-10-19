import { useEffect, useState } from "react";
import { dismissUndo, takeUndo, useUndoOffer } from "../course/deletion";
import { Icon } from "./Icon";

/** How long Undo stays offered after a delete; Recently deleted keeps it for 30 days. */
const OFFER_MS = 8000;
/** How long "Brought back …" stays; a refusal stays as long as the offer did. */
const OUTCOME_MS = 4000;

/**
 * Undo, right after a delete: "Deleted Week 4 and its 3 sets." with Undo, at the bottom of the
 * screen, above the tab bar. Undo waits while her mouse is on it or it has focus, and closes by
 * itself; what it said once Undo was tapped stays a moment longer. The live region is always
 * there, so a screen reader announces each offer as it appears.
 */
export function UndoToast() {
  const offer = useUndoOffer();
  // Each hold belongs to the offer it was on. A button removed under the pointer or the focus
  // (Dismiss, Undo) fires no leave or blur, so a hold must never carry over to the next offer.
  const [pointer, setPointer] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const outcome = offer?.outcome ?? null;
  const waiting = outcome?.state === "working";
  const held = offer !== null && outcome === null && (pointer === offer.id || focus === offer.id);

  useEffect(() => {
    if (offer === null || held || waiting) return;
    const timer = setTimeout(
      () => {
        dismissUndo(offer.id);
      },
      outcome?.state === "done" ? OUTCOME_MS : OFFER_MS,
    );
    return () => {
      clearTimeout(timer);
    };
  }, [offer, outcome, held, waiting]);

  return (
    <div className="undo-toast-wrap" role="status">
      {offer === null ? null : (
        <div
          className="undo-toast"
          // A mouse moving over it holds it. A card that appears under a resting pointer (the
          // sheet's Delete was where it shows) is not being pointed at, and a finger never holds it.
          onPointerMove={(event) => {
            if (event.pointerType === "mouse" && pointer !== offer.id) setPointer(offer.id);
          }}
          onPointerLeave={() => {
            setPointer(null);
          }}
          onFocus={() => {
            setFocus(offer.id);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocus(null);
          }}
        >
          <span className={outcome?.state === "failed" ? "undo-toast-icon undo-toast-icon-failed" : "undo-toast-icon"}>
            <Icon name={outcome === null ? "trash-2" : outcome.state === "failed" ? "circle-alert" : outcome.state === "done" ? "check" : "rotate-ccw"} size={18} strokeWidth={2} />
          </span>
          <span className="undo-toast-text">{outcome?.text ?? offer.text}</span>
          {outcome === null ? (
            <button
              type="button"
              className="undo-toast-action"
              onClick={() => {
                void takeUndo(offer.id);
              }}
            >
              Undo
            </button>
          ) : null}
          <button
            type="button"
            className="undo-toast-close"
            aria-label="Dismiss"
            onClick={() => {
              dismissUndo(offer.id);
            }}
          >
            <Icon name="x" size={16} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

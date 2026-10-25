import { useEffect, useRef, useState } from "react";
import { refusalText, undoDeletion, type Doomed } from "./deletion";

/**
 * A Recently deleted list and its Undos. It is read again whenever `version` goes up. Every Undo on
 * its way, and each that worked until the list is read again without it, keeps its button off, so
 * it is never sent twice. `changed` tells the screens what an Undo changed, whether it worked or not.
 */
export function useUndoList<T>(read: () => Promise<T>, version: number, changed: (item: Doomed) => void) {
  const [list, setList] = useState<T | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<ReadonlySet<string>>(() => new Set());
  const inFlight = useRef(new Set<string>());
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    read().then(
      (body) => {
        if (cancel) return;
        setLoadError(null);
        setList(body);
        // The list now says what came back, so only the Undos still on their way stay off.
        setBusy(new Set(inFlight.current));
      },
      (caught: unknown) => {
        if (!cancel) setLoadError(refusalText(caught, "Could not load Recently deleted."));
      },
    );
    return () => {
      cancel = true;
    };
  }, [read, version]);

  const undo = (item: Doomed, name: string) => {
    inFlight.current.add(item.id);
    setBusy((current) => new Set(current).add(item.id));
    setError(null);
    setDone(null);
    undoDeletion(item).then(
      () => {
        inFlight.current.delete(item.id);
        setDone(`Brought back ${name}.`);
        changed(item);
      },
      (caught: unknown) => {
        inFlight.current.delete(item.id);
        setBusy((current) => {
          const next = new Set(current);
          next.delete(item.id);
          return next;
        });
        setError(refusalText(caught, "Could not bring it back."));
        changed(item);
      },
    );
  };

  return { list, loadError, error, done, busy, undo };
}

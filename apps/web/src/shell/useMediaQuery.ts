import { useSyncExternalStore } from "react";

/** iPhone keeps bottom tabs, including in landscape. iPad and Mac get the sidebar. */
export const WIDE_LAYOUT_QUERY = "(min-width: 768px) and (min-height: 600px)";

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function subscribe(query: string, onStoreChange: () => void): () => void {
  const media = window.matchMedia(query);
  media.addEventListener("change", onStoreChange);
  return () => {
    media.removeEventListener("change", onStoreChange);
  };
}

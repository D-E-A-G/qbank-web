import { useSyncExternalStore } from "react";

/** Stored appearance. The head script in index.html reads the same key before paint. */
export const LOOK_KEY = "qbank-look";

export type Look = "auto" | "light" | "dark";

const LIGHT_CANVAS = "#F7F4EE";
const DARK_CANVAS = "#0C0C0B";

const listeners = new Set<() => void>();

export function readLook(): Look {
  const stored = storedLook();
  if (stored === "light" || stored === "dark" || stored === "auto") return stored;
  return "auto";
}

export function setLook(look: Look): void {
  try {
    localStorage.setItem(LOOK_KEY, look);
  } catch {
    // The choice still applies for this visit when storage is blocked.
  }
  applyLook(look);
  for (const listener of listeners) listener();
}

export function applyLook(look: Look): void {
  document.documentElement.dataset.theme = look;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute("content", prefersDark(look) ? DARK_CANVAS : LIGHT_CANVAS);
}

/** Keeps the theme-color meta aligned with the system setting while Look is Match device. */
export function startTheme(): void {
  applyLook(readLook());
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    applyLook(readLook());
  });
}

export function useLook(): Look {
  return useSyncExternalStore(subscribeLook, readLook, getServerLook);
}

function subscribeLook(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getServerLook(): Look {
  return "auto";
}

function storedLook(): string | null {
  try {
    return localStorage.getItem(LOOK_KEY);
  } catch {
    return null;
  }
}

function prefersDark(look: Look): boolean {
  return look === "dark" || (look === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

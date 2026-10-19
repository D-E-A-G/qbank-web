import { useSyncExternalStore } from "react";
import type { components } from "./api-schema";

/** Stored appearance. The head script in index.html reads the same key before paint. */
export const LOOK_KEY = "qbank-look";

/**
 * The signed-in account's color scheme, kept on this device only so the head script in index.html
 * paints it before the session answers. The account on the server is the source of truth.
 */
export const PALETTE_KEY = "qbank-palette";

export type Look = "auto" | "light" | "dark";

/** The account's color scheme. Look picks its light or dark half. */
export type Palette = components["schemas"]["Palette"];

export const DEFAULT_PALETTE: Palette = "dusk";

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

/** A scheme this build does not know shows as Dusk, as the API asks. */
export function paletteOf(value: unknown): Palette {
  return value === "slate" ? "slate" : DEFAULT_PALETTE;
}

/** Shows the account's scheme and remembers it for the next visit's first paint. */
export function showPalette(palette: Palette): void {
  document.documentElement.dataset.palette = palette;
  try {
    localStorage.setItem(PALETTE_KEY, palette);
  } catch {
    // The scheme still shows for this visit when storage is blocked.
  }
}

/** Signed out: Dusk, and nothing of the last account's scheme left on this device. */
export function forgetPalette(): void {
  document.documentElement.dataset.palette = DEFAULT_PALETTE;
  try {
    localStorage.removeItem(PALETTE_KEY);
  } catch {
    // Nothing was stored.
  }
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

/** What a menu opens from: the button she pressed, or the spot she right-clicked. */
export type MenuAnchor = { element: Pick<HTMLElement, "getBoundingClientRect" | "focus"> } | { x: number; y: number };

/** Room kept between the menu and the window's edge, the phone gutter. */
const EDGE = 16;
/** Space between the button and the menu under it. */
const GAP = 6;

/**
 * Where the menu goes in a window `width` by `height`: under a button and right-aligned to it, or
 * with its corner at a right-click, on the side of it that has room. It flips above when it would
 * run off the bottom, and stays `EDGE` from every side.
 */
export function position(anchor: MenuAnchor, menuWidth: number, menuHeight: number, width: number, height: number): { top: number; left: number } {
  let below: number, above: number, left: number;
  if ("element" in anchor) {
    const box = anchor.element.getBoundingClientRect();
    below = box.bottom + GAP;
    above = box.top - GAP - menuHeight;
    left = box.right - menuWidth;
  } else {
    below = anchor.y;
    above = anchor.y - menuHeight;
    left = anchor.x + menuWidth <= width - EDGE ? anchor.x : anchor.x - menuWidth;
  }
  const top = below + menuHeight <= height - EDGE || above < EDGE ? below : above;
  return { top: clamp(top, EDGE, height - EDGE - menuHeight), left: clamp(left, EDGE, width - EDGE - menuWidth) };
}

function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(value, Math.max(low, high)));
}

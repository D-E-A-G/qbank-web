import { describe, expect, it } from "vitest";
import { position } from "./menu-position";

/** A button at this box, as getBoundingClientRect reports it. */
function button(left: number, top: number, size = 44) {
  const box = { left, top, right: left + size, bottom: top + size, width: size, height: size, x: left, y: top };
  return { element: { getBoundingClientRect: () => ({ ...box, toJSON: () => box }), focus: () => undefined } };
}

describe("where a menu opens", () => {
  it("goes under the button, right-aligned to it", () => {
    expect(position(button(330, 20), 300, 200, 390, 844)).toEqual({ top: 70, left: 74 });
  });

  it("goes above the button when there is no room below", () => {
    expect(position(button(300, 700), 300, 200, 390, 844)).toEqual({ top: 494, left: 44 });
  });

  it("stays 16px inside a phone's edges", () => {
    expect(position(button(10, 20), 300, 200, 390, 844).left).toBe(16);
  });

  it("opens at a right-click, to the left of it near the right edge", () => {
    expect(position({ x: 200, y: 300 }, 280, 200, 1280, 900)).toEqual({ top: 300, left: 200 });
    expect(position({ x: 1200, y: 300 }, 280, 200, 1280, 900)).toEqual({ top: 300, left: 920 });
    expect(position({ x: 600, y: 850 }, 280, 200, 1280, 900)).toEqual({ top: 650, left: 600 });
  });
});

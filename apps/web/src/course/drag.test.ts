import { describe, expect, it } from "vitest";
import { dragTo, shiftOf, type Drag } from "./drag";

/** Four 60px rows, the second one picked up. */
function grab(from: number): Drag {
  return { from, to: from, pointerId: 1, startY: 0, offset: 0, tops: [100, 160, 220, 280], heights: [60, 60, 60, 60] };
}

describe("dragging a folder by its grip", () => {
  it("takes another row's place once it covers half of that row", () => {
    expect(dragTo(grab(1), 29).to).toBe(1);
    expect(dragTo(grab(1), 31).to).toBe(2);
    expect(dragTo(grab(1), 91).to).toBe(3);
    expect(dragTo(grab(1), -31).to).toBe(0);
  });

  it("stays inside the list", () => {
    expect(dragTo(grab(1), 500)).toMatchObject({ offset: 120, to: 3 });
    expect(dragTo(grab(1), -500)).toMatchObject({ offset: -60, to: 0 });
  });

  it("moves the rows it passes out of its way, and leaves the others", () => {
    const down = dragTo(grab(1), 70);
    expect([0, 1, 2, 3].map((index) => shiftOf(down, index))).toEqual([0, 70, -60, 0]);
    const up = dragTo(grab(2), -70);
    expect([0, 1, 2, 3].map((index) => shiftOf(up, index))).toEqual([0, 60, -70, 0]);
  });
});

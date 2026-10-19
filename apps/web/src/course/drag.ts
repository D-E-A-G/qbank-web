/** A row being dragged by its grip: where it started, how far it has gone, and where it would land. */
export interface Drag {
  from: number;
  to: number;
  pointerId: number;
  startY: number;
  offset: number;
  /** Where each row of the list was when the drag began, and how tall. */
  tops: number[];
  heights: number[];
}

/**
 * The drag after the pointer moved `offset` from where it started. The row stays inside the list,
 * and it takes another row's place once it covers half of that row.
 */
export function dragTo(drag: Drag, offset: number): Drag {
  const last = drag.tops.length - 1;
  const top = drag.tops[drag.from] ?? 0;
  const height = drag.heights[drag.from] ?? 0;
  const min = (drag.tops[0] ?? 0) - top;
  const max = (drag.tops[last] ?? 0) + (drag.heights[last] ?? 0) - (top + height);
  const clamped = Math.max(min, Math.min(max, offset));
  let to = drag.from;
  drag.tops.forEach((rowTop, index) => {
    const middle = rowTop + (drag.heights[index] ?? 0) / 2;
    if (index < drag.from && top + clamped < middle) to = Math.min(to, index);
    if (index > drag.from && top + height + clamped > middle) to = Math.max(to, index);
  });
  return { ...drag, offset: clamped, to };
}

/** How far a row is drawn from its place: the dragged row follows the pointer, and the rows it passed make room. */
export function shiftOf(drag: Drag, index: number): number {
  if (index === drag.from) return drag.offset;
  const height = drag.heights[drag.from] ?? 0;
  if (drag.from < drag.to && index > drag.from && index <= drag.to) return -height;
  if (drag.to < drag.from && index >= drag.to && index < drag.from) return height;
  return 0;
}

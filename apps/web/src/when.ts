/** "today" or a short month-and-day, in the device's locale. */
export function when(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return "today";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

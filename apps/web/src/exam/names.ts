/**
 * The folders an exam covers, by name as she named them: "Week 1, Week 2, Week 3", and past three
 * "First Pass, Second Pass and 3 more", so a past exam's row stays one line.
 */
export function foldersText(names: readonly string[]): string {
  if (names.length <= 3) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} and ${String(names.length - 2)} more`;
}

/** "33 minutes", or "10.5 minutes" for an odd number of questions at 1.5 minutes each. */
export function minutesText(seconds: number): string {
  const minutes = seconds / 60;
  const shown = Number.isInteger(minutes) ? String(minutes) : minutes.toFixed(1);
  return `${shown} ${minutes === 1 ? "minute" : "minutes"}`;
}

/**
 * Says which of an exam's folders use practice questions because they have no exam bank:
 * "First Pass has no exam bank yet, so it uses its practice questions." before the exam, and
 * "Week 1 and Week 2 had no exam bank, so their questions came from practice sets." after it.
 */
export function practiceFoldersText(names: readonly string[], when: "before" | "after"): string {
  const one = names.length === 1;
  const folders = names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1) ?? ""}`;
  if (when === "before") return `${folders} ${one ? "has" : "have"} no exam bank yet, so ${one ? "it uses its" : "they use their"} practice questions.`;
  return `${folders} had no exam bank, so ${one ? "its" : "their"} questions came from practice sets.`;
}

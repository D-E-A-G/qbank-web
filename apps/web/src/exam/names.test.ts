import { describe, expect, it } from "vitest";
import { foldersText, minutesText, practiceFoldersText } from "./names";

describe("foldersText", () => {
  it("lists up to three folders by name, as she named them", () => {
    expect(foldersText(["Week 1", "Week 2", "Week 3"])).toBe("Week 1, Week 2, Week 3");
    expect(foldersText(["First Pass"])).toBe("First Pass");
    expect(foldersText([])).toBe("");
  });

  it("counts the rest past three, so a past exam stays one line", () => {
    expect(foldersText(["Exam 2 - Week 4", "Exam 2 - Week 5", "Exam 2 - Week 6", "First Pass", "Second Pass"])).toBe(
      "Exam 2 - Week 4, Exam 2 - Week 5 and 3 more",
    );
  });
});

describe("minutesText", () => {
  it("shows whole and half minutes", () => {
    expect(minutesText(3600)).toBe("60 minutes");
    expect(minutesText(33 * 60)).toBe("33 minutes");
    expect(minutesText(7 * 90)).toBe("10.5 minutes");
    expect(minutesText(90)).toBe("1.5 minutes");
  });
});

describe("practiceFoldersText", () => {
  it("names the folders without an exam bank, before and after the exam", () => {
    expect(practiceFoldersText(["Week 3"], "before")).toBe("Week 3 has no exam bank yet, so it uses its practice questions.");
    expect(practiceFoldersText(["Week 1", "Week 2"], "before")).toBe("Week 1 and Week 2 have no exam bank yet, so they use their practice questions.");
    expect(practiceFoldersText(["Week 3"], "after")).toBe("Week 3 had no exam bank, so its questions came from practice sets.");
    expect(practiceFoldersText(["Week 1", "First Pass", "Weeks 3-4"], "after")).toBe(
      "Week 1, First Pass and Weeks 3-4 had no exam bank, so their questions came from practice sets.",
    );
  });
});

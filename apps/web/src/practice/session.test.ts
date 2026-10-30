import { describe, expect, it } from "vitest";
import type { LoadedQuestion, LoadedSet, Question } from "./model";
import type { Feedback } from "./recordPracticeAnswer";
import { advance, beginSession, reveal, strike, updateAttempt, type Session } from "./session";

function loaded(id: string, position: number, question: Question): LoadedQuestion {
  return {
    id,
    publicId: id,
    position,
    topic: "",
    cj: null,
    stem: "Stem",
    ask: "Ask",
    rationale: "Rationale",
    takeaway: "Takeaway",
    terms: [],
    table: null,
    images: [],
    question,
  };
}

const set: LoadedSet = {
  id: "set",
  courseId: "course",
  title: "Week 1",
  weekLabel: "Week 1",
  questions: [
    loaded("q1", 0, { type: "single", options: [{ t: "Right", ok: true }, { t: "Wrong" }, { t: "Also wrong" }] }),
    loaded("q2", 1, { type: "sata", options: [{ t: "Yes", ok: true }, { t: "No" }, { t: "Yes too", ok: true }] }),
  ],
};

const score: Feedback = { status: "incorrect", points: 0, maxPoints: 1, label: "Not correct", pointsText: null, ruleText: null };

function started(): Session {
  return beginSession(set, "set");
}

describe("strikes in a practice sitting", () => {
  it("opens every question with nothing struck", () => {
    expect(started().attempts.map((attempt) => attempt.struck)).toEqual([[], []]);
  });

  it("strikes a choice out and restores it with the same gesture", () => {
    const struck = strike(started(), 0, 1);
    expect(struck?.attempts[0]?.struck).toEqual([1]);
    expect(strike(struck, 0, 1)?.attempts[0]?.struck).toEqual([]);
  });

  it("unpicks the choice she struck", () => {
    const picked = updateAttempt(started(), 1, (attempt) => ({ ...attempt, draft: { type: "sata", picks: [0, 1] } }));
    const struck = strike(picked, 1, 1);
    expect(struck?.attempts[1]?.draft).toEqual({ type: "sata", picks: [0] });
    expect(struck?.attempts[1]?.struck).toEqual([1]);
  });

  it("keeps each question's strikes while she moves to the next question", () => {
    const moved = advance(strike(strike(started(), 0, 2), 1, 1));
    expect(moved?.index).toBe(1);
    expect(moved?.attempts.map((attempt) => attempt.struck)).toEqual([[2], [1]]);
  });

  it("leaves strikes alone once the answer is checked", () => {
    const checked = reveal(strike(started(), 0, 1), 0, false, score);
    expect(strike(checked, 0, 1)?.attempts[0]?.struck).toEqual([1]);
    expect(strike(checked, 0, 2)).toBe(checked);
  });

  it("drops every strike when the set ends", () => {
    const last = advance(strike(strike(started(), 0, 2), 1, 1));
    const finished = advance(reveal(last, 1, false, score));
    expect(finished?.finishedAt).not.toBeNull();
    expect(finished?.attempts.map((attempt) => attempt.struck)).toEqual([[], []]);
  });
});

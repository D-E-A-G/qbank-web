// One sitting of a practice set or Review: her answer to each question as she works through it,
// and the results once she reaches the end.

import { initialDraft, makeLayout, toggleStrike, type Draft, type Layout, type LoadedQuestion, type LoadedSet } from "./model";
import type { Feedback } from "./recordPracticeAnswer";
import type { PracticeSource } from "./source";

export interface AttemptState {
  layout: Layout;
  draft: Draft;
  /** Choices she has struck out, as original option indexes. Kept for this sitting only, never sent. */
  struck: readonly number[];
  guessed: boolean;
  clientAttemptId: string;
  score: Feedback | null;
}

export interface Session {
  title: string;
  kind: PracticeSource["kind"];
  courseId: string;
  questions: LoadedQuestion[];
  attempts: AttemptState[];
  index: number;
  startedAt: number;
  finishedAt: number | null;
}

export function beginSession(loaded: LoadedSet, kind: PracticeSource["kind"]): Session {
  return {
    title: loaded.title,
    kind,
    courseId: loaded.courseId,
    questions: loaded.questions,
    index: 0,
    startedAt: Date.now(),
    finishedAt: null,
    attempts: loaded.questions.map((question) => {
      const layout = makeLayout(question.question);
      return {
        layout,
        draft: initialDraft(question.question, layout),
        struck: [],
        guessed: false,
        clientAttemptId: crypto.randomUUID(),
        score: null,
      };
    }),
  };
}

/** Changes her answer to a question she has not checked yet. A checked one stays as it was. */
export function updateAttempt(session: Session | null, index: number, edit: (attempt: AttemptState) => AttemptState): Session | null {
  if (!session) return session;
  const attempt = session.attempts[index];
  if (!attempt || attempt.score) return session;
  const attempts = session.attempts.slice();
  attempts[index] = edit(attempt);
  return { ...session, attempts };
}

/** Strikes out a choice of a question she has not checked yet, or restores it. */
export function strike(session: Session | null, index: number, option: number): Session | null {
  return updateAttempt(session, index, (attempt) => ({ ...attempt, ...toggleStrike(attempt.draft, attempt.struck, option) }));
}

export function reveal(session: Session | null, index: number, guessed: boolean, score: Feedback): Session | null {
  if (!session) return session;
  const attempt = session.attempts[index];
  if (!attempt || attempt.score) return session;
  const attempts = session.attempts.slice();
  attempts[index] = { ...attempt, guessed, score };
  return { ...session, attempts };
}

/** Moves to the next question, or past the last one to the results, where every strike is dropped. */
export function advance(session: Session | null): Session | null {
  if (!session) return session;
  if (session.index < session.questions.length - 1) return { ...session, index: session.index + 1 };
  if (session.finishedAt !== null) return session;
  return { ...session, finishedAt: Date.now(), attempts: session.attempts.map((attempt) => ({ ...attempt, struck: [] })) };
}

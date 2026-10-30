import { ApiError, deleteAccount, type Account } from "./api";

/** Said before sending, as the iPhone app says it. */
export const NO_PASSWORD = "Enter your password to delete your account.";

const NOT_DELETED = "Your account could not be deleted. Try again.";

/** Settings offers Delete account to a user account; the server refuses the admin's. */
export function isDeleteOffered(user: Pick<Account, "role">): boolean {
  return user.role === "student";
}

/** What goes, in plain words: the iPhone app's, with the agent keys Settings shows here and any passkeys saved before. */
export function deletionWarning(email: string): string {
  return `Your user account, ${email}, and everything in it are deleted for good: your courses and study topics, their sets, your answers, progress and past exams, and your passkeys and agent keys. You are signed out on every device. Nothing goes to Recently deleted, and there is no Undo.`;
}

export type DeletionOutcome =
  | { kind: "deleted" }
  /** The session had already ended (signed out, or the account deleted, on another device). */
  | { kind: "signed-out" }
  /** The account has a temporary password, so she chooses a new one first. */
  | { kind: "must-change" }
  /**
   * Nothing was deleted, and she stays signed in: the sentence to show. A wrong password or a lock
   * empties the field. After too many wrong passwords, Delete waits until `lockedUntil` (epoch ms).
   */
  | { kind: "refused"; message: string; clearPassword: boolean; lockedUntil: number | null };

/** Sends her current password to delete the signed-in account, and says how it went. */
export async function requestDeletion(password: string, now: () => number = Date.now): Promise<DeletionOutcome> {
  if (password.length === 0) return { kind: "refused", message: NO_PASSWORD, clearPassword: false, lockedUntil: null };
  try {
    await deleteAccount(password);
    return { kind: "deleted" };
  } catch (caught) {
    return outcomeOf(caught, now());
  }
}

function outcomeOf(caught: unknown, now: number): DeletionOutcome {
  // A dropped connection: if the delete reached the server anyway, the next try answers unauthenticated.
  if (!(caught instanceof ApiError)) return { kind: "refused", message: NOT_DELETED, clearPassword: false, lockedUntil: null };
  switch (caught.code) {
    case "unauthenticated":
      return { kind: "signed-out" };
    case "must_change_password":
      return { kind: "must-change" };
    case "invalid_credentials":
      return { kind: "refused", message: caught.message, clearPassword: true, lockedUntil: null };
    case "too_many_attempts":
      return {
        kind: "refused",
        message: caught.message,
        clearPassword: true,
        lockedUntil: caught.retryAfterSeconds === undefined ? null : now + caught.retryAfterSeconds * 1000,
      };
    default:
      return { kind: "refused", message: caught.message, clearPassword: false, lockedUntil: null };
  }
}

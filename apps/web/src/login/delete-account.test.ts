import { afterEach, describe, expect, it, vi } from "vitest";
import { deletionWarning, isDeleteOffered, NO_PASSWORD, requestDeletion } from "./delete-account";

const NOW = Date.parse("2026-10-28T12:00:00Z");

/** Stands in for the API: the request gets this answer, and is recorded. */
function fakeApi(answer: { status: number; body?: unknown; text?: string; headers?: Record<string, string> } | Error) {
  const calls: { url: string; method: string; body: unknown }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, init?: RequestInit) => {
      calls.push({ url, method: init?.method ?? "GET", body: typeof init?.body === "string" ? (JSON.parse(init.body) as unknown) : undefined });
      if (answer instanceof Error) return Promise.reject(answer);
      const text = answer.text ?? (answer.body === undefined ? null : JSON.stringify(answer.body));
      return Promise.resolve(new Response(text, { status: answer.status, headers: answer.headers ?? {} }));
    }),
  );
  return calls;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("who is offered Delete account", () => {
  it("is a user account, never the admin", () => {
    expect(isDeleteOffered({ role: "student" })).toBe(true);
    expect(isDeleteOffered({ role: "admin" })).toBe(false);
  });
});

describe("the warning", () => {
  it("names the account and says it all goes for good, with no Undo", () => {
    const warning = deletionWarning("someone@example.com");
    expect(warning).toContain("Your user account, someone@example.com, and everything in it are deleted for good");
    expect(warning).toContain("your passkeys and agent keys");
    expect(warning).toContain("You are signed out on every device.");
    expect(warning).toContain("Nothing goes to Recently deleted, and there is no Undo.");
    expect(warning).not.toMatch(/student/i);
  });
});

describe("deleting", () => {
  it("sends only the current password to DELETE /api/me", async () => {
    const calls = fakeApi({ status: 200, body: { status: "deleted" } });
    expect(await requestDeletion("current-pass-1")).toEqual({ kind: "deleted" });
    expect(calls).toEqual([{ url: "/api/me", method: "DELETE", body: { password: "current-pass-1" } }]);
  });

  it("takes any 2xx as deleted, whatever its body", async () => {
    fakeApi({ status: 200, text: "not json" });
    expect(await requestDeletion("current-pass-1")).toEqual({ kind: "deleted" });
    fakeApi({ status: 204 });
    expect(await requestDeletion("current-pass-1")).toEqual({ kind: "deleted" });
  });

  it("asks for the password before sending anything", async () => {
    const calls = fakeApi({ status: 200, body: { status: "deleted" } });
    expect(await requestDeletion("")).toEqual({ kind: "refused", message: NO_PASSWORD, clearPassword: false, lockedUntil: null });
    expect(calls).toEqual([]);
  });
});

describe("a refusal deletes nothing and says why", () => {
  const refused = (message: string, clearPassword = false) => ({ kind: "refused", message, clearPassword, lockedUntil: null });

  it.each([
    [400, "invalid_request", "Enter your password."],
    [403, "agent_key_not_allowed", "An agent key can't delete an account."],
    [403, "admin_cannot_delete_account", "The admin account can't be deleted."],
    [409, "in_use", "QBank is still making a set in NURS 220. Wait until it is filed, or cancel it, then delete your account."],
    [503, "auth_unavailable", "Sign-in is not available right now."],
  ])("%i %s: the server's sentence, and she stays signed in", async (status, error, message) => {
    fakeApi({ status, body: { error, message } });
    expect(await requestDeletion("current-pass-1")).toEqual(refused(message));
  });

  it("401 invalid_credentials: the server's sentence, and the field empties", async () => {
    fakeApi({ status: 401, body: { error: "invalid_credentials", message: "That password is not right." } });
    expect(await requestDeletion("wrong-pass-1")).toEqual(refused("That password is not right.", true));
  });

  it("429 too_many_attempts: Delete waits as long as the body says", async () => {
    fakeApi({ status: 429, body: { error: "too_many_attempts", message: "Too many tries. Try again in 15 minutes.", retryAfterSeconds: 900 }, headers: { "retry-after": "900" } });
    expect(await requestDeletion("wrong-pass-1", () => NOW)).toEqual({
      kind: "refused",
      message: "Too many tries. Try again in 15 minutes.",
      clearPassword: true,
      lockedUntil: NOW + 900_000,
    });
  });

  it("429 too_many_attempts: or as long as the retry-after header says, when the body does not", async () => {
    fakeApi({ status: 429, body: { error: "too_many_attempts", message: "Too many tries. Try again in 2 minutes." }, headers: { "retry-after": "61" } });
    expect(await requestDeletion("wrong-pass-1", () => NOW)).toMatchObject({ kind: "refused", clearPassword: true, lockedUntil: NOW + 61_000 });
  });

  it("401 unauthenticated: the session had already ended, so she is signed out", async () => {
    fakeApi({ status: 401, body: { error: "unauthenticated", message: "Sign in to continue." } });
    expect(await requestDeletion("current-pass-1")).toEqual({ kind: "signed-out" });
  });

  it("403 must_change_password: she chooses a new password first", async () => {
    fakeApi({ status: 403, body: { error: "must_change_password", message: "Choose a new password to continue." } });
    expect(await requestDeletion("temp-pass-1")).toEqual({ kind: "must-change" });
  });

  it("an answer that is not the API's says the status", async () => {
    fakeApi({ status: 502, text: "<html>Bad gateway</html>" });
    expect(await requestDeletion("current-pass-1")).toEqual(refused("The server answered 502."));
  });

  it("a dropped connection says to try again", async () => {
    fakeApi(new TypeError("Failed to fetch"));
    expect(await requestDeletion("current-pass-1")).toEqual(refused("Your account could not be deleted. Try again."));
  });
});

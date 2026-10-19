import type { components } from "../api-schema";

export type Account = components["schemas"]["Account"];

interface ApiFailure {
  error: string;
  message: string;
  retryAfterSeconds?: number;
}

export class ApiError extends Error {
  readonly code: string;
  readonly retryAfterSeconds: number | undefined;

  constructor(failure: ApiFailure) {
    super(failure.message);
    this.name = "ApiError";
    this.code = failure.error;
    this.retryAfterSeconds = failure.retryAfterSeconds;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAccount(value: unknown): value is Account {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.email === "string" &&
    typeof value.name === "string" &&
    (value.role === "student" || value.role === "admin") &&
    typeof value.mustChangePassword === "boolean"
  );
}

function failureOf(body: unknown, status: number): ApiFailure {
  if (isRecord(body) && typeof body.error === "string" && typeof body.message === "string") {
    const retryAfterSeconds = typeof body.retryAfterSeconds === "number" ? body.retryAfterSeconds : undefined;
    return retryAfterSeconds === undefined
      ? { error: body.error, message: body.message }
      : { error: body.error, message: body.message, retryAfterSeconds };
  }
  return { error: "request_failed", message: `The server answered ${String(status)}.` };
}

async function send(path: string, init?: RequestInit): Promise<unknown> {
  const headers = new Headers(init?.headers);
  headers.set("accept", "application/json");
  if (init?.body !== undefined && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetch(path, { ...init, headers, credentials: "same-origin" });
  const text = await response.text();
  let body: unknown = null;
  if (text.length > 0) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = null;
    }
  }
  if (!response.ok) throw new ApiError(failureOf(body, response.status));
  return body;
}

export async function readSession(signal?: AbortSignal): Promise<Account | null> {
  const headers = new Headers({ accept: "application/json" });
  const init: RequestInit = { headers, credentials: "same-origin" };
  if (signal !== undefined) init.signal = signal;
  const response = await fetch("/api/session", init);
  if (response.status === 401) return null;
  const text = await response.text();
  let body: unknown = null;
  if (text.length > 0) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = null;
    }
  }
  if (!response.ok) throw new ApiError(failureOf(body, response.status));
  if (!isRecord(body) || !isAccount(body.user)) throw new ApiError({ error: "auth_failed", message: "Sign-in failed. Try again." });
  return body.user;
}

export async function signInWithPassword(email: string, password: string): Promise<Account> {
  const body = await send("/api/sign-in/password", { method: "POST", body: JSON.stringify({ email, password }) });
  if (!isRecord(body) || !isAccount(body.user)) throw new ApiError({ error: "auth_failed", message: "Sign-in failed. Try again." });
  return body.user;
}

/** Makes her own student account, for an email the owner put on the sign-up list, and signs it in. */
export async function signUp(email: string, password: string): Promise<Account> {
  const body = await send("/api/sign-up", { method: "POST", body: JSON.stringify({ email, password }) });
  if (!isRecord(body) || !isAccount(body.user)) throw new ApiError({ error: "auth_failed", message: "Sign-up failed. Try again." });
  return body.user;
}

export async function signOut(): Promise<void> {
  await send("/api/sign-out", { method: "POST", body: "{}" });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<Account> {
  const body = await send("/api/account/password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!isRecord(body) || !isAccount(body.user)) throw new ApiError({ error: "auth_failed", message: "Sign-in failed. Try again." });
  return body.user;
}

export async function setTemporaryPassword(temporaryPassword: string): Promise<string> {
  const body = await send("/api/admin/student-password", {
    method: "POST",
    body: JSON.stringify({ temporaryPassword }),
  });
  if (!isRecord(body) || typeof body.email !== "string") {
    throw new ApiError({ error: "student_account", message: "The temporary password could not be set." });
  }
  return body.email;
}

export type Passkey = components["schemas"]["Passkey"];

function isPasskey(value: unknown): value is Passkey {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && (value.name === null || typeof value.name === "string");
}

export async function listPasskeys(): Promise<Passkey[]> {
  const body = await send("/api/passkeys");
  if (!isRecord(body) || !Array.isArray(body.passkeys)) return [];
  return body.passkeys.filter(isPasskey);
}

export async function deletePasskey(id: string): Promise<void> {
  await send(`/api/passkeys/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function getJson(path: string): Promise<unknown> {
  return send(path);
}

export async function postJson(path: string, body: unknown): Promise<unknown> {
  return send(path, { method: "POST", body: JSON.stringify(body) });
}

export function isOptions(value: unknown): value is { challenge: string } {
  return isRecord(value) && typeof value.challenge === "string";
}

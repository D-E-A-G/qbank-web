import { api, ApiError } from "../api";
import type { components } from "../api-schema";
import { when } from "../when";

type Schemas = components["schemas"];

/** An agent waiting under a user code: the name it gave and what its key would be able to do. */
export type AgentPairing = Schemas["AgentPairing"];
/** One of the account's agent keys, as listed: never the key itself. */
export type AgentKey = Schemas["AgentKey"];
export type AgentScope = Schemas["AgentScope"];

/** Where Settings opens Connect an agent. `?code=` fills in the code an agent sent, for the user to confirm. */
export const AGENTS_PATH = "/settings/agents";

/** The code as the user typed or pasted it, trimmed and in capitals; the server takes any case, with or without its dash. */
export function cleanCode(input: string): string {
  return input.trim().toUpperCase();
}

/** The code an address carries in `?code=`, or "" without one. */
export function codeFromSearch(search: string): string {
  return cleanCode(new URLSearchParams(search).get("code") ?? "");
}

/** What a scope lets an agent do, in plain words, for the approval screen. */
export function scopeWords(scope: string, admin: boolean): { title: string; detail: string } {
  const whose = admin ? "the user account you look after" : "your account";
  if (scope === "import") {
    return {
      title: "Import question sets",
      detail: `Into the courses and topics of ${whose}, reading them to file each set. It never replaces, moves, renames, or deletes a set.`,
    };
  }
  if (scope === "read") {
    return {
      title: "Read progress, read-only",
      detail: "QBank does not offer this yet. Once it does, this key can read progress without changing anything.",
    };
  }
  // A scope added after this screen was made: shown by its name, as the contract asks.
  return { title: scope, detail: "QBank has not described this one here yet." };
}

/** "Can import sets", "Can import sets and read progress": a key's scopes in a few words, for its row. */
export function scopesLine(scopes: readonly string[]): string {
  const verbs = scopes.map((scope) => (scope === "import" ? "import sets" : scope === "read" ? "read progress" : scope));
  if (verbs.length === 0) return "Can do nothing";
  if (verbs.length === 1) return `Can ${verbs[0] ?? ""}`;
  return `Can ${verbs.slice(0, -1).join(", ")} and ${verbs[verbs.length - 1] ?? ""}`;
}

/** "Made Oct 25 · Last used today", "Made today · Never used", or "Made Oct 25 · Revoked Oct 26". */
export function keyDates(key: AgentKey): string {
  const made = `Made ${when(key.createdAt)}`;
  if (key.revokedAt !== null) return `${made} · Revoked ${when(key.revokedAt)}`;
  return `${made} · ${key.lastUsedAt === null ? "Never used" : `Last used ${when(key.lastUsedAt)}`}`;
}

/** "4:12 PM": when a code stops working, in the device's locale. */
export function codeEnds(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

/** What went wrong, as the server says it, or the fallback when it said nothing usable. */
export function refusal(caught: unknown, fallback: string): string {
  return caught instanceof ApiError && caught.body !== null ? caught.message : fallback;
}

export function lookupPairing(userCode: string): Promise<AgentPairing> {
  return api<AgentPairing>("/api/agent-pairings/lookup", { method: "POST", json: { userCode } });
}

export function answerPairing(userCode: string, answer: "approve" | "deny"): Promise<AgentPairing> {
  return api<AgentPairing>(`/api/agent-pairings/${answer}`, { method: "POST", json: { userCode } });
}

export async function listAgentKeys(): Promise<AgentKey[]> {
  return (await api<Schemas["AgentKeyList"]>("/api/agent-keys")).keys;
}

export function revokeAgentKey(id: string): Promise<AgentKey> {
  return api<AgentKey>(`/api/agent-keys/${encodeURIComponent(id)}/revoke`, { method: "POST" });
}

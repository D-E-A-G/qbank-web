import { describe, expect, it } from "vitest";
import { ApiError } from "../api";
import { AGENTS_PATH, cleanCode, codeFromSearch, keyDates, refusal, scopesLine, scopeWords, type AgentKey } from "./agents";

function key(overrides: Partial<AgentKey> = {}): AgentKey {
  return {
    id: "74b9a6cf-4cdf-49ee-a9d8-d8184f6619ee",
    name: "My MacBook agent",
    scopes: ["import"],
    createdAt: "2026-03-02T15:00:00Z",
    lastUsedAt: null,
    revokedAt: null,
    ...overrides,
  };
}

describe("the code an agent shows", () => {
  it("is trimmed and put in capitals, with its dash or without", () => {
    expect(cleanCode("  bcdf-ghjk \n")).toBe("BCDF-GHJK");
    expect(cleanCode("bcdfghjk")).toBe("BCDFGHJK");
    expect(cleanCode("   ")).toBe("");
  });

  it("can come in the address, for the user to confirm", () => {
    expect(codeFromSearch("?code=bcdf-ghjk")).toBe("BCDF-GHJK");
    expect(codeFromSearch("?other=1")).toBe("");
    expect(codeFromSearch("")).toBe("");
    expect(AGENTS_PATH).toBe("/settings/agents");
  });
});

describe("what an agent asks to do", () => {
  it("says import in plain words, and that a key never replaces or deletes a set", () => {
    const words = scopeWords("import", false);
    expect(words.title).toBe("Import question sets");
    expect(words.detail).toContain("your account");
    expect(words.detail).toContain("never replaces, moves, renames, or deletes a set");
  });

  it("names the account he looks after for the admin", () => {
    expect(scopeWords("import", true).detail).toContain("the user account you look after");
  });

  it("says read is read-only, and not offered yet", () => {
    const words = scopeWords("read", false);
    expect(words.title).toBe("Read progress, read-only");
    expect(words.detail).toContain("does not offer this yet");
  });

  it("shows a scope it does not know by its name", () => {
    expect(scopeWords("export", false).title).toBe("export");
  });

  it("never says Firstmate", () => {
    for (const scope of ["import", "read", "export"]) {
      for (const admin of [false, true]) expect(JSON.stringify(scopeWords(scope, admin))).not.toMatch(/firstmate/i);
    }
  });
});

describe("a key's row", () => {
  it("lists its scopes in a few words", () => {
    expect(scopesLine(["import"])).toBe("Can import sets");
    expect(scopesLine(["import", "read"])).toBe("Can import sets and read progress");
    expect(scopesLine(["import", "read", "export"])).toBe("Can import sets, read progress and export");
    expect(scopesLine([])).toBe("Can do nothing");
  });

  it("says when it was made and last used, or that it never was", () => {
    expect(keyDates(key())).toMatch(/^Made \S+( \d+)? · Never used$/);
    expect(keyDates(key({ lastUsedAt: new Date().toISOString() }))).toMatch(/ · Last used today$/);
  });

  it("says when it was revoked instead of when it was last used", () => {
    const line = keyDates(key({ lastUsedAt: "2026-03-03T10:00:00Z", revokedAt: new Date().toISOString() }));
    expect(line).toMatch(/ · Revoked today$/);
    expect(line).not.toContain("Last used");
  });
});

describe("a refusal", () => {
  it("is the server's own words when it sent some", () => {
    const caught = new ApiError(404, { error: "pairing_not_found", message: "No agent is waiting under that code." });
    expect(refusal(caught, "fallback")).toBe("No agent is waiting under that code.");
  });

  it("is the fallback when the server sent nothing, or the request never reached it", () => {
    expect(refusal(new ApiError(502, null), "fallback")).toBe("fallback");
    expect(refusal(new TypeError("Failed to fetch"), "fallback")).toBe("fallback");
  });
});

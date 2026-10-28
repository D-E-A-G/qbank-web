import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { GENERATED, renderTypes } from "./generate";

describe("the API contract", () => {
  it("is what the screens' types are generated from", async () => {
    // Fails when openapi.json was re-pinned, or src/api-schema.ts edited, without running `pnpm openapi`.
    expect(await readFile(GENERATED, "utf8")).toBe(await renderTypes());
  });

  it("names the qbank-server commit it was pinned from, and the API image built from that commit", async () => {
    const pin = JSON.parse(await readFile(new URL("pin.json", import.meta.url), "utf8")) as Record<string, unknown>;
    expect(Object.keys(pin).sort()).toEqual(["commit", "image", "path", "repository"]);
    expect(pin.repository).toBe("D-e-e-g/qbank-server");
    expect(pin.path).toBe("apps/api/openapi.json");
    expect(pin.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(pin.image).toMatch(/^ghcr\.io\/d-e-e-g\/nclex-qbank-api@sha256:[0-9a-f]{64}$/);
  });
});

import { describe, expect, it } from "vitest";
import { inSection, matchRoute, navigationFor } from "./routes";

describe("Connect an agent", () => {
  it("opens from Settings at its own address, and is not in the navigation", () => {
    expect(matchRoute("/settings/agents")).toMatchObject({ label: "Connect an agent", width: "reading" });
    expect(matchRoute("/settings/agents/")).toMatchObject({ label: "Connect an agent" });
    expect(navigationFor("student").map((route) => route.path)).not.toContain("/settings/agents");
    expect(navigationFor("admin").map((route) => route.path)).not.toContain("/settings/agents");
  });

  it("keeps Settings selected, and Home only on Home", () => {
    expect(inSection("/settings/agents", "/settings")).toBe(true);
    expect(inSection("/settings", "/settings")).toBe(true);
    expect(inSection("/settings-old", "/settings")).toBe(false);
    expect(inSection("/settings/agents", "/")).toBe(false);
    expect(inSection("/", "/")).toBe(true);
  });
});

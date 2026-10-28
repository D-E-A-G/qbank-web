import { afterEach, describe, expect, it, vi } from "vitest";
import type { CatalogRecord, SemesterCourse, SemesterRecord } from "./api";
import { currentCatalog, findCourse, forgetCatalog, fromRecord, homeLayout, refreshCatalog } from "./catalog";

function card(id: string, kind: SemesterCourse["kind"], title: string, archivedAt: string | null = null): SemesterCourse {
  return {
    id,
    kind,
    code: kind === "topic" ? "" : id.toUpperCase(),
    title,
    sortOrder: 0,
    archivedAt,
    questionCount: 0,
    weekCount: 0,
    folderCount: 0,
    reviewCount: 0,
    answeredCount: 0,
    fullyRightCount: 0,
    points: 0,
    maxPoints: 0,
  };
}

function semester(number: number, courses: SemesterCourse[], archivedAt: string | null = null): SemesterRecord {
  return { id: `s${String(number)}`, number, name: `Semester ${String(number)}`, startsOn: null, endsOn: null, archivedAt, courses };
}

describe("the catalog from the server", () => {
  it("shows no semester for an account that has none, rather than three empty ones", () => {
    const empty = fromRecord({ semesters: [], topics: [] });
    expect(empty.semesters).toEqual([]);
    expect(empty.topics).toEqual([]);
    expect(empty.fromServer).toBe(true);
  });

  it("keeps her topics in the server's order and finds a course or a topic by id", () => {
    const record: CatalogRecord = {
      semesters: [semester(1, [card("nurs420", "course", "Health assessment")])],
      topics: [card("t2", "topic", "SWE Hire"), card("t1", "topic", "Spanish")],
    };
    const catalog = fromRecord(record);
    expect(catalog.topics.map((topic) => topic.title)).toEqual(["SWE Hire", "Spanish"]);
    expect(findCourse(catalog, "t1")?.kind).toBe("topic");
    expect(findCourse(catalog, "nurs420")?.code).toBe("NURS420");
    expect(findCourse(catalog, "gone")).toBeUndefined();
  });
});

describe("Home's groups", () => {
  it("shows what she studies now, and keeps what she archived for a closed group last", () => {
    const layout = homeLayout(
      fromRecord({
        semesters: [
          semester(1, [card("a", "course", "Fundamentals"), card("b", "course", "Pharm", "2026-10-01T00:00:00Z")]),
          semester(2, [card("c", "course", "Mental health")], "2026-10-02T00:00:00Z"),
        ],
        topics: [card("t1", "topic", "SWE Hire"), card("t2", "topic", "Spanish", "2026-10-03T00:00:00Z")],
      }),
    );
    expect(layout.semesters.map(({ semester: group, courses }) => [group.label, courses.map((course) => course.title)])).toEqual([
      ["Semester 1", ["Fundamentals"]],
    ]);
    expect(layout.topics.map((topic) => topic.title)).toEqual(["SWE Hire"]);
    expect(layout.archived.map((group) => [group.title, group.courses.map((course) => course.title)])).toEqual([
      ["Semester 1", ["Pharm"]],
      ["Semester 2", ["Mental health"]],
      ["Study topics", ["Spanish"]],
    ]);
  });

  it("has no Archived group when nothing is archived", () => {
    const layout = homeLayout(fromRecord({ semesters: [semester(1, [card("a", "course", "Fundamentals")])], topics: [card("t1", "topic", "SWE Hire")] }));
    expect(layout.archived).toEqual([]);
  });
});

describe("signing out", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** Each /api/semesters request waits until the test answers it with that account's catalog. */
  function heldApi() {
    const waiting: ((record: CatalogRecord) => void)[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            waiting.push((record) => {
              resolve(new Response(JSON.stringify(record), { status: 200 }));
            });
          }),
      ),
    );
    return waiting;
  }

  const hers: CatalogRecord = { semesters: [semester(1, [card("nurs420", "course", "Health assessment")])], topics: [] };
  const theirs: CatalogRecord = { semesters: [], topics: [card("t1", "topic", "Spanish")] };

  it("forgets the last account's courses, even from an answer still on its way, and shows the next account's", async () => {
    const waiting = heldApi();
    const first = refreshCatalog();
    waiting[0]?.(hers);
    await first;
    expect(findCourse(currentCatalog(), "nurs420")?.title).toBe("Health assessment");

    // Her last read is still on its way when she signs out.
    const late = refreshCatalog();
    forgetCatalog();
    expect(findCourse(currentCatalog(), "nurs420")).toBeUndefined();
    expect(currentCatalog().fromServer).toBe(false);

    const next = refreshCatalog();
    waiting[1]?.(hers);
    await late;
    expect(findCourse(currentCatalog(), "nurs420")).toBeUndefined();
    waiting[2]?.(theirs);
    await next;
    expect(currentCatalog().topics.map((topic) => topic.title)).toEqual(["Spanish"]);
    forgetCatalog();
  });
});

import { useState } from "react";
import { ApiError, api } from "../api";
import { refreshCatalog, useCatalog, type CourseLink, type SemesterGroup } from "../catalog";
import { reordered } from "../course/folders";
import { createTopic, saveTopicOrder } from "../course/requests";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { TextField } from "./TextField";

type Run = (work: () => Promise<unknown>) => void;

/** One save at a time: Home's list is read again after it, and a refusal shows under the card. */
function useRun(): { busy: boolean; error: string | null; run: Run } {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run: Run = (work) => {
    setError(null);
    setBusy(true);
    void work()
      .then(() => refreshCatalog())
      .catch((caught: unknown) => {
        setError(caught instanceof ApiError ? caught.message : "Could not save that.");
      })
      .finally(() => {
        setBusy(false);
      });
  };
  return { busy, error, run };
}

export function CatalogEditor() {
  const { semesters, topics, fromServer } = useCatalog();
  const saved = semesters.filter((semester) => !semester.placeholder);
  const missing = [1, 2, 3].filter((number) => !saved.some((semester) => semester.number === number));
  const { busy, error, run } = useRun();

  return (
    <>
      <section className="group">
        <h2 className="group-header">Semesters and courses</h2>
        <div className="stack">
          {saved.map((semester) => (
            <SemesterCard key={semester.id} semester={semester} semesters={saved} busy={busy} onRun={run} />
          ))}
          {missing.map((number) => (
            <Button
              key={number}
              variant="secondary"
              fullWidth
              disabled={busy || !fromServer}
              onClick={() => {
                run(() => api("/api/semesters", { method: "POST", json: { number } }));
              }}
            >
              Add Semester {number}
            </Button>
          ))}
          {fromServer ? null : <p className="group-footer">Sign in to add a semester or a course.</p>}
        </div>
        <p className="group-footer">
          Rename, move between semesters, archive or unarchive a course. Archive a semester you finished. Courses can also be made from Import.
        </p>
        {error ? <p className="form-error">{error}</p> : null}
      </section>
      {fromServer ? <TopicsSection topics={topics} /> : null}
    </>
  );
}

/**
 * Her study topics: rename, put in her order, archive or unarchive, and add one. Archived topics are
 * listed after the others; Home keeps them in its closed Archived group.
 */
function TopicsSection({ topics }: { topics: readonly CourseLink[] }) {
  const { busy, error, run: onRun } = useRun();
  const [title, setTitle] = useState("");
  const inUse = topics.filter((topic) => topic.archivedAt === null);
  const archived = topics.filter((topic) => topic.archivedAt !== null);
  // The order names every topic, archived ones after the ones in use.
  const move = (from: number, to: number) => {
    const ids = [...reordered(inUse.map((topic) => topic.id), from, to), ...archived.map((topic) => topic.id)];
    onRun(() => saveTopicOrder(ids));
  };

  return (
    <section className="group">
      <h2 className="group-header">Study topics</h2>
      <div className="group-card stack">
        {inUse.map((topic, index) => (
          <TopicRow key={topic.id} topic={topic} place={{ index, count: inUse.length, move }} busy={busy} onRun={onRun} />
        ))}
        {archived.map((topic) => (
          <TopicRow key={topic.id} topic={topic} place={null} busy={busy} onRun={onRun} />
        ))}
        <TextField label="New topic name" value={title} onChange={setTitle} />
        <Button
          disabled={busy || title.trim() === ""}
          onClick={() => {
            onRun(async () => {
              await createTopic(title.trim());
              setTitle("");
            });
          }}
        >
          Add a topic
        </Button>
      </div>
      <p className="group-footer">Rename, reorder, archive or unarchive a topic. Topics can also be made from Home and Import.</p>
      {error ? <p className="form-error">{error}</p> : null}
    </section>
  );
}

function TopicRow({
  topic,
  place,
  busy,
  onRun,
}: {
  topic: CourseLink;
  /** Its place among her topics in use, to move it up or down; null for an archived topic. */
  place: { index: number; count: number; move: (from: number, to: number) => void } | null;
  busy: boolean;
  onRun: Run;
}) {
  const [title, setTitle] = useState(topic.title);
  const archived = topic.archivedAt !== null;

  const step = (to: number) => {
    if (place === null || busy || to < 0 || to >= place.count) return;
    place.move(place.index, to);
  };

  return (
    <div className="course-edit">
      <div className="topic-edit-name">
        <TextField label={archived ? `${topic.title} name (archived)` : `${topic.title} name`} value={title} onChange={setTitle} />
        {place === null ? null : (
          <div className="list-tools">
            <button
              type="button"
              className="icon-button list-move"
              aria-label={`Move ${topic.title} up`}
              aria-disabled={busy || place.index === 0}
              onClick={() => {
                step(place.index - 1);
              }}
            >
              <Icon name="chevron-up" size={20} />
            </button>
            <button
              type="button"
              className="icon-button list-move"
              aria-label={`Move ${topic.title} down`}
              aria-disabled={busy || place.index === place.count - 1}
              onClick={() => {
                step(place.index + 1);
              }}
            >
              <Icon name="chevron-down" size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="row-actions">
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => {
            onRun(() => api(`/api/courses/${topic.id}`, { method: "PATCH", json: { title } }));
          }}
        >
          Save {topic.title}
        </Button>
        <Button
          variant="plain"
          disabled={busy}
          onClick={() => {
            onRun(() => api(`/api/courses/${topic.id}`, { method: "PATCH", json: { archived: !archived } }));
          }}
        >
          {archived ? `Unarchive ${topic.title}` : `Archive ${topic.title}`}
        </Button>
      </div>
    </div>
  );
}

function SemesterCard({
  semester,
  semesters,
  busy,
  onRun,
}: {
  semester: SemesterGroup;
  semesters: readonly SemesterGroup[];
  busy: boolean;
  onRun: (work: () => Promise<unknown>) => void;
}) {
  const [name, setName] = useState(semester.name);
  const [startsOn, setStartsOn] = useState(semester.startsOn ?? "");
  const [endsOn, setEndsOn] = useState(semester.endsOn ?? "");
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="group-card stack">
      <TextField label={`${semester.label} name`} value={name} onChange={setName} />
      <label className="field">
        <span className="field-label">Starts</span>
        <input
          className="control"
          type="date"
          aria-label={`${semester.label} starts`}
          value={startsOn}
          onChange={(event) => {
            setStartsOn(event.target.value);
          }}
        />
      </label>
      <label className="field">
        <span className="field-label">Ends</span>
        <input
          className="control"
          type="date"
          aria-label={`${semester.label} ends`}
          value={endsOn}
          onChange={(event) => {
            setEndsOn(event.target.value);
          }}
        />
      </label>
      <div className="row-actions">
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => {
            onRun(() =>
              api(`/api/semesters/${semester.id}`, {
                method: "PATCH",
                json: { name, startsOn: startsOn === "" ? null : startsOn, endsOn: endsOn === "" ? null : endsOn },
              }),
            );
          }}
        >
          Save {semester.label}
        </Button>
        {/* By hand only: nothing archives a semester when it ends. */}
        <Button
          variant="plain"
          disabled={busy}
          onClick={() => {
            onRun(() => api(`/api/semesters/${semester.id}`, { method: "PATCH", json: { archived: semester.archivedAt === null } }));
          }}
        >
          {semester.archivedAt === null ? `Archive ${semester.label}` : `Unarchive ${semester.label}`}
        </Button>
      </div>
      {semester.courses.map((course) => (
        <CourseRow key={course.id} course={course} semesters={semesters} busy={busy} onRun={onRun} />
      ))}
      <TextField label={`Course code in ${semester.label}`} value={code} onChange={setCode} />
      <TextField label={`Course name in ${semester.label}`} value={title} onChange={setTitle} />
      <Button
        disabled={busy || code.trim() === "" || title.trim() === ""}
        onClick={() => {
          onRun(async () => {
            await api("/api/courses", { method: "POST", json: { semesterId: semester.id, code, title } });
            setCode("");
            setTitle("");
          });
        }}
      >
        Add a course to {semester.label}
      </Button>
    </div>
  );
}

function CourseRow({
  course,
  semesters,
  busy,
  onRun,
}: {
  course: CourseLink;
  semesters: readonly SemesterGroup[];
  busy: boolean;
  onRun: (work: () => Promise<unknown>) => void;
}) {
  const [code, setCode] = useState(course.code);
  const [title, setTitle] = useState(course.title);
  const currentSemester = semesters.find((semester) => semester.courses.some((item) => item.id === course.id));
  const [semesterId, setSemesterId] = useState(currentSemester?.id ?? semesters[0]?.id ?? "");

  return (
    <div className="course-edit">
      <TextField label={`${course.code} code`} value={code} onChange={setCode} />
      <TextField label={`${course.code} name`} value={title} onChange={setTitle} />
      <label className="field">
        <span className="field-label">Semester</span>
        <select
          className="control"
          aria-label={`Semester for ${course.code}`}
          value={semesterId}
          onChange={(event) => {
            setSemesterId(event.target.value);
          }}
        >
          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.label}
            </option>
          ))}
        </select>
      </label>
      <div className="row-actions">
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => {
            onRun(() => api(`/api/courses/${course.id}`, { method: "PATCH", json: { code, title, semesterId } }));
          }}
        >
          Save {course.code}
        </Button>
        <Button
          variant="plain"
          disabled={busy}
          onClick={() => {
            onRun(() => api(`/api/courses/${course.id}`, { method: "PATCH", json: { archived: course.archivedAt === null } }));
          }}
        >
          {course.archivedAt === null ? `Archive ${course.code}` : `Unarchive ${course.code}`}
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ApiError, api } from "../api";
import { refreshCatalog, useCatalog, type CourseLink, type SemesterGroup } from "../catalog";
import { Button } from "./Button";
import { TextField } from "./TextField";

export function CatalogEditor() {
  const { semesters, fromServer } = useCatalog();
  const saved = semesters.filter((semester) => !semester.placeholder);
  const missing = [1, 2, 3].filter((number) => !saved.some((semester) => semester.number === number));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = (work: () => Promise<unknown>) => {
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

  return (
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
      <p className="group-footer">Rename, move between semesters, archive or unarchive a course. Courses can also be made from Import.</p>
      {error ? <p className="form-error">{error}</p> : null}
    </section>
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

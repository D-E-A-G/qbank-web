import { useState } from "react";
import { ApiError, api, type SemesterCourse } from "../api";
import { refreshCatalog, type CourseLink, type SemesterGroup } from "../catalog";
import { FormSheet } from "./FormSheet";

/** New course in a semester, from Home's +: a code and a name. Done opens the course, empty, with its own + there. */
export function NewCourseSheet({
  semester,
  onMade,
  onClose,
}: {
  semester: SemesterGroup;
  onMade: (course: SemesterCourse) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    if (code.trim() === "") {
      setError("Give the course a code.");
      return;
    }
    if (title.trim() === "") {
      setError("Give the course a name.");
      return;
    }
    setBusy(true);
    setError(null);
    api<SemesterCourse>("/api/courses", { method: "POST", json: { semesterId: semester.id, code: code.trim(), title: title.trim() } })
      .then(async (course) => {
        await refreshCatalog();
        onMade(course);
      })
      .catch((caught: unknown) => {
        setBusy(false);
        setError(refusal(caught, "Could not make the course."));
      });
  };

  return (
    <FormSheet title={`New course in ${semester.label}`} busy={busy} error={error} onDone={save} onClose={onClose}>
      <CodeField value={code} onChange={setCode} autoFocus />
      <NameField label="Course name" value={title} onChange={setTitle} />
      <p className="sheet-hint">Its first question file can go straight into it from its +.</p>
    </FormSheet>
  );
}

/** Rename, from Home's card menu or the course or topic screen: a course's code and name, or a topic's name. Its folders, sets and progress stay. */
export function RenameCourseSheet({
  course,
  onSaved,
  onClose,
}: {
  course: Pick<CourseLink, "id" | "kind" | "code" | "title">;
  onSaved: () => void;
  onClose: () => void;
}) {
  const topic = course.kind === "topic";
  const [code, setCode] = useState(course.code);
  const [title, setTitle] = useState(course.title);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const nextCode = code.trim();
    const nextTitle = title.trim();
    if (nextTitle === course.title && (topic || nextCode === course.code)) {
      onClose();
      return;
    }
    if (!topic && nextCode === "") {
      setError("Give the course a code.");
      return;
    }
    if (nextTitle === "") {
      setError(topic ? "Give the topic a name." : "Give the course a name.");
      return;
    }
    setBusy(true);
    setError(null);
    api(`/api/courses/${course.id}`, { method: "PATCH", json: topic ? { title: nextTitle } : { code: nextCode, title: nextTitle } })
      .then(async () => {
        await refreshCatalog();
        onSaved();
      })
      .catch((caught: unknown) => {
        setBusy(false);
        setError(refusal(caught, topic ? "Could not rename the topic." : "Could not rename the course."));
      });
  };

  return (
    <FormSheet title={topic ? "Rename topic" : "Rename course"} doneLabel="Save" busy={busy} error={error} onDone={save} onClose={onClose}>
      {topic ? null : <CodeField value={code} onChange={setCode} autoFocus />}
      <NameField label={topic ? "Topic name" : "Course name"} value={title} onChange={setTitle} autoFocus={topic} />
      <p className="sheet-hint">Only the name changes. Its folders, sets and your progress stay with it.</p>
    </FormSheet>
  );
}

function CodeField({ value, onChange, autoFocus }: { value: string; onChange: (value: string) => void; autoFocus: boolean }) {
  return (
    <label className="field">
      <span className="field-label">Course code</span>
      <input
        className="control"
        aria-label="Course code"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        placeholder="NURS 310"
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </label>
  );
}

function NameField({ label, value, onChange, autoFocus = false }: { label: string; value: string; onChange: (value: string) => void; autoFocus?: boolean }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className="control"
        aria-label={label}
        value={value}
        maxLength={160}
        autoFocus={autoFocus}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </label>
  );
}

function refusal(caught: unknown, fallback: string): string {
  return caught instanceof ApiError ? caught.message : fallback;
}

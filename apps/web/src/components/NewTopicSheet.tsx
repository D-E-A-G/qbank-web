import { useState } from "react";
import { ApiError, type SemesterCourse } from "../api";
import { refreshCatalog } from "../catalog";
import { createTopic } from "../course/requests";
import { FormSheet } from "./FormSheet";

/** New study topic, from Home's +: a name, nothing else. A name another of her topics has is refused by the server. */
export function NewTopicSheet({ onMade, onClose }: { onMade: (topic: SemesterCourse) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const title = name.trim();
    if (title === "") {
      setError("Give the topic a name.");
      return;
    }
    setBusy(true);
    setError(null);
    createTopic(title)
      .then(async (topic) => {
        await refreshCatalog();
        onMade(topic);
      })
      .catch((caught: unknown) => {
        setBusy(false);
        setError(caught instanceof ApiError ? caught.message : "Could not make the topic.");
      });
  };

  return (
    <FormSheet title="New study topic" busy={busy} error={error} onDone={save} onClose={onClose}>
      <label className="field">
        <span className="field-label">Topic name</span>
        <input
          className="control"
          aria-label="Topic name"
          value={name}
          maxLength={160}
          autoFocus
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </label>
      <p className="sheet-hint">A topic has folders and study pages, like a course, without a semester.</p>
    </FormSheet>
  );
}

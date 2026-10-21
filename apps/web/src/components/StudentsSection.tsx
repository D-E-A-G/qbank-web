import { useState } from "react";
import { ApiError } from "../api";
import { StudentPassword } from "../login/AccountPanels";
import { pickStudent, useStudents, viewedStudent } from "../students";
import { EmptyState } from "./EmptyState";

/** Which student the admin looks after, and her temporary password. */
export function StudentsSection() {
  const list = useStudents(true);
  const student = viewedStudent(list);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <section className="group">
      <h2 className="group-header">User account</h2>
      {list === null ? null : student === null ? (
        <div className="empty-card">
          <EmptyState icon="user" message="No user account yet. Add an email to the sign-up list, and that person can sign up." />
        </div>
      ) : (
        <div className="group-card stack">
          {list.students.length > 1 ? (
            <label className="field">
              <span className="field-label">Showing progress for</span>
              <select
                className="control"
                aria-label="Showing progress for"
                value={student.id}
                disabled={busy}
                onChange={(event) => {
                  setError(null);
                  setBusy(true);
                  void pickStudent(event.target.value)
                    .catch((caught: unknown) => {
                      setError(caught instanceof ApiError ? caught.message : "Could not switch to that user account.");
                    })
                    .finally(() => {
                      setBusy(false);
                    });
                }}
              >
                {list.students.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.email}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="form-note">{student.email}</p>
          )}
          {error ? <p className="form-error">{error}</p> : null}
          <StudentPassword key={student.id} email={student.email} />
        </div>
      )}
      {list !== null && list.students.length > 1 ? (
        <p className="group-footer">Home, courses, Review, exams, the temporary password, and Repair all use the user account picked here.</p>
      ) : null}
    </section>
  );
}

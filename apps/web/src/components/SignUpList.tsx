import { useEffect, useState } from "react";
import { ApiError, api } from "../api";
import type { components } from "../api-schema";
import { refreshStudents } from "../students";
import { when } from "../when";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { TextField } from "./TextField";

type SignUpEmail = components["schemas"]["SignUpEmail"];

/** The emails that may make their own student account from the Sign up screen. */
export function SignUpList() {
  const [emails, setEmails] = useState<SignUpEmail[] | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancel = false;
    void api<{ emails: SignUpEmail[] }>("/api/admin/sign-up-emails")
      .then((body) => {
        if (!cancel) setEmails(body.emails);
      })
      .catch((caught: unknown) => {
        if (!cancel) setError(caught instanceof ApiError ? caught.message : "Could not load the sign-up list.");
      });
    // A student who signed up since the last visit belongs in the Student picker too.
    void refreshStudents().catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, []);

  const run = (work: () => Promise<{ emails: SignUpEmail[] }>, after?: () => void) => {
    setError(null);
    setBusy(true);
    void work()
      .then((body) => {
        setEmails(body.emails);
        after?.();
      })
      .catch((caught: unknown) => {
        setError(caught instanceof ApiError ? caught.message : "Could not save that.");
      })
      .finally(() => {
        setBusy(false);
      });
  };

  return (
    <section className="group">
      <h2 className="group-header">Sign-up list</h2>
      {emails !== null && emails.length > 0 ? (
        <ul className="review-list" aria-label="Emails that can sign up">
          {emails.map((row) => (
            <li key={row.email}>
              <div className="review-row">
                <span className="row-icon">
                  <Icon name={row.hasAccount ? "user" : "mail"} size={20} />
                </span>
                <span className="review-copy">
                  <span className="review-topic signup-email">{row.email}</span>
                  <span className="review-meta">{row.hasAccount ? "Has an account" : `Added ${when(row.addedAt)} · not signed up yet`}</span>
                </span>
                <button
                  type="button"
                  className="btn btn-destructive passkey-remove"
                  aria-label={`Remove ${row.email}`}
                  disabled={busy}
                  onClick={() => {
                    run(() => api(`/api/admin/sign-up-emails/${encodeURIComponent(row.email)}`, { method: "DELETE" }));
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <form
        className="group-card stack"
        onSubmit={(event) => {
          event.preventDefault();
          run(
            () => api("/api/admin/sign-up-emails", { method: "POST", json: { email } }),
            () => {
              setEmail("");
            },
          );
        }}
      >
        <TextField label="Email to add" type="email" value={email} onChange={setEmail} />
        <Button type="submit" variant="secondary" disabled={busy || email.trim() === ""}>
          Add email
        </Button>
        {error ? <p className="form-error">{error}</p> : null}
      </form>
      <p className="group-footer">
        Only these emails can make an account from the Sign up screen, one account each. Removing an email does not remove an account made with it.
      </p>
    </section>
  );
}

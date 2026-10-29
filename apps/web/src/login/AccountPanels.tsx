import { useEffect, useState } from "react";
import { AGENTS_PATH } from "../agents/agents";
import { Icon } from "../components/Icon";
import { ShellLink } from "../shell/ShellLink";
import {
  ApiError,
  changePassword,
  deletePasskey,
  listPasskeys,
  setTemporaryPassword,
  signOut,
  type Account,
  type Passkey,
} from "./api";
import { DeleteAccountSheet } from "./DeleteAccountSheet";
import { isDeleteOffered } from "./delete-account";
import { forgetPasskeyOffer } from "./offer";
import { savePasskey } from "./passkey";
import { Button, TextField } from "./ui";

export function AccountSection({ user, onUser, onSignedOut }: { user: Account; onUser: (user: Account) => void; onSignedOut: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancel = false;
    void listPasskeys()
      .then((rows) => {
        if (!cancel) setPasskeys(rows);
      })
      .catch(() => {
        if (!cancel) setPasskeys([]);
      });
    return () => {
      cancel = true;
    };
  }, [user.id]);

  return (
    <section className="group">
      <h2 className="group-header">Account</h2>
      <div className="group-card auth-stack">
        <p className="form-note">Signed in as {user.email}.</p>
        <form
          className="auth-stack"
          onSubmit={(event) => {
            event.preventDefault();
            setBusy(true);
            setError(undefined);
            setMessage(undefined);
            void changePassword(currentPassword, newPassword)
              .then((next) => {
                onUser(next);
                setCurrentPassword("");
                setNewPassword("");
                setMessage("Password saved.");
              })
              .catch((caught: unknown) => {
                setError(caught instanceof ApiError ? caught.message : "The password could not be changed.");
              })
              .finally(() => {
                setBusy(false);
              });
          }}
        >
          <TextField
            id="settings-current-password"
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <TextField
            id="settings-new-password"
            label="New password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <Button type="submit" size="md" disabled={busy}>
            Change password
          </Button>
        </form>
        {passkeys.map((passkey) => (
          <div className="passkey-row" key={passkey.id}>
            <span className="passkey-name">{passkey.name ?? "Passkey"}</span>
            <button
              className="btn btn-destructive passkey-remove"
              type="button"
              onClick={() => {
                void deletePasskey(passkey.id).then(() => {
                  setPasskeys((rows) => rows.filter((row) => row.id !== passkey.id));
                });
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <Button
          variant="secondary"
          size="md"
          icon="scan-face"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            setError(undefined);
            void savePasskey()
              .then(() => listPasskeys())
              .then((rows) => {
                setPasskeys(rows);
                setMessage("Passkey saved on this device.");
              })
              .catch((caught: unknown) => {
                setError(caught instanceof ApiError ? caught.message : "That passkey was not accepted.");
              })
              .finally(() => {
                setBusy(false);
              });
          }}
        >
          Save a passkey
        </Button>
        {message !== undefined ? <p className="form-note">{message}</p> : null}
        {error !== undefined ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <ShellLink to={AGENTS_PATH} className="account-link" current={false}>
          <span className="row-icon">
            <Icon name="link-2" size={20} />
          </span>
          <span className="list-copy">
            <span className="list-title">Connect an agent</span>
            <span className="list-meta">Approve its code, and see your keys</span>
          </span>
          <span className="list-chevron">
            <Icon name="chevron-right" size={18} strokeWidth={2} />
          </span>
        </ShellLink>
        <Button
          variant="quiet"
          size="md"
          icon="log-out"
          onClick={() => {
            void signOut().finally(onSignedOut);
          }}
        >
          Sign out
        </Button>
        {isDeleteOffered(user) ? (
          <Button
            variant="destructive"
            size="md"
            icon="trash-2"
            onClick={() => {
              setDeleting(true);
            }}
          >
            Delete account
          </Button>
        ) : null}
      </div>
      {deleting ? (
        <DeleteAccountSheet
          email={user.email}
          onDone={(outcome) => {
            if (outcome.kind === "deleted") {
              // The server ended its sessions and cleared this device's cookie; the rest goes as a sign-out's does.
              forgetPasskeyOffer(user.id);
              onSignedOut();
            } else if (outcome.kind === "signed-out") {
              void signOut().finally(onSignedOut);
            } else {
              onUser({ ...user, mustChangePassword: true });
            }
          }}
          onClose={() => {
            setDeleting(false);
          }}
        />
      ) : null}
    </section>
  );
}

/** The admin sets a temporary password for the student he is looking at. */
export function StudentPassword({ email }: { email: string }) {
  const [temporaryPassword, setTemporary] = useState("");
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="auth-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setBusy(true);
        setError(undefined);
        setMessage(undefined);
        void setTemporaryPassword(temporaryPassword)
          .then((reset) => {
            setTemporary("");
            setMessage(`Temporary password set for ${reset}. She'll choose her own the next time she signs in.`);
          })
          .catch((caught: unknown) => {
            setError(caught instanceof ApiError ? caught.message : "The temporary password could not be set.");
          })
          .finally(() => {
            setBusy(false);
          });
      }}
    >
      <TextField
        id="temporary-password"
        label="Temporary password"
        type="text"
        autoComplete="off"
        value={temporaryPassword}
        onChange={setTemporary}
        hint={`For ${email}. Give it to her yourself. She'll choose her own the next time she signs in.`}
      />
      <Button type="submit" variant="secondary" icon="lock" disabled={busy}>
        Set temporary password
      </Button>
      {message !== undefined ? <p className="form-note">{message}</p> : null}
      {error !== undefined ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

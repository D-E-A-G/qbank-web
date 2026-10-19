import { useEffect, useState } from "react";
import { ApiError, changePassword, readSession, signInWithPassword, signUp, type Account } from "./api";
import { signInWithPasskey } from "./passkey";
import { AuthFrame, Button, TextField } from "./ui";

/** The server's rule for a new password. */
const PASSWORD_MIN_LENGTH = 8;

type Screen = "sign-in" | "forgot" | "sign-up";

const TITLES: Record<Screen, string> = {
  "sign-in": "Sign in · Qbank",
  forgot: "Forgot password? · Qbank",
  "sign-up": "Sign up · Qbank",
};

export function LoginScreen({ onSignedIn }: { onSignedIn: (user: Account, method: "password" | "passkey") => void }) {
  const [screen, setScreen] = useState<Screen>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = TITLES[screen];
  }, [screen]);

  async function submitPassword(): Promise<void> {
    setBusy(true);
    setError(undefined);
    try {
      const user = await signInWithPassword(email, password);
      onSignedIn(user, "password");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Sign-in failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submitSignUp(): Promise<void> {
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Choose a password of at least ${String(PASSWORD_MIN_LENGTH)} characters.`);
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      const user = await signUp(email, password);
      onSignedIn(user, "password");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Sign-up failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function show(next: Screen): void {
    setError(undefined);
    setPassword("");
    setScreen(next);
  }

  async function submitPasskey(): Promise<void> {
    setBusy(true);
    setError(undefined);
    try {
      await signInWithPasskey();
      const user = await readSession();
      if (!user) {
        setError("That passkey was not accepted.");
        return;
      }
      onSignedIn(user, "passkey");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "That passkey was not accepted.");
    } finally {
      setBusy(false);
    }
  }

  if (screen === "forgot") {
    return (
      <AuthFrame title="Forgot password?" subtitle="This app doesn't send email.">
        <div className="auth-stack">
          <p className="auth-copy">
            Ask the owner to reset your password from his admin account. He'll give you a temporary password, and you'll
            choose your own the next time you sign in.
          </p>
          <Button
            variant="plain"
            onClick={() => {
              setScreen("sign-in");
            }}
          >
            Back to sign in
          </Button>
        </div>
      </AuthFrame>
    );
  }

  if (screen === "sign-up") {
    return (
      <AuthFrame title="Sign up" subtitle="For an email the owner has added.">
        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            void submitSignUp();
          }}
        >
          <TextField id="email" label="Email" type="email" autoComplete="username" value={email} onChange={setEmail} />
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            hint={`At least ${String(PASSWORD_MIN_LENGTH)} characters.`}
          />
          {error !== undefined ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={busy}>
            Sign up
          </Button>
          <Button
            variant="plain"
            onClick={() => {
              show("sign-in");
            }}
          >
            I have an account
          </Button>
        </form>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame title="Qbank" subtitle="NCLEX practice, synced across your devices.">
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          void submitPassword();
        }}
      >
        <TextField id="email" label="Email" type="email" autoComplete="username" value={email} onChange={setEmail} />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />
        {error !== undefined ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={busy}>
          Sign in
        </Button>
        <Button variant="secondary" icon="scan-face" disabled={busy} onClick={() => void submitPasskey()}>
          Sign in with a passkey
        </Button>
        <Button
          variant="plain"
          onClick={() => {
            setError(undefined);
            setScreen("forgot");
          }}
        >
          Forgot password?
        </Button>
        <Button
          variant="plain"
          onClick={() => {
            show("sign-up");
          }}
        >
          Sign up
        </Button>
      </form>
    </AuthFrame>
  );
}

export function ChoosePassword({ onChosen }: { onChosen: (user: Account) => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Choose a new password · Qbank";
  }, []);

  return (
    <AuthFrame title="Choose a new password" subtitle="Choose a new password to continue.">
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          setBusy(true);
          setError(undefined);
          void changePassword(currentPassword, newPassword)
            .then(onChosen)
            .catch((caught: unknown) => {
              setError(caught instanceof ApiError ? caught.message : "The password could not be changed.");
            })
            .finally(() => {
              setBusy(false);
            });
        }}
      >
        <TextField
          id="current-password"
          label="Temporary password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <TextField
          id="new-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={setNewPassword}
          hint="At least 8 characters, and different from the temporary one."
        />
        {error !== undefined ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={busy}>
          Save password
        </Button>
      </form>
    </AuthFrame>
  );
}

export function PasskeyOffer({
  busy,
  onSave,
  onDismiss,
}: {
  busy: boolean;
  onSave: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="sheet-backdrop">
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="passkey-offer-title">
        <h2 id="passkey-offer-title" className="sheet-title">
          Save a passkey for this device?
        </h2>
        <p className="sheet-copy">Next time, sign in with Face ID instead of your password. You can remove it in Settings.</p>
        <Button icon="scan-face" disabled={busy} onClick={onSave}>
          Save a passkey
        </Button>
        <Button variant="plain" disabled={busy} onClick={onDismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
}

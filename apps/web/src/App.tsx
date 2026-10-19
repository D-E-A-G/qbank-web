import { useEffect, useLayoutEffect, useState } from "react";
import { ApiError, readSession, type Account } from "./login/api";
import { ChoosePassword, LoginScreen, PasskeyOffer } from "./login/LoginScreen";
import { AuthFrame } from "./login/ui";
import { passkeyOfferState, rememberPasskeyOffer } from "./login/offer";
import { savePasskey } from "./login/passkey";
import { SessionProvider } from "./login/session";
import { navigate } from "./router";
import { AppShell } from "./shell/AppShell";
import { forgetStudents } from "./students";
import { forgetPalette, paletteOf, showPalette } from "./theme";

type Gate =
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "signed-out" }
  | { status: "must-change"; user: Account }
  | { status: "signed-in"; user: Account; offer: boolean };

export function App() {
  const [gate, setGate] = useState<Gate>({ status: "loading" });
  const [savingPasskey, setSavingPasskey] = useState(false);

  useEffect(() => {
    if (gate.status === "unavailable") document.title = "Qbank";
  }, [gate.status]);

  // The account's color scheme, before the screen paints; Dusk when no one is signed in. While the
  // session is checked, the head script in index.html has already painted the last one used here.
  const palette = gate.status === "loading" ? undefined : "user" in gate ? paletteOf(gate.user.palette) : null;
  useLayoutEffect(() => {
    if (palette === undefined) return;
    if (palette === null) forgetPalette();
    else showPalette(palette);
  }, [palette]);

  useEffect(() => {
    const controller = new AbortController();
    readSession(controller.signal)
      .then((user) => {
        if (!user) setGate({ status: "signed-out" });
        else if (user.mustChangePassword) setGate({ status: "must-change", user });
        else setGate({ status: "signed-in", user, offer: false });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        // Auth stays off until the server secret is set. The question screens stay closed.
        if (error instanceof ApiError && error.code === "auth_unavailable") {
          setGate({ status: "unavailable" });
          return;
        }
        console.error(error);
        setGate({ status: "signed-out" });
      });
    return () => {
      controller.abort();
    };
  }, []);

  if (gate.status === "loading") {
    return (
      <main className="auth">
        <p className="auth-status" role="status">
          Checking the session...
        </p>
      </main>
    );
  }

  if (gate.status === "unavailable") {
    return (
      <AuthFrame title="Qbank" subtitle="Sign-in is not available right now." />
    );
  }

  if (gate.status === "signed-out") {
    return (
      <LoginScreen
        onSignedIn={(user, method) => {
          if (user.mustChangePassword) {
            setGate({ status: "must-change", user });
            return;
          }
          setGate({
            status: "signed-in",
            user,
            offer: method === "password" && passkeyOfferState(user.id) === null,
          });
        }}
      />
    );
  }

  if (gate.status === "must-change") {
    return (
      <ChoosePassword
        onChosen={(user) => {
          setGate({ status: "signed-in", user, offer: passkeyOfferState(user.id) === null });
        }}
      />
    );
  }

  const user = gate.user;
  return (
    <SessionProvider
      value={{
        user,
        replace: (next) => {
          setGate({ status: "signed-in", user: next, offer: false });
        },
        signOut: () => {
          forgetStudents();
          navigate("/");
          setGate({ status: "signed-out" });
        },
      }}
    >
      <AppShell role={user.role} />
      {gate.offer ? (
        <PasskeyOffer
          busy={savingPasskey}
          onDismiss={() => {
            rememberPasskeyOffer(user.id, "dismissed");
            setGate({ status: "signed-in", user, offer: false });
          }}
          onSave={() => {
            setSavingPasskey(true);
            void savePasskey()
              .then(() => {
                rememberPasskeyOffer(user.id, "saved");
                setGate({ status: "signed-in", user, offer: false });
              })
              .catch((error: unknown) => {
                console.error(error);
              })
              .finally(() => {
                setSavingPasskey(false);
              });
          }}
        />
      ) : null}
    </SessionProvider>
  );
}

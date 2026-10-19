import { useState } from "react";
import { ApiError } from "../api";
import { CatalogEditor } from "../components/CatalogEditor";
import { Icon } from "../components/Icon";
import { SegmentedControl } from "../components/SegmentedControl";
import { downloadProgressExport } from "../export";
import { AccountSection } from "../login/AccountPanels";
import { useSession } from "../login/session-context";
import { Screen } from "../shell/Screen";
import { setLook, useLook, type Look } from "../theme";

const LOOK_OPTIONS: readonly { value: Look; label: string }[] = [
  { value: "auto", label: "Match device" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function SettingsScreen() {
  const look = useLook();
  const session = useSession();
  const student = session.user.role === "student";
  return (
    <Screen title="Settings">
      <AccountSection user={session.user} onUser={session.replace} onSignedOut={session.signOut} />
      {student ? <CatalogEditor /> : null}
      <section className="group">
        <h2 className="group-header">Look</h2>
        <div className="group-card">
          <SegmentedControl label="Look" value={look} options={LOOK_OPTIONS} onChange={setLook} />
        </div>
        <p className="group-footer">Match device follows this device's light or dark setting.</p>
      </section>
      {student ? <ExportSection /> : null}
    </Screen>
  );
}

function ExportSection() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  return (
    <section className="group">
      <div className="review-list">
        <button
          type="button"
          className="review-row"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            setError(undefined);
            setDone(undefined);
            void downloadProgressExport()
              .then((name) => {
                setDone(`Downloaded ${name}`);
              })
              .catch((caught: unknown) => {
                setError(caught instanceof ApiError ? caught.message : "Your progress could not be exported. Try again.");
              })
              .finally(() => {
                setBusy(false);
              });
          }}
        >
          <span className="row-icon">
            <Icon name="download" size={20} />
          </span>
          <span className="review-copy">
            <span className="review-topic">Export my progress</span>
            {busy || done !== undefined ? <span className="review-meta">{busy ? "Preparing the file…" : done}</span> : null}
          </span>
        </button>
      </div>
      {error !== undefined ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <p className="group-footer">Downloads your answers and progress as a JSON file.</p>
    </section>
  );
}

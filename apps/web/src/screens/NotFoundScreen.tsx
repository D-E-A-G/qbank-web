import { Screen } from "../shell/Screen";
import { ShellLink } from "../shell/ShellLink";

export function NotFoundScreen() {
  return (
    <Screen title="Not found">
      <p className="note">That screen is not in the app.</p>
      <ShellLink to="/" className="text-action" current={false}>
        Go to Home
      </ShellLink>
    </Screen>
  );
}

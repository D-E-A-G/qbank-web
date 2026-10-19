import type { ComponentType } from "react";
import type { IconName } from "./components/Icon";
import type { Role } from "./session";
import { AdminScreen } from "./screens/AdminScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ImportScreen } from "./screens/ImportScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { normalizePath } from "./router";

/** Drop a feature screen in by replacing its component. Order is the navigation order. */
export interface AppRoute {
  id: string;
  path: string;
  label: string;
  icon: IconName;
  /** Admin is listed only for the owner's role. Login supplies the role. */
  nav: Role;
  /** Reading width for settings-style pages; wide for the home grid. */
  width: "wide" | "reading";
  Screen: ComponentType;
}

export const routes = [
  { id: "home", path: "/", label: "Home", icon: "house", nav: "student", width: "wide", Screen: HomeScreen },
  { id: "import", path: "/import", label: "Import", icon: "file-input", nav: "student", width: "wide", Screen: ImportScreen },
  { id: "admin", path: "/admin", label: "Admin", icon: "shield", nav: "admin", width: "reading", Screen: AdminScreen },
  { id: "settings", path: "/settings", label: "Settings", icon: "settings", nav: "student", width: "reading", Screen: SettingsScreen },
] as const satisfies readonly AppRoute[];

export function navigationFor(role: Role): readonly AppRoute[] {
  return routes.filter((route) => route.nav === "student" || route.nav === role);
}

export function matchRoute(pathname: string): AppRoute | undefined {
  const path = normalizePath(pathname);
  return routes.find((route) => route.path === path);
}

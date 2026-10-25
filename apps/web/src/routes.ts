import type { ComponentType } from "react";
import type { IconName } from "./components/Icon";
import type { Role } from "./session";
import { AGENTS_PATH } from "./agents/agents";
import { AdminScreen } from "./screens/AdminScreen";
import { AgentsScreen } from "./screens/AgentsScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ImportScreen } from "./screens/ImportScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { normalizePath } from "./router";

/** A screen at its own address, titled by its label. */
export interface ScreenRoute {
  path: string;
  label: string;
  /** Reading width for settings-style pages; wide for the home grid. */
  width: "wide" | "reading";
  Screen: ComponentType;
}

/** Drop a feature screen in by replacing its component. Order is the navigation order. */
export interface AppRoute extends ScreenRoute {
  id: string;
  icon: IconName;
  /** Admin is listed only for the owner's role. Login supplies the role. */
  nav: Role;
}

export const routes = [
  { id: "home", path: "/", label: "Home", icon: "house", nav: "student", width: "wide", Screen: HomeScreen },
  { id: "import", path: "/import", label: "Import", icon: "file-input", nav: "student", width: "wide", Screen: ImportScreen },
  { id: "admin", path: "/admin", label: "Admin", icon: "shield", nav: "admin", width: "reading", Screen: AdminScreen },
  { id: "settings", path: "/settings", label: "Settings", icon: "settings", nav: "student", width: "reading", Screen: SettingsScreen },
] as const satisfies readonly AppRoute[];

/** Screens opened from a section's screen rather than the navigation, under its address, so that section stays selected. */
export const subRoutes = [{ path: AGENTS_PATH, label: "Connect an agent", width: "reading", Screen: AgentsScreen }] as const satisfies readonly ScreenRoute[];

export function navigationFor(role: Role): readonly AppRoute[] {
  return routes.filter((route) => route.nav === "student" || route.nav === role);
}

export function matchRoute(pathname: string): ScreenRoute | undefined {
  const path = normalizePath(pathname);
  return routes.find((route) => route.path === path) ?? subRoutes.find((route) => route.path === path);
}

/** A section's own screen, or one opened from it (Settings › Connect an agent). Home is only itself. */
export function inSection(pathname: string, section: string): boolean {
  return pathname === section || (section !== "/" && pathname.startsWith(`${section}/`));
}

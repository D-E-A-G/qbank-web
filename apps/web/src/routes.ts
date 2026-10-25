import type { ComponentType } from "react";
import type { IconName } from "./components/Icon";
import type { Role } from "./session";
import { AGENTS_PATH } from "./agents/agents";
import { AdminScreen } from "./screens/AdminScreen";
import { AgentsScreen } from "./screens/AgentsScreen";
import { DeletedCoursesScreen } from "./screens/DeletedCoursesScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ImportScreen } from "./screens/ImportScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { DELETED_COURSES_PATH, normalizePath } from "./router";

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

/** A screen opened from a section's screen rather than the navigation; that section stays selected. */
export interface SubRoute extends ScreenRoute {
  section: string;
}

export const subRoutes = [
  { path: AGENTS_PATH, section: "/settings", label: "Connect an agent", width: "reading", Screen: AgentsScreen },
  { path: DELETED_COURSES_PATH, section: "/", label: "Recently deleted", width: "reading", Screen: DeletedCoursesScreen },
] as const satisfies readonly SubRoute[];

export function navigationFor(role: Role): readonly AppRoute[] {
  return routes.filter((route) => route.nav === "student" || route.nav === role);
}

export function matchRoute(pathname: string): ScreenRoute | undefined {
  const path = normalizePath(pathname);
  return routes.find((route) => route.path === path) ?? subRoutes.find((route) => route.path === path);
}

/** A section's own screen, or one opened from it (Settings › Connect an agent, Home › Recently deleted). */
export function inSection(pathname: string, section: string): boolean {
  if (pathname === section || subRoutes.some((route) => route.section === section && route.path === pathname)) return true;
  return section !== "/" && pathname.startsWith(`${section}/`);
}

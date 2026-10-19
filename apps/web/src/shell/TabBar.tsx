import { Icon } from "../components/Icon";
import type { AppRoute } from "../routes";
import { ShellLink } from "./ShellLink";

export function TabBar({ items, pathname }: { items: readonly AppRoute[]; pathname: string }) {
  return (
    <nav className="tabbar" aria-label="Tabs">
      {items.map((item) => {
        // A course and the screens under it are reached from Home, so Home stays selected there, as in iOS.
        const current = pathname === item.path || (item.path === "/" && pathname.startsWith("/course/"));
        return (
          <ShellLink key={item.id} to={item.path} className="tab" current={current}>
            <Icon name={item.icon} size={24} strokeWidth={current ? 2 : 1.75} />
            <span>{item.label}</span>
          </ShellLink>
        );
      })}
    </nav>
  );
}

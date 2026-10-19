import { useCatalog } from "../catalog";
import { Icon } from "../components/Icon";
import type { AppRoute } from "../routes";
import { ShellLink } from "./ShellLink";

export function Sidebar({ items, pathname }: { items: readonly AppRoute[]; pathname: string }) {
  const { semesters } = useCatalog();
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="sidebar-title">Qbank</div>
      <nav className="sidebar-nav" aria-label="Sections">
        {items.map((item) => {
          const current = pathname === item.path;
          return (
            <ShellLink key={item.id} to={item.path} className="side-item" current={current}>
              <Icon name={item.icon} size={18} strokeWidth={current ? 2 : 1.75} />
              <span className="side-item-label">{item.label}</span>
            </ShellLink>
          );
        })}
      </nav>
      {semesters.map((semester) => (
        <div key={semester.id} className="sidebar-semester">
          <div className="sidebar-semester-label">{semester.label}</div>
          {semester.courses.filter((course) => course.archivedAt === null).length === 0 ? (
            <div className="sidebar-empty">No courses yet</div>
          ) : null}
          {semester.courses
            .filter((course) => course.archivedAt === null)
            .map((course) => {
              const to = `/course/${course.id}`;
              const current = pathname === to || pathname.startsWith(`${to}/`);
              return (
                <ShellLink key={course.id} to={to} className="side-item side-item-course" current={current}>
                  <span className="side-course">
                    <span className="side-course-code">{course.code}</span>
                    <span className="side-item-label">{course.title}</span>
                  </span>
                </ShellLink>
              );
            })}
        </div>
      ))}
    </aside>
  );
}

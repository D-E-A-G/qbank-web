import type { CourseLink } from "../catalog";
import { useCatalog } from "../catalog";
import { EmptyState } from "../components/EmptyState";
import { Icon } from "../components/Icon";
import { ReadOnlyBanner } from "../components/ReadOnlyBanner";
import { useSession } from "../login/session-context";
import { Screen } from "../shell/Screen";
import { ShellLink } from "../shell/ShellLink";

export function HomeScreen() {
  const session = useSession();
  const { semesters } = useCatalog();
  return (
    <Screen title="Home">
      {session.user.role === "admin" ? <ReadOnlyBanner /> : null}
      {semesters.map((semester) => {
        const courses = semester.courses.filter((course) => course.archivedAt === null);
        return (
          <section key={semester.id} className="semester">
            <h2 className="semester-label">{semester.label}</h2>
            {courses.length === 0 ? (
              <div className="empty-card">
                <EmptyState icon="layers" message="A course appears here when its first question file is imported." />
              </div>
            ) : (
              <ul className="course-list">
                {courses.map((course) => (
                  <li key={course.id}>
                    <ShellLink to={`/course/${course.id}`} className="course-card" current={false}>
                      <span className="course-code">{course.code}</span>
                      <span className="course-card-title">{course.title}</span>
                      <span className="course-meta course-meta-row">
                        <span>
                          {course.questionCount} {course.questionCount === 1 ? "question" : "questions"} · {course.folderCount}{" "}
                          {course.folderCount === 1 ? "folder" : "folders"}
                        </span>
                        {course.reviewCount > 0 ? (
                          <span className="review-pill">
                            <Icon name="inbox" size={14} />
                            {course.reviewCount} to review
                          </span>
                        ) : null}
                      </span>
                      <CourseProgress course={course} />
                    </ShellLink>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </Screen>
  );
}

function CourseProgress({ course }: { course: CourseLink }) {
  const total = course.questionCount;
  const answered = Math.min(course.answeredCount, total);
  const pct = total === 0 ? 0 : Math.round((answered / total) * 100);
  return (
    <span className="course-progress">
      <span
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${String(pct)}% answered`}
      >
        <span className="progress-fill" style={{ width: `${String(pct)}%` }} />
      </span>
      <span className="progress-pct" aria-hidden="true">
        {pct}%
      </span>
    </span>
  );
}

import { useCallback, useState } from "react";
import type { CourseLink } from "../catalog";
import { homeLayout, useCatalog } from "../catalog";
import { EmptyState } from "../components/EmptyState";
import { Icon } from "../components/Icon";
import { NewTopicSheet } from "../components/NewTopicSheet";
import { ReadOnlyBanner } from "../components/ReadOnlyBanner";
import { useSession } from "../login/session-context";
import { navigate } from "../router";
import { Screen } from "../shell/Screen";
import { ShellLink } from "../shell/ShellLink";

export function HomeScreen() {
  const session = useSession();
  const readOnly = session.user.role !== "student";
  const catalog = useCatalog();
  const [making, setMaking] = useState(false);
  const close = useCallback(() => {
    setMaking(false);
  }, []);
  const { semesters, topics, archived } = homeLayout(catalog);

  return (
    <Screen title="Home">
      {session.user.role === "admin" ? <ReadOnlyBanner /> : null}
      {semesters.map(({ semester, courses }) => (
        <section key={semester.id} className="semester">
          <h2 className="semester-label">{semester.label}</h2>
          {courses.length === 0 ? (
            <div className="empty-card">
              <EmptyState icon="layers" message="A course appears here when its first question file is imported." />
            </div>
          ) : (
            <CourseCards courses={courses} />
          )}
        </section>
      ))}
      <section className="semester">
        <div className="semester-head">
          <h2 className="semester-label">Study topics</h2>
          {readOnly || !catalog.fromServer ? null : (
            <button
              type="button"
              className="group-action"
              aria-label="New topic"
              onClick={() => {
                setMaking(true);
              }}
            >
              New
            </button>
          )}
        </div>
        {topics.length === 0 ? (
          <div className="empty-card">
            <EmptyState icon="book-marked" message="A topic is a place for questions that are not a course: a certification, a language, your own notes." />
          </div>
        ) : (
          <CourseCards courses={topics} />
        )}
      </section>
      {archived.length > 0 ? (
        <details className="archived">
          <summary className="archived-summary">
            <span className="semester-label">Archived</span>
            <Icon name="chevron-right" size={18} strokeWidth={2} />
          </summary>
          <div className="archived-groups">
            {archived.map((group) => (
              <section key={group.key} className="group">
                <h3 className="group-header">{group.title}</h3>
                {group.courses.length === 0 ? <p className="folder-empty">No courses.</p> : <CourseCards courses={group.courses} />}
              </section>
            ))}
          </div>
        </details>
      ) : null}
      {making ? (
        <NewTopicSheet
          onMade={(topic) => {
            setMaking(false);
            navigate(`/course/${topic.id}`);
          }}
          onClose={close}
        />
      ) : null}
    </Screen>
  );
}

/** Course cards; a topic's card is called by its name alone, as a course's is by its code and name. */
function CourseCards({ courses }: { courses: readonly CourseLink[] }) {
  return (
    <ul className="course-list">
      {courses.map((course) => (
        <li key={course.id}>
          <ShellLink to={`/course/${course.id}`} className="course-card" current={false}>
            {course.kind === "topic" ? null : <span className="course-code">{course.code}</span>}
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

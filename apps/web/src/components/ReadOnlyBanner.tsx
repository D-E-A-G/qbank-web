import { useStudents, viewedStudent } from "../students";
import { Icon } from "./Icon";

/** Shown to the admin over a student's progress. Names the student once there is more than one. */
export function ReadOnlyBanner() {
  const list = useStudents(true);
  const student = viewedStudent(list);
  const whose = list !== null && list.students.length > 1 && student !== null ? `${student.email}'s progress` : "Her progress";
  return (
    <p className="readonly-banner">
      <Icon name="eye" size={16} />
      <span>{whose}, read-only. Answers, scores, and Review cannot be changed here.</span>
    </p>
  );
}

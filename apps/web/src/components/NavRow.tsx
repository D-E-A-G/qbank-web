import type { ReactNode } from "react";
import type { FolderProgress } from "../course/folders";
import { stateLabel } from "../course/folders";
import { ShellLink } from "../shell/ShellLink";
import { Icon, type IconName } from "./Icon";

/**
 * A row of an inset list that opens a screen, as in the iPhone's Files app: an icon, the name and
 * its line, how far she is (a word at the right edge), and a chevron.
 */
export function NavRow({
  to,
  icon,
  title,
  strong = false,
  tag = null,
  meta,
  progress,
}: {
  to: string;
  icon: IconName;
  title: string;
  /** Pages are set in semibold; folders in regular, as in Files. */
  strong?: boolean;
  /** A small tag beside the name: a page's badge ("Exam"), or null for none. */
  tag?: string | null;
  meta: string;
  progress: FolderProgress;
}) {
  return (
    <ShellLink to={to} className="list-row" current={false}>
      <RowBody icon={icon} title={title} strong={strong} tag={tag} meta={meta} />
      <span className={`folder-state folder-state-${progress.state}`}>{stateLabel(progress)}</span>
      <span className="list-chevron">
        <Icon name="chevron-right" size={18} strokeWidth={2} />
      </span>
    </ShellLink>
  );
}

/** The icon and the copy of a row, shared by a row that opens a screen and one being reordered. */
export function RowBody({
  icon,
  title,
  strong = false,
  tag = null,
  meta,
}: {
  icon: IconName;
  title: string;
  strong?: boolean;
  tag?: string | null;
  meta: ReactNode;
}) {
  return (
    <>
      <span className="list-icon">
        <Icon name={icon} size={22} />
      </span>
      <span className="list-copy">
        {tag === null ? (
          <span className={strong ? "list-title list-title-strong" : "list-title"}>{title}</span>
        ) : (
          <span className="list-title-line">
            <span className={strong ? "list-title list-title-strong" : "list-title"}>{title}</span>
            <span className="list-tag">{tag}</span>
          </span>
        )}
        <span className="list-meta">{meta}</span>
      </span>
    </>
  );
}

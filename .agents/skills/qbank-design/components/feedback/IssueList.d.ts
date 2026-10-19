import * as React from 'react';
export interface IssueListProps {
  kind?: 'error' | 'warning';
  /** already-worded messages, e.g. "Question 4 (X04): missing takeaway" */
  items: string[];
  onCopy?: () => void;
  copied?: boolean;
}
export declare function IssueList(props: IssueListProps): JSX.Element;

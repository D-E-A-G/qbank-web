import * as React from 'react';
export interface CourseCardProps {
  /** e.g. "NURS 101" */
  code: string;
  title: string;
  questions: number;
  weeks: number;
  toReview?: number;
  /** 0–1 share of questions answered at least once */
  progress?: number;
  archived?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function CourseCard(props: CourseCardProps): JSX.Element;

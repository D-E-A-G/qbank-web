import * as React from 'react';
export interface StatusMarkProps {
  status: 'correct' | 'partial' | 'wrong' | 'guessed' | 'unanswered';
  /** override word; defaults: Correct / Partly right / Missed / Guessed / Not answered */
  label?: string;
  showLabel?: boolean;
  variant?: 'plain' | 'pill';
  size?: 'sm' | 'md';
}
export declare function StatusMark(props: StatusMarkProps): JSX.Element;

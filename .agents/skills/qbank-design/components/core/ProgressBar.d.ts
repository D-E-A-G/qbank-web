import * as React from 'react';
export interface ProgressBarProps {
  /** 0–1 */
  value: number;
  tone?: 'tint' | 'correct' | 'partial' | 'wrong' | 'neutral';
  height?: number;
  label?: string;
  style?: React.CSSProperties;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;

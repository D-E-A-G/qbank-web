import * as React from 'react';
export interface PassageSegment { t: string; ok?: boolean; /** non-selectable connective text */ plain?: boolean }
export interface HighlightPassageProps {
  segments: PassageSegment[];
  /** selected segment indexes */
  selected?: number[];
  onToggle?: (index: number) => void;
  revealed?: boolean;
  size?: 'md' | 'lg';
}
export declare function HighlightPassage(props: HighlightPassageProps): JSX.Element;

import * as React from 'react';
export interface ClozeBlankDef { opts: string[]; ans: number }
export interface ClozeBlankProps {
  /** text with {0}, {1}… placeholders */
  template: string;
  blanks: ClozeBlankDef[];
  value?: Record<number, number>;
  onChange?: (value: Record<number, number>) => void;
  revealed?: boolean;
  size?: 'md' | 'lg';
}
export declare function ClozeBlank(props: ClozeBlankProps): JSX.Element;

import * as React from 'react';
export interface MatchRowProps {
  left: React.ReactNode;
  options: string[];
  /** index into options; null/-1 = none */
  value?: number | null;
  onChange?: (index: number) => void;
  state?: 'idle' | 'correct' | 'wrong';
  correctText?: string;
}
export declare function MatchRow(props: MatchRowProps): JSX.Element;
export interface PickerSelectProps {
  options: string[];
  value?: number | null;
  onChange?: (index: number) => void;
  placeholder?: string;
  state?: 'idle' | 'correct' | 'wrong';
  inline?: boolean;
  disabled?: boolean;
}
/** Native select styled as a picker button (iOS shows its wheel/menu). */
export declare function PickerSelect(props: PickerSelectProps): JSX.Element;

import * as React from 'react';
export interface AnswerOptionProps {
  text: React.ReactNode;
  /** radio for single/priority, checkbox for select-all */
  control?: 'radio' | 'checkbox';
  /** before check: idle | selected. After check: correct (picked, right) · wrong (picked, wrong) · missed (right, not picked) · dim (neither) */
  state?: 'idle' | 'selected' | 'correct' | 'wrong' | 'missed' | 'dim';
  /** per-option reason, shown after check */
  reason?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
export declare function AnswerOption(props: AnswerOptionProps): JSX.Element;

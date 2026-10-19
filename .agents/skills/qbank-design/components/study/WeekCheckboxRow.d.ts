import * as React from 'react';
export interface WeekCheckboxRowProps {
  label: string;
  count: number;
  /** questions this week contributes to the exam draw (shown when checked) */
  drawn?: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}
export declare function WeekCheckboxRow(props: WeekCheckboxRowProps): JSX.Element;

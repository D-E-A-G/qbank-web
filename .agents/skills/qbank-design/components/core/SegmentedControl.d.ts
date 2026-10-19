import * as React from 'react';
export interface SegmentOption { value: string; label: string; icon?: string }
export interface SegmentedControlProps {
  options: (SegmentOption | string)[];
  value: string;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;

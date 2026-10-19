import * as React from 'react';
export interface TextFieldProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  /** textarea (e.g. paste JSON on Import) */
  multiline?: boolean;
  rows?: number;
  /** monospace text (JSON) */
  mono?: boolean;
  hint?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (value: string, e: React.ChangeEvent) => void;
  style?: React.CSSProperties;
}
export declare function TextField(props: TextFieldProps): JSX.Element;

import * as React from 'react';
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: React.ReactNode;
  detail?: React.ReactNode;
  /** guess = plum; used for "I'm guessing (flag for review)" */
  tone?: 'tint' | 'guess';
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
export interface CheckboxBoxProps { checked?: boolean; shape?: 'square' | 'circle'; tone?: 'tint' | 'guess'; size?: number }
/** The bare 22px box/radio glyph used inside other rows. */
export declare function CheckboxBox(props: CheckboxBoxProps): JSX.Element;

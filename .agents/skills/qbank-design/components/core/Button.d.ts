import * as React from 'react';
export interface ButtonProps {
  /** primary = filled tint (one per screen) · secondary = tint-soft · quiet = neutral fill · plain = text only · destructive = red soft */
  variant?: 'primary' | 'secondary' | 'quiet' | 'plain' | 'destructive';
  /** lg 50px (runner CTAs, sheets) · md 44px · sm 32px (inline row actions) */
  size?: 'lg' | 'md' | 'sm';
  icon?: string;
  iconRight?: string;
  iconOnly?: boolean;
  /** required when iconOnly */
  label?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;

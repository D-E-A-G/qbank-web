import * as React from 'react';
export type IconName = string;
export interface IconProps {
  /** Lucide glyph name copied into this system (see ICON_NAMES / assets/icons). e.g. "house", "flag", "circle-check" */
  name: IconName;
  /** px; 20 default. Use 16 in captions, 22–24 in tabs/tiles. */
  size?: number;
  /** 1.75 default; 2 for small sizes and state icons */
  strokeWidth?: number;
  color?: string;
  /** Accessible label; omit for decorative icons */
  label?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element | null;
export declare const ICON_NAMES: string[];

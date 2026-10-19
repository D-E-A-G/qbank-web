import * as React from 'react';
export interface TileProps {
  icon: string;
  value?: React.ReactNode;
  label: string;
  detail?: string;
  /** filled tint (use for the Exam tile) */
  emphasis?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Tile(props: TileProps): JSX.Element;

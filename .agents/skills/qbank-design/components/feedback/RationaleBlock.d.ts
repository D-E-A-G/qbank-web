import * as React from 'react';
export interface RationaleBlockProps {
  variant?: 'rationale' | 'takeaway';
  title?: string;
  children: React.ReactNode;
}
export declare function RationaleBlock(props: RationaleBlockProps): JSX.Element;

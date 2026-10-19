import * as React from 'react';
export interface NavBarProps {
  title?: string;
  /** iOS large title row */
  large?: boolean;
  subtitle?: string;
  backLabel?: string;
  onBack?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  sticky?: boolean;
}
export declare function NavBar(props: NavBarProps): JSX.Element;

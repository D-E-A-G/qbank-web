import * as React from 'react';
export interface ListGroupProps {
  /** small uppercase header above the group */
  header?: React.ReactNode;
  /** footnote below */
  footer?: React.ReactNode;
  inset?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function ListGroup(props: ListGroupProps): JSX.Element;
export interface ListRowProps {
  icon?: string;
  title: React.ReactNode;
  detail?: React.ReactNode;
  value?: React.ReactNode;
  chevron?: boolean;
  destructive?: boolean;
  selected?: boolean;
  accessory?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}
export declare function ListRow(props: ListRowProps): JSX.Element;

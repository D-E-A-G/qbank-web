import * as React from 'react';
export interface TabItem { id: string; label: string; icon: string }
export interface TabBarProps {
  items: TabItem[];
  active: string;
  onChange?: (id: string) => void;
  /** absolute inside a device frame instead of fixed */
  contained?: boolean;
}
export declare function TabBar(props: TabBarProps): JSX.Element;

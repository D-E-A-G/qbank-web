import * as React from 'react';
export interface SidebarNavItem { id: string; label: string; icon: string; badge?: number }
export interface SidebarCourse { id: string; code: string; title: string; toReview?: number }
export interface SidebarSemester { id: string; label: string; courses: SidebarCourse[] }
export interface SidebarProps {
  title?: string;
  nav?: SidebarNavItem[];
  semesters?: SidebarSemester[];
  /** id of the active nav item or course */
  active?: string;
  onSelect?: (id: string) => void;
  footer?: React.ReactNode;
  width?: number | string;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;

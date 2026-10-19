import * as React from 'react';
export interface SetRowProps {
  title: string;
  status: 'done' | 'progress' | 'new' | 'imported' | 'replaced';
  /** "Done Sep 24 · 13 of 17 fully right" / "7 of 12 answered"; defaults exist for new/imported/replaced */
  detail?: string;
  count?: number;
  onClick?: () => void;
  /** shown only for status="replaced" */
  onRestore?: () => void;
  readOnly?: boolean;
}
export declare function SetRow(props: SetRowProps): JSX.Element;

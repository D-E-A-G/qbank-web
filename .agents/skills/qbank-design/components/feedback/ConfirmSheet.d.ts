import * as React from 'react';
export interface SheetAction { label: string; variant?: 'primary' | 'secondary' | 'quiet' | 'plain' | 'destructive'; onClick?: () => void }
export interface ConfirmSheetProps {
  open?: boolean;
  title: string;
  message?: React.ReactNode;
  /** top to bottom; put Cancel last */
  actions: SheetAction[];
  /** centered dialog (iPad/Mac) instead of bottom sheet */
  centered?: boolean;
  /** position absolute inside a frame instead of fixed to viewport */
  contained?: boolean;
  onDismiss?: () => void;
}
export declare function ConfirmSheet(props: ConfirmSheetProps): JSX.Element | null;

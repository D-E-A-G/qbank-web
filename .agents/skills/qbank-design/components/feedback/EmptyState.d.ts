import * as React from 'react';
export interface EmptyStateProps {
  icon?: string;
  title?: string;
  message?: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
  compact?: boolean;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;

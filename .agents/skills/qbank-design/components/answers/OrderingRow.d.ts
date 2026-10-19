import * as React from 'react';
export interface OrderingRowProps {
  position: number;
  text: React.ReactNode;
  state?: 'idle' | 'correct' | 'wrong';
  /** shown when wrong: "Belongs at N" */
  correctPosition?: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  dragging?: boolean;
}
export declare function OrderingRow(props: OrderingRowProps): JSX.Element;

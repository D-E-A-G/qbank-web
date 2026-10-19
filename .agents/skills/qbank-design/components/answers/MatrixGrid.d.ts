import * as React from 'react';
export interface MatrixRow { label: string; /** correct column index */ ans: number }
export interface MatrixGridProps {
  columns: string[];
  rows: MatrixRow[];
  /** { [rowIndex]: columnIndex } */
  value?: Record<number, number>;
  onChange?: (value: Record<number, number>) => void;
  revealed?: boolean;
  /** stacked = row cards with pill choices (iPhone); table = grid (iPad/Mac) */
  layout?: 'stacked' | 'table';
}
export declare function MatrixGrid(props: MatrixGridProps): JSX.Element;

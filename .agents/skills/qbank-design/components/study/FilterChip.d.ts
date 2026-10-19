import * as React from 'react';
export interface FilterChipProps {
  label: string;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
}
export declare function FilterChip(props: FilterChipProps): JSX.Element;

import * as React from 'react';
export interface TermDefinitionProps {
  term: string;
  meaning: string;
  /** e.g. "From Week 4 · Set 1" */
  source?: string;
  divider?: boolean;
}
export declare function TermDefinition(props: TermDefinitionProps): JSX.Element;

import * as React from 'react';
export interface FeedbackBannerProps {
  status: 'correct' | 'partial' | 'wrong';
  points?: number;
  /** shows "N of M points" when > 1 */
  max?: number;
  /** scoring rule, e.g. "+1 for each correct choice, -1 for each wrong one" */
  rule?: string;
  guessed?: boolean;
}
export declare function FeedbackBanner(props: FeedbackBannerProps): JSX.Element;

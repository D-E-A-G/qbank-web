import * as React from 'react';
export interface CountdownTimerProps {
  seconds: number;
  /** seconds at which the low-time state starts; 300 default */
  lowAt?: number;
  compact?: boolean;
}
export declare function CountdownTimer(props: CountdownTimerProps): JSX.Element;

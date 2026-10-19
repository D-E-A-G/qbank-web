import React from 'react';
import { Icon } from '../core/Icon.jsx';

const fmt = (s) => { const m = Math.floor(Math.max(0, s) / 60); const r = Math.max(0, s) % 60; return `${m}:${String(r).padStart(2, '0')}`; };

// Low-time state: turns red, gains a filled background AND the word "left", so it doesn't rely on color.
export function CountdownTimer({ seconds, lowAt = 300, compact }) {
  const low = seconds <= lowAt;
  return (
    <span role="timer" aria-live={low ? 'polite' : 'off'} aria-label={`${fmt(seconds)} left`} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 10px 0 8px', borderRadius: 'var(--radius-pill)',
      background: low ? 'var(--timer-low-soft)' : 'var(--surface-sunken)', color: low ? 'var(--timer-low)' : 'var(--timer-normal)',
      boxShadow: low ? 'inset 0 0 0 1px var(--wrong-border)' : 'none',
      font: 'var(--weight-semibold) var(--size-subhead)/1 var(--font-ui)', fontVariantNumeric: 'tabular-nums', transition: 'background var(--dur-standard), color var(--dur-standard)',
    }}>
      <Icon name={low ? 'triangle-alert' : 'timer'} size={16} strokeWidth={2} />
      {fmt(seconds)}{(low || !compact) && <span style={{ fontWeight: 500 }}>left</span>}
    </span>
  );
}

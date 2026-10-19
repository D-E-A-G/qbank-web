import React from 'react';

const TONES = { tint: 'var(--progress-fill)', correct: 'var(--correct)', partial: 'var(--partial)', wrong: 'var(--wrong)', neutral: 'var(--text-3)' };

export function ProgressBar({ value = 0, tone = 'tint', height = 4, label, style }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label={label}
      style={{ height, borderRadius: 'var(--radius-pill)', background: 'var(--progress-track)', overflow: 'hidden', ...style }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 'var(--radius-pill)', background: TONES[tone] || TONES.tint, transition: 'width var(--dur-standard) var(--ease-out)' }}></div>
    </div>
  );
}

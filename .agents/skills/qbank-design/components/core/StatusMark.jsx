import React from 'react';
import { Icon } from './Icon.jsx';

const STATES = {
  correct:    { icon: 'circle-check', color: 'var(--correct)', soft: 'var(--correct-soft)', word: 'Correct' },
  partial:    { icon: 'circle-minus', color: 'var(--partial)', soft: 'var(--partial-soft)', word: 'Partly right' },
  wrong:      { icon: 'circle-x',     color: 'var(--wrong)',   soft: 'var(--wrong-soft)',   word: 'Missed' },
  guessed:    { icon: 'flag',         color: 'var(--guess)',   soft: 'var(--guess-soft)',   word: 'Guessed' },
  unanswered: { icon: 'circle',       color: 'var(--text-3)',  soft: 'var(--surface-sunken)', word: 'Not answered' },
};

// Icon + word: the non-color-dependent way to show an answer status anywhere.
export function StatusMark({ status = 'correct', label, showLabel = true, variant = 'plain', size = 'md' }) {
  const s = STATES[status] || STATES.correct;
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: sm ? 4 : 6, color: s.color, whiteSpace: 'nowrap',
      padding: variant === 'pill' ? (sm ? '2px 8px 2px 6px' : '4px 10px 4px 8px') : 0,
      background: variant === 'pill' ? s.soft : 'transparent', borderRadius: 'var(--radius-pill)',
      font: `var(--weight-semibold) ${sm ? 'var(--size-caption-1)/var(--lh-caption-1)' : 'var(--size-footnote)/var(--lh-footnote)'} var(--font-ui)`,
    }}>
      <Icon name={s.icon} size={sm ? 14 : 16} strokeWidth={2} />
      {showLabel && (label || s.word)}
    </span>
  );
}

import React from 'react';
import { Icon } from '../core/Icon.jsx';

const KIND = {
  correct: { icon: 'circle-check', title: 'Correct',        fg: 'var(--correct)', bg: 'var(--correct-soft)', border: 'var(--correct-border)' },
  partial: { icon: 'circle-minus', title: 'Partly correct', fg: 'var(--partial)', bg: 'var(--partial-soft)', border: 'var(--partial-border)' },
  wrong:   { icon: 'circle-x',     title: 'Not correct',    fg: 'var(--wrong)',   bg: 'var(--wrong-soft)',   border: 'var(--wrong-border)' },
};

export function FeedbackBanner({ status = 'correct', points, max, rule, guessed }) {
  const k = KIND[status] || KIND.correct;
  return (
    <div role="status" style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 'var(--radius-md)', background: k.bg, boxShadow: `inset 0 0 0 1px ${k.border}` }}>
      <Icon name={k.icon} size={26} color={k.fg} strokeWidth={2} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ font: 'var(--weight-bold) var(--size-title-3)/var(--lh-title-3) var(--font-display)', color: k.fg }}>{k.title}</span>
          {max > 1 && <span style={{ flexShrink: 0, whiteSpace: 'nowrap', font: 'var(--weight-semibold) var(--size-subhead)/var(--lh-subhead) var(--font-ui)', color: 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>{points} of {max} points</span>}
        </div>
        {rule && <span style={{ font: 'var(--text-footnote)', color: 'var(--text-2)', textWrap: 'pretty' }}>{rule}</span>}
        {guessed && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--guess)' }}><Icon name="flag" size={14} strokeWidth={2} />Flagged as a guess — it stays in Review</span>}
      </div>
    </div>
  );
}

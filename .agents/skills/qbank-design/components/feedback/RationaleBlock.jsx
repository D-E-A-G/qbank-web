import React from 'react';
import { Icon } from '../core/Icon.jsx';

// variant: rationale (why) | takeaway (the one thing to remember)
export function RationaleBlock({ variant = 'rationale', title, children }) {
  const take = variant === 'takeaway';
  return (
    <section style={{
      display: 'flex', flexDirection: 'column', gap: 8, padding: take ? '14px 16px' : 0,
      borderRadius: take ? 'var(--radius-md)' : 0, background: take ? 'var(--tint-soft)' : 'transparent',
    }}>
      <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: take ? 'var(--tint)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>
        {take && <Icon name="book-marked" size={15} strokeWidth={2} />}
        {title || (take ? 'Key takeaway' : 'Rationale')}
      </h4>
      <div style={{ font: take ? 'var(--weight-semibold) var(--size-reading)/var(--lh-reading) var(--font-reading)' : 'var(--text-reading)', color: 'var(--text-1)', textWrap: 'pretty' }}>{children}</div>
    </section>
  );
}

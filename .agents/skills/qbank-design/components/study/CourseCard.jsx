import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { ProgressBar } from '../core/ProgressBar.jsx';
import { usePress } from '../core/press.js';

export function CourseCard({ code, title, questions, weeks, toReview = 0, progress = 0, archived, onClick, style }) {
  const [pressed, ph] = usePress(!onClick);
  const pct = Math.round(progress * 100);
  return (
    <button onClick={onClick} {...ph} style={{
      display: 'flex', flexDirection: 'column', gap: 12, width: '100%', padding: 16, boxSizing: 'border-box', textAlign: 'left',
      border: 'none', borderRadius: 'var(--radius-md)', cursor: onClick ? 'pointer' : 'default',
      background: pressed ? 'var(--surface-pressed)' : 'var(--surface)', color: 'var(--text-1)',
      boxShadow: 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)', opacity: archived ? 0.6 : 1,
      transition: 'background var(--dur-instant)', ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--tint)', letterSpacing: '0.02em' }}>{code}</span>
          <span style={{ font: 'var(--text-headline)', textWrap: 'pretty' }}>{title}</span>
        </div>
        <Icon name="chevron-right" size={18} color="var(--text-4)" strokeWidth={2} style={{ marginTop: 10 }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 12px', font: 'var(--text-footnote)', color: 'var(--text-2)' }}>
        <span>{questions} questions</span>
        <span>{weeks} {weeks === 1 ? 'week' : 'weeks'}</span>
        {toReview > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-1)', fontWeight: 600, whiteSpace: 'nowrap' }}><Icon name="inbox" size={14} strokeWidth={2} />{toReview} to review</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ProgressBar value={progress} style={{ flex: 1 }} label={`${pct}% answered`} />
        <span style={{ font: 'var(--weight-medium) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)', color: 'var(--text-3)', fontVariantNumeric: 'tabular-nums', minWidth: 32, textAlign: 'right' }}>{pct}%</span>
      </div>
    </button>
  );
}

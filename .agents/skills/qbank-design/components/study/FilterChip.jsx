import React from 'react';

export function FilterChip({ label, count, selected, onClick }) {
  return (
    <button onClick={onClick} aria-pressed={!!selected} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', flexShrink: 0,
      borderRadius: 'var(--radius-pill)', cursor: 'pointer',
      border: selected ? '1px solid var(--text-1)' : '1px solid var(--separator-strong)',
      background: selected ? 'var(--text-1)' : 'var(--surface)', color: selected ? 'var(--bg)' : 'var(--text-1)',
      font: 'var(--weight-medium) var(--size-subhead)/var(--lh-subhead) var(--font-ui)', transition: 'background var(--dur-quick), color var(--dur-quick)',
    }}>
      {label}
      {count != null && <span style={{ fontVariantNumeric: 'tabular-nums', opacity: selected ? 0.75 : 1, color: selected ? 'inherit' : 'var(--text-3)' }}>{count}</span>}
    </button>
  );
}

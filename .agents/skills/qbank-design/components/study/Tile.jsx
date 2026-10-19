import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { usePress } from '../core/press.js';

// Course-level entry tile: Exam / N to review / N terms.
export function Tile({ icon, value, label, detail, onClick, emphasis, style }) {
  const [pressed, ph] = usePress(!onClick);
  return (
    <button onClick={onClick} {...ph} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 0, minHeight: 96,
      padding: 14, boxSizing: 'border-box', textAlign: 'left', border: 'none', borderRadius: 'var(--radius-md)', cursor: onClick ? 'pointer' : 'default',
      background: emphasis ? (pressed ? 'var(--tint-pressed)' : 'var(--tint)') : (pressed ? 'var(--surface-pressed)' : 'var(--surface)'),
      color: emphasis ? 'var(--text-on-tint)' : 'var(--text-1)',
      boxShadow: emphasis ? 'none' : 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)', transition: 'background var(--dur-instant)', ...style,
    }}>
      <Icon name={icon} size={22} color={emphasis ? 'currentColor' : 'var(--tint)'} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {value != null && <span style={{ font: 'var(--weight-bold) var(--size-title-2)/var(--lh-title-2) var(--font-display)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>}
        <span style={{ font: value != null ? 'var(--text-footnote)' : 'var(--text-headline)', color: emphasis ? 'currentColor' : value != null ? 'var(--text-2)' : 'var(--text-1)' }}>{label}</span>
        {detail && <span style={{ font: 'var(--text-caption)', opacity: 0.8, marginTop: 2 }}>{detail}</span>}
      </span>
    </button>
  );
}

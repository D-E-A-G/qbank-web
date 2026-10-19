import React from 'react';
import { Icon } from './Icon.jsx';

// Standalone check glyph box; also used inside WeekCheckboxRow and AnswerOption.
export function CheckboxBox({ checked, shape = 'square', tone = 'tint', size = 22 }) {
  const color = tone === 'guess' ? 'var(--guess)' : 'var(--tint)';
  const round = shape === 'circle';
  return (
    <span aria-hidden="true" style={{
      width: size, height: size, flexShrink: 0, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: round ? '50%' : 'var(--radius-xs)', border: checked ? 'none' : '1.5px solid var(--separator-strong)',
      background: checked ? color : 'var(--surface-raised)', color: 'var(--text-on-tint)', transition: 'background var(--dur-quick)',
    }}>
      {checked && (round ? <span style={{ width: size * 0.4, height: size * 0.4, borderRadius: '50%', background: 'var(--text-on-tint)' }}></span> : <Icon name="check" size={size * 0.72} strokeWidth={3} />)}
    </span>
  );
}

export function Checkbox({ checked, onChange, label, detail, tone = 'tint', disabled, style }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minHeight: 44, padding: '11px 0', boxSizing: 'border-box', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1, ...style }}>
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={(e) => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <CheckboxBox checked={checked} tone={tone} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1 }}>
        <span style={{ font: 'var(--text-body)', color: 'var(--text-1)' }}>{label}</span>
        {detail && <span style={{ font: 'var(--text-footnote)', color: 'var(--text-3)' }}>{detail}</span>}
      </span>
    </label>
  );
}

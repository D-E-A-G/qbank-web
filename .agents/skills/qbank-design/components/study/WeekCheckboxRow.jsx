import React from 'react';
import { CheckboxBox } from '../core/Checkbox.jsx';

// Exam setup row: tick a week; shows its size and, when ticked, how many the draw takes.
export function WeekCheckboxRow({ label, count, drawn, checked, onChange, disabled }) {
  return (
    <button onClick={() => !disabled && onChange && onChange(!checked)} aria-pressed={!!checked} style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 52, padding: '10px 16px', boxSizing: 'border-box',
      border: 'none', background: 'transparent', textAlign: 'left', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1,
    }}>
      <CheckboxBox checked={checked} />
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ font: 'var(--text-body)', color: 'var(--text-1)' }}>{label}</span>
        <span style={{ font: 'var(--text-footnote)', color: 'var(--text-3)' }}>{count} questions</span>
      </span>
      {checked && drawn != null && (
        <span style={{ whiteSpace: 'nowrap', font: 'var(--weight-semibold) var(--size-subhead)/var(--lh-subhead) var(--font-ui)', color: 'var(--tint)', fontVariantNumeric: 'tabular-nums' }}>{drawn} in exam</span>
      )}
    </button>
  );
}

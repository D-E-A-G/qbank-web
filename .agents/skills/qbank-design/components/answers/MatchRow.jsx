import React from 'react';
import { Icon } from '../core/Icon.jsx';

// Shared native picker button — native <select> gives the iOS wheel/menu for free.
export function PickerSelect({ options, value, onChange, placeholder = 'Choose', state = 'idle', inline, disabled }) {
  const c = state === 'correct' ? 'var(--correct)' : state === 'wrong' ? 'var(--wrong)' : value != null && value !== -1 ? 'var(--tint)' : 'var(--separator-strong)';
  const bg = state === 'correct' ? 'var(--correct-soft)' : state === 'wrong' ? 'var(--wrong-soft)' : value != null && value !== -1 ? 'var(--tint-soft)' : 'var(--surface-raised)';
  const revealed = state === 'correct' || state === 'wrong';
  return (
    <span style={{ position: 'relative', display: inline ? 'inline-flex' : 'flex', alignItems: 'center', verticalAlign: 'baseline', maxWidth: '100%' }}>
      <select value={value == null ? -1 : value} disabled={disabled || revealed} onChange={(e) => onChange && onChange(Number(e.target.value))}
        style={{
          appearance: 'none', WebkitAppearance: 'none', width: inline ? 'auto' : '100%', maxWidth: '100%', minHeight: inline ? 34 : 44,
          padding: inline ? '4px 30px 4px 10px' : '0 36px 0 14px', boxSizing: 'border-box', borderRadius: 8, cursor: revealed ? 'default' : 'pointer',
          border: 'none', boxShadow: `inset 0 0 0 1.5px ${c}`, background: bg, color: value == null || value === -1 ? 'var(--text-3)' : 'var(--text-1)',
          font: inline ? 'var(--weight-medium) var(--size-callout)/var(--lh-callout) var(--font-ui)' : 'var(--text-body)', opacity: 1,
        }}>
        <option value={-1} disabled>{placeholder}</option>
        {options.map((o, i) => <option key={i} value={i}>{o}</option>)}
      </select>
      <span style={{ position: 'absolute', right: inline ? 8 : 12, pointerEvents: 'none', display: 'flex', color: state === 'idle' ? 'var(--text-3)' : c }}>
        <Icon name={state === 'correct' ? 'circle-check' : state === 'wrong' ? 'circle-x' : 'chevron-down'} size={16} strokeWidth={2} />
      </span>
    </span>
  );
}

// Matching: pair a left item with a right choice.
export function MatchRow({ left, options, value, onChange, state = 'idle', correctText }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, borderRadius: 'var(--radius-sm)', background: 'var(--surface)', boxShadow: 'inset 0 0 0 1px var(--separator)' }}>
      <span style={{ font: 'var(--text-headline)', color: 'var(--text-1)', textWrap: 'pretty' }}>{left}</span>
      <PickerSelect options={options} value={value} onChange={onChange} state={state} placeholder="Choose a match" />
      {state === 'wrong' && correctText && <span style={{ font: 'var(--text-footnote)', color: 'var(--text-2)' }}><span style={{ color: 'var(--correct)', fontWeight: 600 }}>Correct match:</span> {correctText}</span>}
    </div>
  );
}

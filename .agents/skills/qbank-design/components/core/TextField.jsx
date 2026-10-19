import React from 'react';

export function TextField({ label, value, defaultValue, placeholder, type = 'text', multiline, rows = 6, mono, hint, error, disabled, onChange, style }) {
  const [focus, setFocus] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  const border = error ? 'var(--wrong)' : focus ? 'var(--tint)' : 'var(--separator-strong)';
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <span style={{ font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--text-2)' }}>{label}</span>}
      <Tag type={multiline ? undefined : type} value={value} defaultValue={defaultValue} placeholder={placeholder} rows={multiline ? rows : undefined} disabled={disabled}
        onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          boxSizing: 'border-box', width: '100%', minHeight: 44, padding: multiline ? '12px 14px' : '0 14px',
          height: multiline ? undefined : 44, resize: multiline ? 'vertical' : undefined,
          background: 'var(--surface-raised)', color: 'var(--text-1)', borderRadius: 'var(--radius-sm)',
          border: `1px solid ${border}`, boxShadow: focus ? '0 0 0 3px var(--tint-soft-border)' : 'none', outline: 'none',
          font: mono ? 'var(--text-mono)' : 'var(--text-body)', transition: 'border-color var(--dur-quick), box-shadow var(--dur-quick)',
          opacity: disabled ? 0.5 : 1,
        }} />
      {(error || hint) && <span style={{ font: 'var(--text-footnote)', color: error ? 'var(--wrong)' : 'var(--text-3)' }}>{error || hint}</span>}
    </label>
  );
}

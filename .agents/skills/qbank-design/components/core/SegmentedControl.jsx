import React from 'react';
import { Icon } from './Icon.jsx';

export function SegmentedControl({ options, value, onChange, fullWidth = true, style }) {
  return (
    <div role="tablist" style={{ display: fullWidth ? 'flex' : 'inline-flex', padding: 2, gap: 2, borderRadius: 9, background: 'var(--surface-sunken)', boxShadow: 'inset 0 0 0 0.5px var(--separator)', ...style }}>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        const on = opt.value === value;
        return (
          <button key={opt.value} role="tab" aria-selected={on} onClick={() => onChange && onChange(opt.value)}
            style={{
              flex: fullWidth ? 1 : undefined, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              height: 32, padding: '0 14px', border: 'none', borderRadius: 7, cursor: 'pointer',
              background: on ? 'var(--surface-raised)' : 'transparent', color: on ? 'var(--text-1)' : 'var(--text-2)',
              boxShadow: on ? 'var(--shadow-raised)' : 'none',
              font: `${on ? 'var(--weight-semibold)' : 'var(--weight-medium)'} var(--size-subhead)/var(--lh-subhead) var(--font-ui)`,
              transition: 'background var(--dur-quick), color var(--dur-quick)',
            }}>
            {opt.icon && <Icon name={opt.icon} size={16} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

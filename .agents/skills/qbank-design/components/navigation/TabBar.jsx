import React from 'react';
import { Icon } from '../core/Icon.jsx';

// iPhone bottom tabs. Translucent material; add safe-area inset below.
export function TabBar({ items, active, onChange, contained }) {
  return (
    <nav style={{
      position: contained ? 'absolute' : 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20, display: 'flex',
      paddingBottom: contained ? 28 : 'env(safe-area-inset-bottom)', background: 'var(--material)',
      backdropFilter: 'var(--blur-material)', WebkitBackdropFilter: 'var(--blur-material)', borderTop: '0.5px solid var(--separator-strong)',
    }}>
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button key={it.id} onClick={() => onChange && onChange(it.id)} aria-current={on ? 'page' : undefined} style={{
            flex: 1, height: 'var(--tabbar-height)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
            border: 'none', background: 'transparent', cursor: 'pointer', color: on ? 'var(--tint)' : 'var(--text-3)',
          }}>
            <Icon name={it.icon} size={24} strokeWidth={on ? 2 : 1.75} />
            <span style={{ font: 'var(--weight-medium) 10px/12px var(--font-ui)' }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

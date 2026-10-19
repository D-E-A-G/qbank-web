import React from 'react';
import { Icon } from '../core/Icon.jsx';

// Top bar. `large` adds an iOS large title below the bar row.
export function NavBar({ title, large, backLabel, onBack, leading, trailing, subtitle, sticky = true }) {
  return (
    <header style={{ position: sticky ? 'sticky' : 'relative', top: 0, zIndex: 10, background: 'var(--material)', backdropFilter: 'var(--blur-material)', WebkitBackdropFilter: 'var(--blur-material)' }}>
      <div style={{ height: 'var(--navbar-height)', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          {onBack ? (
            <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 2, height: 44, padding: '0 8px 0 0', border: 'none', background: 'transparent', color: 'var(--tint)', cursor: 'pointer', font: 'var(--text-body)', minWidth: 0 }}>
              <Icon name="chevron-left" size={26} strokeWidth={2} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{backLabel || 'Back'}</span>
            </button>
          ) : leading}
        </div>
        <div style={{ textAlign: 'center', minWidth: 0 }}>
          {!large && title && <div style={{ font: 'var(--text-headline)', color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>}
          {!large && subtitle && <div style={{ font: 'var(--text-caption)', color: 'var(--text-3)' }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>{trailing}</div>
      </div>
      {large && (
        <div style={{ padding: '2px 16px 10px' }}>
          <h1 style={{ margin: 0, font: 'var(--text-large-title)', letterSpacing: 'var(--tracking-tight)', color: 'var(--text-1)', textWrap: 'balance' }}>{title}</h1>
          {subtitle && <div style={{ font: 'var(--text-subhead)', color: 'var(--text-2)', marginTop: 2 }}>{subtitle}</div>}
        </div>
      )}
    </header>
  );
}

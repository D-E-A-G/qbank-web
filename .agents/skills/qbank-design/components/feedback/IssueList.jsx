import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';

// Import-check results. kind: error (blocks import) | warning (imports anyway).
export function IssueList({ kind = 'error', items = [], onCopy, copied }) {
  const err = kind === 'error';
  const fg = err ? 'var(--wrong)' : 'var(--partial)';
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 'var(--radius-md)', background: err ? 'var(--wrong-soft)' : 'var(--partial-soft)', boxShadow: `inset 0 0 0 1px ${err ? 'var(--wrong-border)' : 'var(--partial-border)'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name={err ? 'circle-alert' : 'triangle-alert'} size={20} color={fg} strokeWidth={2} />
        <span style={{ flex: 1, font: 'var(--text-headline)', color: 'var(--text-1)' }}>
          {items.length} {err ? (items.length === 1 ? 'error' : 'errors') : (items.length === 1 ? 'warning' : 'warnings')}
          <span style={{ fontWeight: 400, color: 'var(--text-2)' }}>{err ? ' — fix these and check again' : ' — these import anyway'}</span>
        </span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((t, i) => (
          <li key={i} style={{ display: 'flex', gap: 8, font: 'var(--text-mono)', color: 'var(--text-1)', wordBreak: 'break-word' }}>
            <span style={{ color: fg }}>•</span><span>{t}</span>
          </li>
        ))}
      </ul>
      {err && onCopy && <Button variant="quiet" size="sm" icon={copied ? 'check' : 'copy'} onClick={onCopy} style={{ alignSelf: 'flex-start', background: 'var(--surface-raised)' }}>{copied ? 'Copied' : 'Copy these for Codex'}</Button>}
    </section>
  );
}

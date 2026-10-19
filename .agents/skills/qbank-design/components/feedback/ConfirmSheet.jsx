import React from 'react';
import { Button } from '../core/Button.jsx';

// Bottom sheet on iPhone; centered dialog when `centered` (iPad/Mac). The last action is the safe one (Cancel).
export function ConfirmSheet({ open = true, title, message, actions = [], centered, contained, onDismiss }) {
  if (!open) return null;
  return (
    <div onClick={onDismiss} style={{ position: contained ? 'absolute' : 'fixed', inset: 0, zIndex: 50, background: 'var(--overlay)', display: 'flex', alignItems: centered ? 'center' : 'flex-end', justifyContent: 'center', padding: centered ? 24 : 0 }}>
      <div role="alertdialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: centered ? 400 : 'none', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20,
        padding: centered ? 24 : '12px 20px calc(20px + env(safe-area-inset-bottom))',
        background: 'var(--surface-raised)', borderRadius: centered ? 'var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) 0 0',
        boxShadow: centered ? 'var(--shadow-popover)' : 'var(--shadow-sheet)',
      }}>
        {!centered && <span style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 3, background: 'var(--separator-strong)' }}></span>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, font: 'var(--text-title-3)', color: 'var(--text-1)', textWrap: 'pretty' }}>{title}</h2>
          {message && <p style={{ margin: 0, font: 'var(--text-callout)', color: 'var(--text-2)', textWrap: 'pretty' }}>{message}</p>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {actions.map((a, i) => <Button key={i} size="lg" fullWidth variant={a.variant || 'quiet'} onClick={a.onClick}>{a.label}</Button>)}
        </div>
      </div>
    </div>
  );
}

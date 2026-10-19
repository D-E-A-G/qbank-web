import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';

export function EmptyState({ icon = 'inbox', title, message, actionLabel, actionIcon, onAction, compact }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: compact ? 8 : 12, padding: compact ? '20px 16px' : '40px 24px' }}>
      <span style={{ width: compact ? 40 : 56, height: compact ? 40 : 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-sunken)', color: 'var(--text-3)' }}>
        <Icon name={icon} size={compact ? 20 : 26} />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 320 }}>
        {title && <span style={{ font: 'var(--text-headline)', color: 'var(--text-1)' }}>{title}</span>}
        {message && <span style={{ font: 'var(--text-subhead)', color: 'var(--text-2)', textWrap: 'pretty' }}>{message}</span>}
      </div>
      {actionLabel && <Button variant="secondary" size="md" icon={actionIcon} onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}

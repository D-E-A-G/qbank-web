import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';
import { usePress } from '../core/press.js';

// status: done | progress | new | imported | replaced
const STATUS = {
  done:     { icon: 'circle-check', color: 'var(--correct)' },
  progress: { icon: 'clock',        color: 'var(--tint)' },
  new:      { icon: 'circle',       color: 'var(--text-4)' },
  imported: { icon: 'download',     color: 'var(--tint)' },
  replaced: { icon: 'rotate-ccw',   color: 'var(--partial)' },
};

export function SetRow({ title, status = 'new', detail, count, onClick, onRestore, readOnly }) {
  const s = STATUS[status] || STATUS.new;
  const [pressed, ph] = usePress(!onClick);
  const text = detail || { new: 'Not started', imported: 'Imported today', replaced: 'Replaced today with a corrected file' }[status];
  return (
    <div role={onClick ? 'button' : undefined} onClick={onClick} {...ph} style={{
      display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, padding: '10px 16px', boxSizing: 'border-box',
      background: pressed ? 'var(--surface-pressed)' : 'transparent', cursor: onClick ? 'pointer' : 'default', transition: 'background var(--dur-instant)',
    }}>
      <Icon name={s.icon} size={20} color={s.color} strokeWidth={2} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: 'var(--text-body)', color: 'var(--text-1)', textWrap: 'pretty' }}>{title}</span>
        <span style={{ font: 'var(--text-footnote)', color: status === 'replaced' ? 'var(--partial)' : 'var(--text-3)' }}>
          {text}{count != null && status !== 'replaced' ? ` · ${count} questions` : ''}
        </span>
      </div>
      {status === 'replaced' && onRestore && !readOnly
        ? <Button variant="secondary" size="sm" icon="rotate-ccw" onClick={(e) => { e.stopPropagation(); onRestore(); }}>Restore</Button>
        : onClick && <Icon name="chevron-right" size={18} color="var(--text-4)" strokeWidth={2} />}
    </div>
  );
}

import React from 'react';
import { Icon } from '../core/Icon.jsx';

// One draggable/movable item in an Ordering question. Up/down buttons are the
// reliable path on touch; drag is a bonus on pointer devices.
export function OrderingRow({ position, text, state = 'idle', correctPosition, onMoveUp, onMoveDown, dragging }) {
  const revealed = state === 'correct' || state === 'wrong';
  const c = state === 'correct' ? 'var(--correct)' : state === 'wrong' ? 'var(--wrong)' : null;
  const arrowBtn = (name, fn, label) => (
    <button aria-label={label} onClick={fn} disabled={!fn} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 8, background: 'var(--surface-sunken)', color: fn ? 'var(--text-2)' : 'var(--text-4)', cursor: fn ? 'pointer' : 'default' }}>
      <Icon name={name} size={18} strokeWidth={2} />
    </button>
  );
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px 10px 12px', boxSizing: 'border-box', borderRadius: 'var(--radius-sm)',
      background: state === 'correct' ? 'var(--correct-soft)' : state === 'wrong' ? 'var(--wrong-soft)' : 'var(--surface-raised)',
      boxShadow: dragging ? 'var(--shadow-popover), inset 0 0 0 1.5px var(--tint)' : `inset 0 0 0 ${c ? 1.5 : 1}px ${c || 'var(--separator-strong)'}`,
      transform: dragging ? 'scale(1.02)' : 'none', transition: 'transform var(--dur-quick), box-shadow var(--dur-quick)',
    }}>
      {!revealed && <Icon name="grip-vertical" size={18} color="var(--text-4)" style={{ cursor: 'grab' }} />}
      <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: c || 'var(--surface-sunken)', color: c ? 'var(--text-on-tint)' : 'var(--text-2)', font: 'var(--weight-semibold) var(--size-footnote)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{position}</span>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: 'var(--text-body)', color: 'var(--text-1)', textWrap: 'pretty' }}>{text}</span>
        {state === 'wrong' && correctPosition != null && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: 'var(--weight-semibold) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)', color: 'var(--wrong)' }}><Icon name="circle-x" size={14} strokeWidth={2} />Belongs at {correctPosition}</span>}
        {state === 'correct' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: 'var(--weight-semibold) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)', color: 'var(--correct)' }}><Icon name="circle-check" size={14} strokeWidth={2} />Right position</span>}
      </div>
      {!revealed && <div style={{ display: 'flex', gap: 4 }}>{arrowBtn('chevron-up', onMoveUp, 'Move up')}{arrowBtn('chevron-down', onMoveDown, 'Move down')}</div>}
    </div>
  );
}

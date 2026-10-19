import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { CheckboxBox } from '../core/Checkbox.jsx';
import { usePress } from '../core/press.js';

// state: idle | selected | correct (picked, right) | wrong (picked, wrong) | missed (right, not picked) | dim (not picked, not right; after check)
const LOOK = {
  idle:     { bg: 'var(--surface)',        border: 'var(--separator-strong)', width: 1,   style: 'solid' },
  selected: { bg: 'var(--tint-soft)',      border: 'var(--tint)',             width: 1.5, style: 'solid' },
  correct:  { bg: 'var(--correct-soft)',   border: 'var(--correct)',          width: 1.5, style: 'solid', icon: 'circle-check', color: 'var(--correct)', tag: 'Your answer · Correct' },
  wrong:    { bg: 'var(--wrong-soft)',     border: 'var(--wrong)',            width: 1.5, style: 'solid', icon: 'circle-x', color: 'var(--wrong)', tag: 'Your answer · Not correct' },
  missed:   { bg: 'var(--surface)',        border: 'var(--correct)',          width: 1.5, style: 'dashed', icon: 'circle-check', color: 'var(--correct)', tag: 'Correct answer · Missed' },
  dim:      { bg: 'var(--surface)',        border: 'var(--separator)',        width: 1,   style: 'solid' },
};

export function AnswerOption({ text, control = 'radio', state = 'idle', reason, onClick, disabled }) {
  const l = LOOK[state] || LOOK.idle;
  const revealed = ['correct', 'wrong', 'missed', 'dim'].includes(state);
  const interactive = !revealed && !disabled && onClick;
  const [pressed, ph] = usePress(!interactive);
  const picked = state === 'selected' || state === 'correct' || state === 'wrong';
  return (
    <div role={interactive ? (control === 'radio' ? 'radio' : 'checkbox') : undefined} aria-checked={interactive ? picked : undefined} tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onClick : undefined} onKeyDown={interactive ? (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onClick(); } } : undefined} {...ph}
      style={{
        display: 'flex', gap: 12, padding: '14px 16px', boxSizing: 'border-box', borderRadius: 'var(--radius-sm)',
        background: pressed ? 'var(--surface-pressed)' : l.bg, boxShadow: `inset 0 0 0 ${l.width}px ${l.border}`,
        outline: l.style === 'dashed' ? `1.5px dashed ${l.border}` : 'none', outlineOffset: -1.5,
        cursor: interactive ? 'pointer' : 'default', transition: 'background var(--dur-quick), box-shadow var(--dur-quick)',
        ...(l.style === 'dashed' ? { boxShadow: 'none' } : null),
      }}>
      <span style={{ paddingTop: 1 }}>
        {l.icon ? <Icon name={l.icon} size={22} color={l.color} strokeWidth={2} />
          : <CheckboxBox checked={picked} shape={control === 'radio' ? 'circle' : 'square'} />}
      </span>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: 'var(--text-body)', color: state === 'dim' ? 'var(--text-2)' : 'var(--text-1)', textWrap: 'pretty' }}>{text}</span>
        {l.tag && <span style={{ font: 'var(--weight-semibold) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)', color: l.color, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>{l.tag}</span>}
        {revealed && reason && <span style={{ font: 'var(--text-reading-sm)', color: 'var(--text-2)', textWrap: 'pretty' }}>{reason}</span>}
      </div>
    </div>
  );
}

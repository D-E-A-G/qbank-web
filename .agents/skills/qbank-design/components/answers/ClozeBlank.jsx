import React from 'react';
import { PickerSelect } from './MatchRow.jsx';

// Drop-down cloze: a template with {0}, {1}… placeholders, each rendered as an inline picker.
export function ClozeBlank({ template, blanks, value = {}, onChange, revealed, size = 'md' }) {
  const parts = template.split(/(\{\d+\})/g);
  return (
    <p style={{ margin: 0, font: size === 'lg' ? 'var(--text-reading-lg)' : 'var(--text-reading)', color: 'var(--text-1)', lineHeight: size === 'lg' ? '44px' : '42px', textWrap: 'pretty' }}>
      {parts.map((p, i) => {
        const m = p.match(/^\{(\d+)\}$/);
        if (!m) return <span key={i}>{p}</span>;
        const b = Number(m[1]);
        const blank = blanks[b];
        const v = value[b];
        const state = !revealed ? 'idle' : v === blank.ans ? 'correct' : 'wrong';
        return (
          <span key={i} style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', margin: '0 2px' }}>
            <PickerSelect inline options={blank.opts} value={v} state={state} onChange={(n) => onChange && onChange({ ...value, [b]: n })} placeholder="Select" />
            {state === 'wrong' && <span style={{ font: 'var(--weight-semibold) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)', color: 'var(--correct)', padding: '2px 2px 0' }}>Correct: {blank.opts[blank.ans]}</span>}
          </span>
        );
      })}
    </p>
  );
}

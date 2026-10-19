import React from 'react';

// Tap passage segments to highlight them. After reveal: picked+right = highlight + green underline,
// picked+wrong = red strike-through underline, right-but-missed = dashed green underline.
export function HighlightPassage({ segments, selected = [], onToggle, revealed, size = 'md' }) {
  return (
    <p style={{ margin: 0, font: size === 'lg' ? 'var(--text-reading-lg)' : 'var(--text-reading)', color: 'var(--text-1)', textWrap: 'pretty' }}>
      {segments.map((seg, i) => {
        if (seg.plain) return <span key={i}>{seg.t}</span>;
        const picked = selected.includes(i);
        let st = picked ? 'picked' : 'idle';
        if (revealed) st = picked && seg.ok ? 'correct' : picked ? 'wrong' : seg.ok ? 'missed' : 'dim';
        const deco = {
          idle:   { bg: 'transparent', line: '1.5px dotted var(--separator-strong)' },
          picked: { bg: 'var(--highlight)', line: '1.5px solid transparent' },
          correct:{ bg: 'var(--highlight)', line: '2px solid var(--correct)' },
          wrong:  { bg: 'var(--wrong-soft)', line: '2px solid var(--wrong)', strike: true },
          missed: { bg: 'transparent', line: '2px dashed var(--correct)' },
          dim:    { bg: 'transparent', line: '1.5px solid transparent' },
        }[st];
        return (
          <span key={i} role={revealed ? undefined : 'button'} aria-pressed={revealed ? undefined : picked} tabIndex={revealed ? undefined : 0}
            onClick={() => !revealed && onToggle && onToggle(i)}
            onKeyDown={(e) => { if (!revealed && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); onToggle && onToggle(i); } }}
            style={{
              background: deco.bg, color: st === 'picked' || st === 'correct' ? 'var(--highlight-text)' : 'inherit', borderBottom: deco.line,
              textDecoration: deco.strike ? 'line-through' : 'none', textDecorationColor: 'var(--wrong)',
              borderRadius: 3, padding: '2px 1px', cursor: revealed ? 'default' : 'pointer', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
              transition: 'background var(--dur-quick)',
            }}>{seg.t}</span>
        );
      }).reduce((acc, el, i) => (i ? [...acc, ' ', el] : [el]), [])}
    </p>
  );
}

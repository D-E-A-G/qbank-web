import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { CheckboxBox } from '../core/Checkbox.jsx';

// Matrix: pick one column per row. layout "stacked" (iPhone) or "table" (iPad/Mac).
export function MatrixGrid({ columns, rows, value = {}, onChange, revealed, layout = 'stacked' }) {
  const cellState = (r, ci) => {
    const picked = value[r] === ci;
    if (!revealed) return picked ? 'selected' : 'idle';
    const ans = rows[r].ans;
    if (picked && ci === ans) return 'correct';
    if (picked) return 'wrong';
    if (ci === ans) return 'missed';
    return 'dim';
  };
  const mark = (st) => st === 'correct' ? <Icon name="circle-check" size={22} color="var(--correct)" strokeWidth={2} />
    : st === 'wrong' ? <Icon name="circle-x" size={22} color="var(--wrong)" strokeWidth={2} />
    : st === 'missed' ? <Icon name="circle-check" size={22} color="var(--correct)" strokeWidth={1.5} style={{ opacity: 0.7 }} />
    : <CheckboxBox checked={st === 'selected'} shape="circle" />;
  const pick = (r, ci) => !revealed && onChange && onChange({ ...value, [r]: ci });

  if (layout === 'table') {
    return (
      <div style={{ borderRadius: 'var(--radius-sm)', boxShadow: 'inset 0 0 0 1px var(--separator)', overflow: 'hidden', background: 'var(--surface)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <th style={{ textAlign: 'left', padding: '10px 14px', font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--text-3)', background: 'var(--surface-sunken)' }}></th>
            {columns.map((c, i) => <th key={i} style={{ padding: '10px 8px', font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--text-2)', background: 'var(--surface-sunken)', textAlign: 'center' }}>{c}</th>)}
          </tr></thead>
          <tbody>{rows.map((row, r) => (
            <tr key={r} style={{ borderTop: '0.5px solid var(--separator)' }}>
              <td style={{ padding: '12px 14px', font: 'var(--text-body)', color: 'var(--text-1)' }}>{row.label}</td>
              {columns.map((c, ci) => {
                const st = cellState(r, ci);
                return <td key={ci} onClick={() => pick(r, ci)} style={{ textAlign: 'center', cursor: revealed ? 'default' : 'pointer', background: st === 'correct' ? 'var(--correct-soft)' : st === 'wrong' ? 'var(--wrong-soft)' : 'transparent' }}>
                  <span style={{ display: 'inline-flex', minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }} aria-label={`${row.label}: ${c}`}>{mark(st)}</span>
                </td>;
              })}
            </tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((row, r) => (
        <div key={r} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14, borderRadius: 'var(--radius-sm)', background: 'var(--surface)', boxShadow: 'inset 0 0 0 1px var(--separator)' }}>
          <span style={{ font: 'var(--text-body)', color: 'var(--text-1)', textWrap: 'pretty' }}>{row.label}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {columns.map((c, ci) => {
              const st = cellState(r, ci);
              const border = st === 'selected' ? 'var(--tint)' : st === 'correct' || st === 'missed' ? 'var(--correct)' : st === 'wrong' ? 'var(--wrong)' : 'var(--separator-strong)';
              return (
                <button key={ci} onClick={() => pick(r, ci)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 12px 0 8px', border: 'none', borderRadius: 'var(--radius-pill)', cursor: revealed ? 'default' : 'pointer',
                  background: st === 'selected' ? 'var(--tint-soft)' : st === 'correct' ? 'var(--correct-soft)' : st === 'wrong' ? 'var(--wrong-soft)' : 'var(--surface-raised)',
                  boxShadow: `inset 0 0 0 ${st === 'idle' || st === 'dim' ? 1 : 1.5}px ${border}`, outline: st === 'missed' ? '1.5px dashed var(--correct)' : 'none', outlineOffset: -1.5,
                  color: st === 'dim' ? 'var(--text-3)' : 'var(--text-1)', font: 'var(--weight-medium) var(--size-subhead)/var(--lh-subhead) var(--font-ui)',
                }}>{mark(st)}{c}</button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

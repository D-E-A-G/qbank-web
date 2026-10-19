import React from 'react';

export function TermDefinition({ term, meaning, source, divider = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '12px 0', borderBottom: divider ? '0.5px solid var(--separator)' : 'none' }}>
      <span style={{ font: 'var(--weight-semibold) var(--size-reading-sm)/var(--lh-reading-sm) var(--font-reading)', color: 'var(--text-1)' }}>{term}</span>
      <span style={{ font: 'var(--text-reading-sm)', color: 'var(--text-2)', textWrap: 'pretty' }}>{meaning}</span>
      {source && <span style={{ font: 'var(--text-caption)', color: 'var(--text-3)', marginTop: 2 }}>{source}</span>}
    </div>
  );
}

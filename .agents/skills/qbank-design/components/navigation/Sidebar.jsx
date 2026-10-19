import React from 'react';
import { Icon } from '../core/Icon.jsx';

function SideItem({ icon, label, caption, badge, active, onClick, indent }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-current={active ? 'page' : undefined} style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 36, padding: indent ? '6px 10px 6px 12px' : '6px 10px', boxSizing: 'border-box',
      border: 'none', borderRadius: 8, textAlign: 'left', cursor: 'pointer',
      background: active ? 'var(--tint)' : hover ? 'var(--surface-pressed)' : 'transparent', color: active ? 'var(--text-on-tint)' : 'var(--text-1)',
    }}>
      {icon && <Icon name={icon} size={18} color={active ? 'currentColor' : 'var(--tint)'} />}
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {caption && <span style={{ font: 'var(--weight-semibold) var(--size-caption-2)/var(--lh-caption-2) var(--font-mono)', color: active ? 'currentColor' : 'var(--text-3)', opacity: active ? 0.8 : 1, letterSpacing: '0.02em' }}>{caption}</span>}
        <span style={{ font: 'var(--weight-medium) var(--size-subhead)/var(--lh-subhead) var(--font-ui)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      </span>
      {badge != null && <span style={{ font: 'var(--weight-medium) var(--size-footnote)/1 var(--font-mono)', color: active ? 'currentColor' : 'var(--text-3)', fontVariantNumeric: 'tabular-nums' }}>{badge}</span>}
    </button>
  );
}

// iPad/Mac sidebar: top-level nav, then the semester → course tree.
export function Sidebar({ title = 'Qbank', nav = [], semesters = [], active, onSelect, footer, width }) {
  return (
    <aside style={{ width: width || 'var(--sidebar-width)', flexShrink: 0, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18, padding: '16px 12px', background: 'var(--bg-sidebar)', borderRight: '0.5px solid var(--separator-strong)', overflowY: 'auto' }}>
      <div style={{ padding: '4px 10px 0', font: 'var(--text-title-3)', color: 'var(--text-1)' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map((n) => <SideItem key={n.id} {...n} active={active === n.id} onClick={() => onSelect && onSelect(n.id)} />)}
      </div>
      {semesters.map((s) => (
        <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ padding: '0 10px 4px', font: 'var(--weight-semibold) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>{s.label}</div>
          {s.courses.length === 0 && <div style={{ padding: '4px 10px', font: 'var(--text-footnote)', color: 'var(--text-4)' }}>No courses yet</div>}
          {s.courses.map((c) => <SideItem key={c.id} indent caption={c.code} label={c.title} badge={c.toReview || undefined} active={active === c.id} onClick={() => onSelect && onSelect(c.id)} />)}
        </div>
      ))}
      {footer && <div style={{ marginTop: 'auto' }}>{footer}</div>}
    </aside>
  );
}

import React from 'react';
import { Icon } from './Icon.jsx';
import { usePress } from './press.js';

export function ListGroup({ header, footer, children, inset = true, style }) {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {header && <h3 style={{ margin: 0, padding: inset ? '0 16px' : 0, font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>{header}</h3>}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)', overflow: 'hidden' }}>
        {items.map((child, i) => (
          <div key={i} style={{ position: 'relative' }}>
            {child}
            {i < items.length - 1 && <div style={{ position: 'absolute', left: 16, right: 0, bottom: 0, height: 0.5, background: 'var(--separator)' }}></div>}
          </div>
        ))}
      </div>
      {footer && <p style={{ margin: 0, padding: inset ? '0 16px' : 0, font: 'var(--text-footnote)', color: 'var(--text-3)', textWrap: 'pretty' }}>{footer}</p>}
    </section>
  );
}

export function ListRow({ icon, title, detail, value, chevron, destructive, selected, accessory, onClick, disabled }) {
  const [pressed, ph] = usePress(disabled || !onClick);
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={disabled ? undefined : onClick} {...ph}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 44, padding: '11px 16px', boxSizing: 'border-box',
        border: 'none', textAlign: 'left', cursor: onClick && !disabled ? 'pointer' : 'default',
        background: pressed ? 'var(--surface-pressed)' : selected ? 'var(--tint-soft)' : 'transparent',
        color: destructive ? 'var(--wrong)' : 'var(--text-1)', opacity: disabled ? 0.4 : 1, transition: 'background var(--dur-instant)',
      }}>
      {icon && <Icon name={icon} size={20} color={destructive ? 'var(--wrong)' : 'var(--tint)'} />}
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: 'var(--text-body)' }}>{title}</span>
        {detail && <span style={{ font: 'var(--text-footnote)', color: 'var(--text-3)' }}>{detail}</span>}
      </span>
      {value && <span style={{ font: 'var(--text-body)', color: 'var(--text-3)' }}>{value}</span>}
      {accessory}
      {chevron && <Icon name="chevron-right" size={18} color="var(--text-4)" strokeWidth={2} />}
    </Tag>
  );
}

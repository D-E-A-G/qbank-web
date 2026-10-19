import React from 'react';
import { Icon } from './Icon.jsx';
import { usePress } from './press.js';

const SIZES = {
  lg: { height: 50, padding: '0 20px', font: 'var(--text-headline)', icon: 20, radius: 'var(--radius-sm)' },
  md: { height: 44, padding: '0 16px', font: 'var(--weight-semibold) var(--size-callout)/var(--lh-callout) var(--font-ui)', icon: 18, radius: 'var(--radius-sm)' },
  sm: { height: 32, padding: '0 12px', font: 'var(--weight-semibold) var(--size-subhead)/var(--lh-subhead) var(--font-ui)', icon: 16, radius: '8px' },
};

const VARIANTS = {
  primary:     { bg: 'var(--tint)', fg: 'var(--text-on-tint)', pressedBg: 'var(--tint-pressed)' },
  secondary:   { bg: 'var(--tint-soft)', fg: 'var(--tint)', pressedBg: 'var(--tint-soft-border)' },
  quiet:       { bg: 'var(--surface-sunken)', fg: 'var(--text-1)', pressedBg: 'var(--surface-pressed)' },
  plain:       { bg: 'transparent', fg: 'var(--tint)', pressedBg: 'var(--surface-sunken)' },
  destructive: { bg: 'var(--wrong-soft)', fg: 'var(--wrong)', pressedBg: 'var(--wrong-border)' },
};

export function Button({ variant = 'primary', size = 'md', icon, iconRight, fullWidth, disabled, iconOnly, label, onClick, children, style, type = 'button' }) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [pressed, pressHandlers] = usePress(disabled);
  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled} aria-label={iconOnly ? label : undefined} {...pressHandlers}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: s.height, minWidth: iconOnly ? s.height : undefined, padding: iconOnly ? 0 : s.padding,
        width: fullWidth ? '100%' : undefined, boxSizing: 'border-box',
        border: 'none', borderRadius: iconOnly && variant === 'plain' ? 'var(--radius-pill)' : s.radius,
        background: pressed ? v.pressedBg : v.bg, color: v.fg, font: s.font,
        opacity: disabled ? 0.4 : 1, cursor: disabled ? 'default' : 'pointer',
        transition: 'background var(--dur-instant) var(--ease-standard), transform var(--dur-instant) var(--ease-standard)',
        transform: pressed ? 'scale(0.98)' : 'none', whiteSpace: 'nowrap', ...style,
      }}>
      {icon && <Icon name={icon} size={s.icon} strokeWidth={2} />}
      {!iconOnly && children}
      {iconRight && <Icon name={iconRight} size={s.icon} strokeWidth={2} />}
    </button>
  );
}

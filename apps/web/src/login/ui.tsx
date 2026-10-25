import type { ReactNode } from "react";
import { Icon, type IconName } from "../components/Icon";

export function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  autoCapitalize,
  error,
  hint,
}: {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  /** "characters" for a code typed in capitals, such as an agent's pairing code. */
  autoCapitalize?: "characters";
  error?: string;
  hint?: string;
}) {
  const describedBy = error !== undefined ? `${id}-error` : hint !== undefined ? `${id}-hint` : undefined;
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <input
        id={id}
        className={error !== undefined ? "field-input field-input-error" : "field-input"}
        type={type}
        value={value}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        spellCheck={autoCapitalize === undefined ? undefined : false}
        aria-invalid={error !== undefined}
        aria-describedby={describedBy}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
      {error !== undefined ? (
        <span id={`${id}-error`} className="field-error">
          {error}
        </span>
      ) : null}
      {error === undefined && hint !== undefined ? (
        <span id={`${id}-hint`} className="field-hint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function Button({
  variant = "primary",
  size = "lg",
  type = "button",
  icon,
  disabled,
  children,
  onClick,
}: {
  variant?: "primary" | "secondary" | "plain" | "quiet" | "destructive";
  size?: "lg" | "md";
  type?: "button" | "submit";
  icon?: IconName;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className={`btn btn-${size} btn-${variant}`} type={type} disabled={disabled} onClick={onClick}>
      {icon !== undefined ? <Icon name={icon} size={size === "lg" ? 20 : 18} strokeWidth={2} /> : null}
      {children}
    </button>
  );
}

export function AuthFrame({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="auth">
      <div className="auth-card">
        <div className="auth-brand">
          <img className="auth-mark" src="/icons/icon-192.png" alt="" width={76} height={76} />
          <div>
            <h1 className="auth-title">{title}</h1>
            {subtitle !== undefined ? <p className="auth-subtitle">{subtitle}</p> : null}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

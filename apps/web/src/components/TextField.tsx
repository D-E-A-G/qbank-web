export function TextField({
  label,
  value,
  onChange,
  hint,
  multiline = false,
  mono = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  multiline?: boolean;
  mono?: boolean;
  type?: "text" | "email";
}) {
  const fieldClass = mono ? "control control-mono" : "control";
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {multiline ? (
        <textarea className={fieldClass} aria-label={label} rows={8} value={value} onChange={(event) => { onChange(event.target.value); }} />
      ) : (
        <input
          className={fieldClass}
          aria-label={label}
          type={type}
          autoCapitalize={type === "email" ? "none" : undefined}
          autoCorrect={type === "email" ? "off" : undefined}
          spellCheck={type === "email" ? false : undefined}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
        />
      )}
      {hint === undefined ? null : <span className="field-hint">{hint}</span>}
    </label>
  );
}

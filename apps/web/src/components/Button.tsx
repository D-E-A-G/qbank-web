import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  variant = "primary",
  fullWidth = false,
  children,
  className,
  ...rest
}: {
  variant?: "primary" | "secondary" | "quiet" | "plain" | "destructive";
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = ["btn", `btn-${variant}`, fullWidth ? "btn-full" : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

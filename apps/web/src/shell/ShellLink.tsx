import type { ReactNode } from "react";
import { navigate } from "../router";

export function ShellLink({
  to,
  className,
  current,
  children,
}: {
  to: string;
  className: string;
  current: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={to}
      className={className}
      aria-current={current ? "page" : undefined}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

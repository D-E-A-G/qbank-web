import type { ReactNode } from "react";

export function Screen({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <>
      <div className="screen-intro">
        <h1 className="screen-title">{title}</h1>
      </div>
      {children}
    </>
  );
}

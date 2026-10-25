import type { ReactNode } from "react";

/** `action` sits at the title's right edge: the screen's + when it holds things. */
export function Screen({ title, action, children }: { title: string; action?: ReactNode; children?: ReactNode }) {
  return (
    <>
      <div className={action ? "screen-intro screen-intro-action" : "screen-intro"}>
        <h1 className="screen-title">{title}</h1>
        {action}
      </div>
      {children}
    </>
  );
}

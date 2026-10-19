import type { ReactNode } from "react";
import { SessionContext, type SessionValue } from "./session-context";

export function SessionProvider({ value, children }: { value: SessionValue; children: ReactNode }) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

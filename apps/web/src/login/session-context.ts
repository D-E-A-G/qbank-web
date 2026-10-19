import { createContext, useContext } from "react";
import type { Account } from "./api";

export interface SessionValue {
  user: Account;
  replace: (user: Account) => void;
  signOut: () => void;
}

export const SessionContext = createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error("The account screens render only after sign-in.");
  return value;
}

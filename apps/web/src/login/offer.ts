const keyFor = (userId: string): string => `qbank.passkey-offer.${userId}`;

export function passkeyOfferState(userId: string): "dismissed" | "saved" | null {
  try {
    const value = localStorage.getItem(keyFor(userId));
    if (value === "dismissed" || value === "saved") return value;
    return null;
  } catch {
    return "dismissed";
  }
}

/** A deleted account's answer to the offer goes with it. */
export function forgetPasskeyOffer(userId: string): void {
  try {
    localStorage.removeItem(keyFor(userId));
  } catch {
    // Nothing was stored.
  }
}

export function rememberPasskeyOffer(userId: string, state: "dismissed" | "saved"): void {
  try {
    localStorage.setItem(keyFor(userId), state);
  } catch {
    // The sheet still closes. The offer can appear again on the next sign-in.
  }
}

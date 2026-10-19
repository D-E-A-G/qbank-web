import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import type { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser";
import { ApiError, getJson, isOptions, postJson } from "./api";

function requestOptions(value: unknown): PublicKeyCredentialRequestOptionsJSON {
  if (!isOptions(value)) throw new ApiError({ error: "passkey_failed", message: "The passkey request failed." });
  return value;
}

function creationOptions(value: unknown): PublicKeyCredentialCreationOptionsJSON {
  if (!isOptions(value)) throw new ApiError({ error: "passkey_failed", message: "The passkey request failed." });
  return value as PublicKeyCredentialCreationOptionsJSON;
}

export async function signInWithPasskey(): Promise<void> {
  const options = requestOptions(await getJson("/api/sign-in/passkey/options"));
  const response = await startAuthentication({ optionsJSON: options });
  await postJson("/api/sign-in/passkey", { response });
}

export async function savePasskey(): Promise<void> {
  const options = creationOptions(await getJson("/api/passkeys/options"));
  const response = await startRegistration({ optionsJSON: options });
  await postJson("/api/passkeys", { response, name: "This device" });
}

import { expect, type Browser, type Page } from "@playwright/test";

export const STUDENT_EMAIL = "student@example.com";
export const STUDENT_PASSWORD = "student-pass-1";
export const ADMIN_EMAIL = "owner@example.com";
export const ADMIN_PASSWORD = "admin-pass-1";

export interface FakeAccount {
  email: string;
  password: string;
}

/**
 * A new user account for one test, with an invented email: the admin puts it on the sign-up list
 * and it signs up. For tests that delete an account or need one of their own, never the sample student.
 */
export async function newAccount(browser: Browser, label: string): Promise<FakeAccount> {
  const account = { email: `${label}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}@example.com`, password: `${label}-pass-1` };
  const admin = await browser.newContext();
  expect((await admin.request.post("/api/sign-in/password", { data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } })).status()).toBe(200);
  expect((await admin.request.post("/api/admin/sign-up-emails", { data: { email: account.email } })).ok()).toBe(true);
  await admin.close();
  const own = await browser.newContext();
  expect((await own.request.post("/api/sign-up", { data: account })).ok()).toBe(true);
  await own.close();
  return account;
}

/** Signs in with a password and dismisses the passkey offer when it appears. */
export async function signIn(page: Page, email = STUDENT_EMAIL, password = STUDENT_PASSWORD): Promise<void> {
  await page.goto("/");
  await signInHere(page, email, password);
}

/** Signs in on the sign-in screen already showing, without loading the page again, as after Sign out. */
export async function signInHere(page: Page, email: string, password: string): Promise<void> {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  // She lands on Home, or on the course she used last.
  const signedIn = page.getByRole("navigation", { name: /^(Sections|Tabs)$/ });
  const notNow = page.getByRole("button", { name: "Not now" });
  await expect(signedIn).toBeVisible();
  if (await notNow.isVisible()) await notNow.click();
  await expect(notNow).toBeHidden();
}

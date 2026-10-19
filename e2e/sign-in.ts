import { expect, type Page } from "@playwright/test";

export const STUDENT_EMAIL = "student@example.com";
export const STUDENT_PASSWORD = "student-pass-1";
export const ADMIN_EMAIL = "owner@example.com";
export const ADMIN_PASSWORD = "admin-pass-1";

/** Signs in with a password and dismisses the passkey offer when it appears. */
export async function signIn(page: Page, email = STUDENT_EMAIL, password = STUDENT_PASSWORD): Promise<void> {
  await page.goto("/");
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

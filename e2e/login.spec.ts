import { expect, test, type Page } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD, signIn, STUDENT_EMAIL, STUDENT_PASSWORD } from "./sign-in";

test("the sign-in screen offers a passkey and does not send email", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Qbank" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in with a passkey" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign up", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(page.getByRole("heading", { name: "Forgot password?" })).toBeVisible();
  await expect(page.getByText("This app doesn't send email.")).toBeVisible();
  await expect(page.getByText(/temporary password/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Send reset link" })).toHaveCount(0);
});

test.describe("signed-in account", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== "chromium", "account changes run once, on desktop Chrome");
  });

  test("keeps two browsers signed in until each one signs out", async ({ browser }) => {
    const first = await browser.newContext();
    const second = await browser.newContext();
    const pageA = await first.newPage();
    const pageB = await second.newPage();
    await signIn(pageA);
    await signIn(pageB);

    await pageA.getByRole("link", { name: "Settings" }).click();
    await pageA.getByRole("button", { name: "Sign out" }).click();
    await expect(pageA.getByRole("heading", { name: "Qbank" })).toBeVisible();

    await pageB.goto("/");
    await expect(pageB.getByRole("heading", { name: "Home" })).toBeVisible();
    await first.close();
    await second.close();
  });

  test("locks an address after five wrong passwords", async ({ page }) => {
    const email = `nobody-${String(Date.now())}@example.com`;
    await page.goto("/");
    for (let attempt = 0; attempt < 4; attempt += 1) {
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("wrong-password");
      await page.getByRole("button", { name: "Sign in", exact: true }).click();
      await expect(page.getByRole("alert")).toHaveText("That email or password is not right.");
    }
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText("Too many tries");
  });

  test("offers a passkey after a password sign-in, and not after a passkey sign-in", async ({ page }) => {
    await page.goto("/");
    await addVirtualAuthenticator(page);
    await page.getByLabel("Email").fill(STUDENT_EMAIL);
    await page.getByLabel("Password").fill(STUDENT_PASSWORD);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Save a passkey for this device?" })).toBeVisible();
    await page.getByRole("button", { name: "Save a passkey", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Save a passkey for this device?" })).toBeHidden();

    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page.getByText("This device", { exact: true }).first()).toBeVisible();
    await page.getByRole("button", { name: "Sign out" }).click();
    await page.getByRole("button", { name: "Sign in with a passkey" }).click();
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Save a passkey for this device?" })).toHaveCount(0);
  });

  test("the admin resets her password, and she chooses her own", async ({ page }) => {
    await signIn(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.getByRole("link", { name: "Admin" }).click();
    const denied = await page.request.post("/api/attempts", {
      data: {
        clientAttemptId: crypto.randomUUID(),
        questionId: "q1",
        response: { choice: "a" },
        guessed: false,
      },
    });
    expect(denied.status()).toBe(403);
    expect(await denied.json()).toMatchObject({ error: "admin_cannot_record_answer" });

    await page.getByLabel("Temporary password").fill("temp-pass-1");
    await page.getByRole("button", { name: "Set temporary password" }).click();
    await expect(page.getByText(`Temporary password set for ${STUDENT_EMAIL}. She'll choose her own the next time she signs in.`)).toBeVisible();

    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByRole("button", { name: "Sign out" }).click();
    await page.getByLabel("Email").fill(STUDENT_EMAIL);
    await page.getByLabel("Password").fill("temp-pass-1");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Choose a new password" })).toBeVisible();
    await page.getByLabel("Temporary password").fill("temp-pass-1");
    await page.getByLabel("New password").fill(STUDENT_PASSWORD);
    await page.getByRole("button", { name: "Save password" }).click();
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  });
});

test.describe("sign-up", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== "chromium", "sign-up makes an account, so it runs once, on desktop Chrome");
  });

  test("the admin lets an email sign up, and only that email gets an account", async ({ page }) => {
    const email = `new-${String(Date.now())}@example.com`;
    await signIn(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.getByRole("link", { name: "Admin" }).click();
    await page.getByLabel("Email to add").fill(email);
    await page.getByRole("button", { name: "Add email" }).click();
    const list = page.getByRole("list", { name: "Emails that can sign up" });
    await expect(list.getByText(email)).toBeVisible();
    await expect(list.getByRole("listitem").filter({ hasText: email })).toContainText("not signed up yet");

    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByRole("button", { name: "Sign out" }).click();
    await page.getByRole("button", { name: "Sign up", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();

    await page.getByLabel("Email").fill(`stranger-${String(Date.now())}@example.com`);
    await page.getByLabel("Password").fill("new-pass-123");
    await page.getByRole("button", { name: "Sign up", exact: true }).click();
    await expect(page.getByRole("alert")).toHaveText(/can't sign up here/);

    await page.getByLabel("Email").fill(STUDENT_EMAIL);
    await page.getByRole("button", { name: "Sign up", exact: true }).click();
    await expect(page.getByRole("alert")).toHaveText(/can't sign up here/);

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: "Sign up", exact: true }).click();
    await expect(page.getByRole("alert")).toHaveText("Choose a password of at least 8 characters.");

    await page.getByLabel("Password").fill("new-pass-123");
    await page.getByRole("button", { name: "Sign up", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Save a passkey for this device?" })).toBeVisible();
    await page.getByRole("button", { name: "Not now" }).click();
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Admin" })).toHaveCount(0);

    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page.getByText(`Signed in as ${email}.`)).toBeVisible();
    await page.getByRole("button", { name: "Sign out" }).click();

    await signIn(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.getByRole("link", { name: "Admin" }).click();
    await expect(list.getByRole("listitem").filter({ hasText: email })).toContainText("Has an account");
    const picker = page.getByLabel("Showing progress for");
    await expect(picker).toHaveValue(/.+/);
    await picker.selectOption({ label: email });
    await expect(page.getByText(`For ${email}.`, { exact: false })).toBeVisible();
    await page.getByRole("link", { name: "Home" }).click();
    await expect(page.getByText(`${email}'s progress, read-only.`, { exact: false })).toBeVisible();

    await page.getByRole("link", { name: "Admin" }).click();
    await page.getByLabel("Showing progress for").selectOption({ label: STUDENT_EMAIL });
    await expect(page.getByText(`For ${STUDENT_EMAIL}.`, { exact: false })).toBeVisible();
  });
});

async function addVirtualAuthenticator(page: Page): Promise<void> {
  const client = await page.context().newCDPSession(page);
  await client.send("WebAuthn.enable");
  await client.send("WebAuthn.addVirtualAuthenticator", {
    options: {
      protocol: "ctap2",
      transport: "internal",
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  });
}

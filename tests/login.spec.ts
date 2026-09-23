import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const USERNAME = process.env.POLLEASY_USERNAME!;
const PASSWORD = process.env.POLLEASY_PASSWORD!;

test.describe('PollEasy login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('logs in with valid credentials', async () => {
    await loginPage.login(USERNAME, PASSWORD);
    await loginPage.expectLoggedIn();
  });

  test('keeps the user on the login page with a wrong password', async ({ page }) => {
    await loginPage.login(USERNAME, 'WrongPassword@@99');
    // Wait for the request to settle so this cannot pass while still submitting.
    await expect(loginPage.loginButton).toBeEnabled({ timeout: 30_000 });
    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.heading).toBeVisible();
  });

  test('toggles password visibility', async () => {
    await loginPage.passwordInput.fill(PASSWORD);
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await loginPage.showPasswordButton.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
  });
});

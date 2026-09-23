import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly showPasswordButton: Locator;
  readonly loginButton: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    // Inputs carry generated headlessui ids, so match on their visible labels.
    this.emailInput = page.getByLabel('Email', { exact: true });
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.showPasswordButton = page.getByRole('button', { name: 'Show password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.heading = page.getByRole('heading', { name: 'Sign in to your account' });
  }

  async goto() {
    await this.page.goto('/login');
    await expect(this.heading).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedIn() {
    // Sign-in latency varies widely by browser and run, well past the 5s default.
    await expect(this.page).toHaveURL(/polleasy-web\.vercel\.app\/?$/, { timeout: 30_000 });
    await expect(this.heading).toBeHidden();
  }
}

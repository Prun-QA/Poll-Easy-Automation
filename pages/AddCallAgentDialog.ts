import { expect, Locator, Page } from '@playwright/test';

export type CallAgentDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export class AddCallAgentDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly heading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'Add call agent' });
    // The Headless UI dialog wrapper has no dimensions, so visibility is read off its heading.
    this.heading = this.dialog.getByRole('heading', { name: 'Add call agent' });
    this.firstNameInput = this.dialog.getByLabel('First name', { exact: true });
    this.lastNameInput = this.dialog.getByLabel('Last name', { exact: true });
    this.emailInput = this.dialog.getByLabel('Email', { exact: true });
    this.phoneInput = this.dialog.getByLabel('Phone (optional)', { exact: true });
    this.submitButton = this.dialog.getByRole('button', { name: 'Add agent', exact: true });
  }

  async expectOpen() {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
  }

  async fill({ firstName, lastName, email, phone }: CallAgentDetails) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
  }

  async submit() {
    await this.submitButton.click();
  }
}

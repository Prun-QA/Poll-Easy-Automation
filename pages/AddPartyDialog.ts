import { expect, Locator, Page } from '@playwright/test';

export type PartyDetails = {
  name: string;
  acronym: string;
};

export class AddPartyDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly acronymInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'Add party' });
    // The Headless UI dialog wrapper has no dimensions, so visibility is read off its heading.
    this.heading = this.dialog.getByRole('heading', { name: 'Add party' });
    this.nameInput = this.dialog.getByLabel('Party name');
    this.acronymInput = this.dialog.getByLabel('Acronym');
    this.saveButton = this.dialog.getByRole('button', { name: 'Save party' });
  }

  async expectOpen() {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
  }

  async fill({ name, acronym }: PartyDetails) {
    await this.nameInput.fill(name);
    await this.acronymInput.fill(acronym);
  }

  async submit() {
    await this.saveButton.click();
  }
}

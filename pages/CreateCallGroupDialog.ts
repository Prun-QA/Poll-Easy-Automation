import { expect, Locator, Page } from '@playwright/test';

export type CallGroupDetails = {
  name: string;
  description: string;
  /** Existing agent shown as "Name · Call Agent". */
  lead: string;
  members: string[];
};

export class CreateCallGroupDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly leadButton: Locator;
  readonly membersInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'Create Call Group' });
    // The Headless UI dialog wrapper has no dimensions, so visibility is read off its heading.
    this.heading = this.dialog.getByRole('heading', { name: 'Create Call Group' });
    this.nameInput = this.dialog.getByLabel('Call Group name');
    this.descriptionInput = this.dialog.getByLabel('Description');
    // The trigger's accessible name keeps its "Team lead" label once an agent is chosen.
    this.leadButton = this.dialog.getByRole('button', { name: /^Team lead/ });
    this.membersInput = this.dialog.getByPlaceholder('Search and select agents');
    this.submitButton = this.dialog.getByRole('button', { name: 'Create Call Group', exact: true });
  }

  async expectOpen() {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
  }

  async fill({ name, description, lead, members }: CallGroupDetails) {
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);

    await this.leadButton.click();
    await this.page.getByRole('option', { name: lead, exact: true }).click();
    await expect(this.leadButton).toContainText(lead);

    for (const member of members) {
      await this.membersInput.fill(member.split(' · ')[0]);
      await this.page.getByRole('option', { name: member, exact: true }).click();
    }
  }

  async submit() {
    await this.submitButton.click();
  }
}

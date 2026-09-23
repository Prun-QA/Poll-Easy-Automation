import { expect, Locator, Page } from '@playwright/test';

export type CandidateDetails = {
  fullName: string;
  position: string;
  bio: string;
  /** Registry entry shown as "LP — Labour Party". */
  party: string;
};

export class AddCandidateDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly heading: Locator;
  readonly fullNameInput: Locator;
  readonly positionInput: Locator;
  readonly bioInput: Locator;
  readonly partyButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // "Add member" opens a dialog that calls itself "Add candidate".
    this.dialog = page.getByRole('dialog', { name: 'Add candidate' });
    // The Headless UI dialog wrapper has no dimensions, so visibility is read off its heading.
    this.heading = this.dialog.getByRole('heading', { name: 'Add candidate' });
    this.fullNameInput = this.dialog.getByLabel('Full name');
    this.positionInput = this.dialog.getByLabel('Position');
    this.bioInput = this.dialog.getByLabel('Bio / summary');
    this.partyButton = this.dialog.getByRole('button', { name: /^Party/ });
    this.saveButton = this.dialog.getByRole('button', { name: 'Save candidate' });
  }

  async expectOpen() {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
  }

  /** Scoped to the listbox panel: the page's hidden native party <select> also exposes options. */
  private async selectParty(party: string) {
    await this.partyButton.click();
    const panelId = await this.partyButton.getAttribute('aria-controls');
    await this.page.locator(`[id="${panelId}"]`).getByRole('option', { name: party, exact: true }).click();
    await expect(this.partyButton).toContainText(party);
  }

  async fill({ fullName, position, bio, party }: CandidateDetails) {
    await this.fullNameInput.fill(fullName);
    await this.positionInput.fill(position);
    await this.bioInput.fill(bio);
    await this.selectParty(party);
  }

  async submit() {
    await this.saveButton.click();
  }
}

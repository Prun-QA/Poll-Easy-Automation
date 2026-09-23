import { expect, Locator, Page } from '@playwright/test';

export type CampaignEssentials = {
  name: string;
  description: string;
  /** Presidential | Governorship | Senatorial | Local Government */
  type: string;
  /** Day of the current month to use as the start date. */
  startDay: number;
  candidate: string;
  manager: string;
};

export class CreateCampaignPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly campaignTypeButton: Locator;
  readonly managerButton: Locator;
  readonly continueToGeographyButton: Locator;
  readonly reviewCampaignButton: Locator;
  readonly createDraftButton: Locator;
  readonly geographyHeading: Locator;
  readonly reviewHeading: Locator;
  readonly statesCovered: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByPlaceholder('e.g. National Campaign 2027');
    this.descriptionInput = page.getByPlaceholder('Describe the campaign goals and focus');
    // Campaign type is the first listbox on the form; the manager listbox is the one with an aria-label.
    this.campaignTypeButton = page.locator('button[aria-haspopup="listbox"]').first();
    this.managerButton = page.getByRole('button', { name: 'Campaign manager' });
    this.continueToGeographyButton = page.getByRole('button', { name: 'Continue to geography' });
    this.reviewCampaignButton = page.getByRole('button', { name: 'Review campaign' });
    this.createDraftButton = page.getByRole('button', { name: 'Create draft campaign' });
    this.geographyHeading = page.getByRole('heading', { name: 'Geographic scope' }).first();
    this.reviewHeading = page.getByRole('heading', { name: 'Review and create' });
    this.statesCovered = page.getByText('STATES COVERED');
  }

  /** The date and candidate popovers have no accessible name, so they are found by their trigger text. */
  private async openPanel(triggerText: string): Promise<Locator> {
    const trigger = this.page.locator('button').filter({ hasText: triggerText });
    await trigger.click();
    const panelId = await trigger.getAttribute('aria-controls');
    return this.page.locator(`[id="${panelId}"]`);
  }

  private dayLabel(day: number) {
    const now = new Date();
    return `${now.toLocaleString('en-US', { month: 'long' })} ${day}, ${now.getFullYear()}`;
  }

  async fillEssentials({ name, description, type, startDay, candidate, manager }: CampaignEssentials) {
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);

    await this.campaignTypeButton.click();
    await this.page.getByRole('option', { name: type, exact: true }).click();

    const datePanel = await this.openPanel('Select date');
    await datePanel.getByRole('button', { name: this.dayLabel(startDay), exact: true }).click();

    const candidatePanel = await this.openPanel('Select a candidate');
    await candidatePanel.getByRole('button', { name: candidate, exact: true }).click();

    await this.managerButton.click();
    await this.page.getByRole('option').filter({ hasText: manager }).click();
  }

  async goToGeography() {
    await this.continueToGeographyButton.click();
    await expect(this.geographyHeading).toBeVisible({ timeout: 30_000 });
  }

  async selectRegion(region: string) {
    await this.page.getByRole('button', { name: region, exact: true }).click();
    await expect(this.statesCovered).toBeVisible();
  }

  async goToReview() {
    await this.reviewCampaignButton.click();
    await expect(this.reviewHeading).toBeVisible({ timeout: 30_000 });
  }

  async submit() {
    await this.createDraftButton.click();
  }
}

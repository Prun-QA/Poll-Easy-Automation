import { expect, Locator, Page } from '@playwright/test';

export type SurveyBasics = {
  title: string;
  description: string;
  audience: string;
  /** Quick-preset region, e.g. "South West". */
  region: string;
  identity?: 'anonymous' | 'identified' | 'optional';
};

export class CreateSurveyPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly audienceInput: Locator;
  readonly identitySelect: Locator;
  readonly statesCovered: Locator;
  readonly continueButton: Locator;
  readonly savingButton: Locator;
  readonly builderHeading: Locator;
  readonly reviewHeading: Locator;
  readonly saveDraftButton: Locator;
  readonly publishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByLabel('Survey title');
    this.descriptionInput = page.getByLabel('Description');
    this.audienceInput = page.getByLabel('Audience');
    this.identitySelect = page.locator('select');
    this.statesCovered = page.getByText('STATES COVERED');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.savingButton = page.getByRole('button', { name: /Saving/ });
    this.builderHeading = page.getByRole('heading', { name: 'Form Elements' });
    this.reviewHeading = page.getByRole('heading', { name: 'Review survey' });
    this.saveDraftButton = page.getByRole('button', { name: 'Save Draft' });
    this.publishButton = page.getByRole('button', { name: 'Publish Survey' });
  }

  async fillBasics({ title, description, audience, region, identity = 'anonymous' }: SurveyBasics) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.audienceInput.fill(audience);
    await this.identitySelect.selectOption(identity);
    await this.page.getByRole('button', { name: region, exact: true }).click();
    await expect(this.statesCovered).toBeVisible();
  }

  /** Each step persists the draft server-side, so the button flips to "Saving...". */
  async continueToNextStep() {
    await this.continueButton.click();
    await expect(this.savingButton).toBeHidden({ timeout: 90_000 });
  }

  async goToBuilder() {
    await this.continueToNextStep();
    await expect(this.builderHeading).toBeVisible({ timeout: 30_000 });
  }

  async goToReview() {
    await this.continueToNextStep();
    await expect(this.reviewHeading).toBeVisible({ timeout: 30_000 });
  }

  async saveDraft() {
    await this.saveDraftButton.click();
    await expect(this.page).toHaveURL(/\/surveys\/[0-9a-f-]{36}$/, { timeout: 60_000 });
  }
}

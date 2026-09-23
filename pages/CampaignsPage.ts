import { expect, Locator, Page } from '@playwright/test';

export class CampaignsPage {
  readonly page: Page;
  readonly createCampaignButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createCampaignButton = page.getByRole('button', { name: 'Create Campaign' });
    this.searchInput = page.getByPlaceholder('Search campaigns...');
  }

  async goto() {
    await this.page.goto('/campaigns');
    // The app gates every page behind a workspace bootstrap that can outlast a default timeout.
    await expect(this.page.getByText('Preparing your workspace')).toBeHidden({ timeout: 120_000 });
    await expect(this.createCampaignButton).toBeVisible({ timeout: 30_000 });
  }

  async startCreate() {
    await this.createCampaignButton.click();
    await expect(this.page).toHaveURL(/\/campaigns\/create/, { timeout: 30_000 });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  entryFor(name: string): Locator {
    return this.page.getByText(name, { exact: true });
  }
}

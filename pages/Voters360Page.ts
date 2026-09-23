import { expect, Locator, Page } from '@playwright/test';

export class Voters360Page {
  readonly page: Page;
  readonly addVoterLink: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addVoterLink = page.getByRole('link', { name: 'Add Voter' });
    this.searchInput = page.getByLabel('Search voters');
  }

  async goto() {
    await this.page.goto('/voters-360');
    // The app gates every page behind a workspace bootstrap that can outlast a default timeout.
    await expect(this.page.getByText('Preparing your workspace')).toBeHidden({ timeout: 120_000 });
    await expect(this.addVoterLink).toBeVisible({ timeout: 30_000 });
  }

  async startCreate() {
    await this.addVoterLink.click();
    await expect(this.page).toHaveURL(/\/voters-360\/create/, { timeout: 30_000 });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }
}

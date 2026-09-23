import { expect, Locator, Page } from '@playwright/test';

export class PollsPage {
  readonly page: Page;
  readonly createPollButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createPollButton = page.getByRole('button', { name: 'Create New Poll' });
    this.searchInput = page.getByPlaceholder('Search polls...');
  }

  async goto() {
    await this.page.goto('/polls');
    // The app gates every page behind a workspace bootstrap that can outlast a default timeout.
    await expect(this.page.getByText('Preparing your workspace')).toBeHidden({ timeout: 120_000 });
    await expect(this.createPollButton).toBeVisible({ timeout: 30_000 });
  }

  async startCreate() {
    await this.createPollButton.click();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  entryFor(name: string): Locator {
    return this.page.getByText(name, { exact: true });
  }
}

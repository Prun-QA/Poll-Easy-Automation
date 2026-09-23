import { expect, Locator, Page } from '@playwright/test';

export class PartiesPage {
  readonly page: Page;
  readonly addPartyButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addPartyButton = page.getByRole('button', { name: 'Add party' });
    this.searchInput = page.getByPlaceholder('Search by name or acronym');
  }

  async goto() {
    await this.page.goto('/settings/members-parties?tab=parties');
    // The app gates every page behind a workspace bootstrap that can outlast a default timeout.
    await expect(this.page.getByText('Preparing your workspace')).toBeHidden({ timeout: 120_000 });
    await expect(this.page.getByRole('heading', { name: 'Manage parties' })).toBeVisible({ timeout: 30_000 });
    await expect(this.addPartyButton).toBeVisible();
  }

  async startCreate() {
    await this.addPartyButton.click();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  entryFor(value: string): Locator {
    return this.page.getByText(value, { exact: true });
  }
}

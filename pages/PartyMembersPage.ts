import { expect, Locator, Page } from '@playwright/test';

export class PartyMembersPage {
  readonly page: Page;
  readonly addMemberButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addMemberButton = page.getByRole('button', { name: 'Add member' });
    this.searchInput = page.getByPlaceholder('Search by name, position, or party');
  }

  async goto() {
    // Members is the default tab of the Members & Parties settings page.
    await this.page.goto('/settings/members-parties');
    // The app gates every page behind a workspace bootstrap that can outlast a default timeout.
    await expect(this.page.getByText('Preparing your workspace')).toBeHidden({ timeout: 120_000 });
    await expect(this.page.getByRole('heading', { name: 'Manage members' })).toBeVisible({ timeout: 30_000 });
    await expect(this.addMemberButton).toBeVisible();
  }

  async startCreate() {
    await this.addMemberButton.click();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  rowFor(name: string): Locator {
    return this.page.getByRole('row').filter({ hasText: name });
  }
}

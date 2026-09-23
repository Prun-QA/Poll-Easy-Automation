import { expect, Locator, Page } from '@playwright/test';

export class CallGroupsPage {
  readonly page: Page;
  readonly createCallGroupButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createCallGroupButton = page.getByRole('button', { name: 'Create Call Group', exact: true });
    this.searchInput = page.getByPlaceholder('Search call groups');
  }

  async goto() {
    // Call Groups is routed as /call-center/teams, not /call-center/call-groups.
    await this.page.goto('/call-center/teams');
    // The app gates every page behind a workspace bootstrap that can outlast a default timeout.
    await expect(this.page.getByText('Preparing your workspace')).toBeHidden({ timeout: 120_000 });
    await expect(this.createCallGroupButton).toBeVisible({ timeout: 30_000 });
  }

  async startCreate() {
    await this.createCallGroupButton.click();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  entryFor(name: string): Locator {
    return this.page.getByText(name, { exact: true });
  }
}

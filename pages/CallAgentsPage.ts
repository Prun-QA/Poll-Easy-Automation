import { expect, Locator, Page } from '@playwright/test';

export class CallAgentsPage {
  readonly page: Page;
  readonly addAgentButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addAgentButton = page.getByRole('button', { name: 'Add Agent' });
    this.searchInput = page.getByPlaceholder('Search agents');
  }

  async goto() {
    await this.page.goto('/call-center/agents');
    // The app gates every page behind a workspace bootstrap that can outlast a default timeout.
    await expect(this.page.getByText('Preparing your workspace')).toBeHidden({ timeout: 120_000 });
    await expect(this.addAgentButton).toBeVisible({ timeout: 30_000 });
  }

  async startCreate() {
    await this.addAgentButton.click();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  entryFor(name: string): Locator {
    return this.page.getByText(name, { exact: true });
  }
}

import { expect, Locator, Page } from '@playwright/test';

export class SurveysPage {
  readonly page: Page;
  readonly createSurveyButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createSurveyButton = page.getByRole('button', { name: 'Create Survey' });
    this.searchInput = page.getByPlaceholder('Search surveys...');
  }

  async goto() {
    await this.page.goto('/surveys');
    // The app gates every page behind a workspace bootstrap that can outlast a default timeout.
    await expect(this.page.getByText('Preparing your workspace')).toBeHidden({ timeout: 120_000 });
    await expect(this.createSurveyButton).toBeVisible({ timeout: 30_000 });
  }

  async startCreate() {
    await this.createSurveyButton.click();
    await expect(this.page).toHaveURL(/\/surveys\/new/, { timeout: 30_000 });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  entryFor(title: string): Locator {
    return this.page.getByText(title, { exact: true });
  }
}

import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SurveysPage } from '../pages/SurveysPage';
import { CreateSurveyPage } from '../pages/CreateSurveyPage';

test('creates a survey draft through the three-step wizard', async ({ page }) => {
  // Survey titles must be unique per organisation, so stamp each run.
  const title = `PW Survey ${Date.now()}`;

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.POLLEASY_USERNAME!, process.env.POLLEASY_PASSWORD!);
  await loginPage.expectLoggedIn();

  const surveysPage = new SurveysPage(page);
  await surveysPage.goto();
  await surveysPage.startCreate();

  const createSurvey = new CreateSurveyPage(page);
  await createSurvey.fillBasics({
    title,
    description: 'Created by Playwright automation.',
    audience: 'Registered voters',
    region: 'South West',
  });

  await createSurvey.goToBuilder();
  await createSurvey.goToReview();

  await expect(page.getByText(title)).toBeVisible();
  await expect(page.getByText('Ready to publish')).toBeVisible();

  await createSurvey.saveDraft();

  await expect(page.getByRole('heading', { name: title })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('button', { name: /Launch Survey/ })).toBeVisible();
  await expect(page.getByText('draft', { exact: true })).toBeVisible();

  await surveysPage.goto();
  await surveysPage.search(title);
  await expect(surveysPage.entryFor(title)).toBeVisible({ timeout: 30_000 });
});

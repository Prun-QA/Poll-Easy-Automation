import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Voters360Page } from '../pages/Voters360Page';
import { CreateVoterPage } from '../pages/CreateVoterPage';

test('creates a Voters 360 profile through the three-step wizard', async ({ page }) => {
  const fullName = `PW Voter ${Date.now()}`;
  const phone = '+2348012345678';

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.POLLEASY_USERNAME!, process.env.POLLEASY_PASSWORD!);
  await loginPage.expectLoggedIn();

  const voters360 = new Voters360Page(page);
  await voters360.goto();
  await voters360.startCreate();

  const createVoter = new CreateVoterPage(page);
  await createVoter.fillIdentity({
    fullName,
    phone,
    gender: 'female',
    ageBand: '25-34',
    consent: 'granted',
  });

  await createVoter.goToLocation();
  await createVoter.fillLocation({
    state: 'Lagos',
    lga: 'Agege',
    wardQuery: 'AGBOTIKUYO',
    ward: 'AGBOTIKUYO/DOPEMU',
  });

  await createVoter.goToReview();
  await expect(page.getByText(fullName)).toBeVisible();
  await expect(page.getByText('Lagos, Agege, AGBOTIKUYO/DOPEMU')).toBeVisible();

  await createVoter.submit();

  await expect(page).toHaveURL(/\/voters-360\/[0-9a-f-]{36}$/, { timeout: 60_000 });
  await expect(page.getByRole('heading', { name: fullName })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(phone)).toBeVisible();
  await expect(page.getByText('25-34 · female')).toBeVisible();
});

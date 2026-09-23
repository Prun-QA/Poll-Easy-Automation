import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CampaignsPage } from '../pages/CampaignsPage';
import { CreateCampaignPage } from '../pages/CreateCampaignPage';

test('creates a draft election campaign through the three-step wizard', async ({ page }) => {
  const name = `PW Campaign ${Date.now()}`;
  const description = 'Created by Playwright automation.';

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.POLLEASY_USERNAME!, process.env.POLLEASY_PASSWORD!);
  await loginPage.expectLoggedIn();

  const campaignsPage = new CampaignsPage(page);
  await campaignsPage.goto();
  await campaignsPage.startCreate();

  const createCampaign = new CreateCampaignPage(page);
  await createCampaign.fillEssentials({
    name,
    description,
    type: 'Governorship',
    startDay: 10,
    candidate: 'Osimen · APC',
    manager: 'Henry Wilson',
  });

  await createCampaign.goToGeography();
  await createCampaign.selectRegion('South West');
  await createCampaign.goToReview();

  await expect(page.getByText(name, { exact: true })).toBeVisible();
  await expect(page.getByText('Governorship', { exact: true })).toBeVisible();

  await createCampaign.submit();

  await expect(page).toHaveURL(/\/campaigns\/[0-9a-f-]{36}/, { timeout: 60_000 });
  await expect(page.getByRole('heading', { name })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(description)).toBeVisible();
});

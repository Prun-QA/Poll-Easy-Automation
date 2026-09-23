import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CallGroupsPage } from '../pages/CallGroupsPage';
import { CreateCallGroupDialog } from '../pages/CreateCallGroupDialog';

test('creates a uniquely named call group', async ({ page }) => {
  // The app allows duplicate group names, so uniqueness comes from the stamp.
  const name = `PW Call Group ${Date.now()}`;
  const lead = 'Tammy · Call Agent';

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.POLLEASY_USERNAME!, process.env.POLLEASY_PASSWORD!);
  await loginPage.expectLoggedIn();

  const callGroups = new CallGroupsPage(page);
  await callGroups.goto();
  await callGroups.startCreate();

  const createGroup = new CreateCallGroupDialog(page);
  await createGroup.expectOpen();
  await createGroup.fill({
    name,
    description: 'Created by Playwright automation.',
    lead,
    members: [lead],
  });

  await createGroup.submit();

  await expect(createGroup.heading).toBeHidden({ timeout: 60_000 });

  await callGroups.search(name);
  await expect(callGroups.entryFor(name)).toHaveCount(1, { timeout: 30_000 });
  await expect(callGroups.entryFor(name)).toBeVisible();
});

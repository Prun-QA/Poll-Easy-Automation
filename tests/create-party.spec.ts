import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PartiesPage } from '../pages/PartiesPage';
import { AddPartyDialog } from '../pages/AddPartyDialog';

test('creates a party in the workspace party registry', async ({ page }) => {
  const stamp = `${Date.now()}`;
  const name = `PW Party ${stamp}`;
  const acronym = `PW${stamp.slice(-5)}`;

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.POLLEASY_USERNAME!, process.env.POLLEASY_PASSWORD!);
  await loginPage.expectLoggedIn();

  const parties = new PartiesPage(page);
  await parties.goto();
  await parties.startCreate();

  const addParty = new AddPartyDialog(page);
  await addParty.expectOpen();
  await addParty.fill({ name, acronym });
  await addParty.submit();

  await expect(addParty.heading).toBeHidden({ timeout: 60_000 });

  await parties.search(acronym);
  await expect(parties.entryFor(name)).toHaveCount(1, { timeout: 30_000 });
  await expect(parties.entryFor(acronym)).toBeVisible();
});

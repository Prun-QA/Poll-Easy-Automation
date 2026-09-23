import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PartyMembersPage } from '../pages/PartyMembersPage';
import { AddCandidateDialog } from '../pages/AddCandidateDialog';

test('creates a party member in the workspace registry', async ({ page }) => {
  const fullName = `PW Candidate ${Date.now()}`;
  const position = 'Senatorial Candidate';

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.POLLEASY_USERNAME!, process.env.POLLEASY_PASSWORD!);
  await loginPage.expectLoggedIn();

  const members = new PartyMembersPage(page);
  await members.goto();
  await members.startCreate();

  const addCandidate = new AddCandidateDialog(page);
  await addCandidate.expectOpen();
  await addCandidate.fill({
    fullName,
    position,
    bio: 'Created by Playwright automation.',
    party: 'LP — Labour Party',
  });

  await addCandidate.submit();

  await expect(addCandidate.heading).toBeHidden({ timeout: 60_000 });

  await members.search(fullName);
  const row = members.rowFor(fullName);
  await expect(row).toHaveCount(1, { timeout: 30_000 });
  await expect(row).toContainText(position);
  await expect(row).toContainText('Labour Party');
  await expect(row).toContainText('Active');
});

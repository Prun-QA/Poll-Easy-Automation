import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PollsPage } from '../pages/PollsPage';
import { CreatePollPage } from '../pages/CreatePollPage';

test('creates a draft poll from the polls list', async ({ page }) => {
  const name = `PW Poll ${Date.now()}`;

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.POLLEASY_USERNAME!, process.env.POLLEASY_PASSWORD!);
  await loginPage.expectLoggedIn();

  const pollsPage = new PollsPage(page);
  await pollsPage.goto();
  await pollsPage.startCreate();

  const createPoll = new CreatePollPage(page);
  await createPoll.expectOpen();
  await createPoll.fillDetails({
    name,
    description: 'Created by Playwright automation.',
    targetResponses: '100',
  });
  await createPoll.pickStartDate(10);
  await createPoll.pickEndDate(20);
  await createPoll.selectPrimaryCandidate('Osimen · APC');
  await createPoll.selectOppositionCandidates(['Felix · ADP']);

  await createPoll.submit();

  await expect(createPoll.dialogHeading).toBeHidden({ timeout: 60_000 });

  // Creating the draft opens the questionnaire editor for the new poll.
  await expect(page.getByRole('button', { name: 'Cancel questionnaire editing' })).toBeVisible({
    timeout: 60_000,
  });
  await expect(page.getByText(name, { exact: true })).toBeVisible();

  await pollsPage.goto();
  await pollsPage.search(name);
  await expect(pollsPage.entryFor(name)).toBeVisible({ timeout: 30_000 });
});

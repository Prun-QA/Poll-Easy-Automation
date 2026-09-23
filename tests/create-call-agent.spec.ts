import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CallAgentsPage } from '../pages/CallAgentsPage';
import { AddCallAgentDialog } from '../pages/AddCallAgentDialog';

test('creates a call agent from the call center roster', async ({ page }) => {
  const stamp = Date.now();
  const firstName = 'PW';
  const lastName = `Agent${stamp}`;
  // Adding an agent creates a real workspace membership, so the invite goes to a disposable inbox.
  const email = `pw-agent-${stamp}@yopmail.com`;

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.POLLEASY_USERNAME!, process.env.POLLEASY_PASSWORD!);
  await loginPage.expectLoggedIn();

  const agentsPage = new CallAgentsPage(page);
  await agentsPage.goto();
  await agentsPage.startCreate();

  const addAgent = new AddCallAgentDialog(page);
  await addAgent.expectOpen();
  await addAgent.fill({
    firstName,
    lastName,
    email,
    phone: '+234 800 000 0000',
  });

  await addAgent.submit();

  await expect(addAgent.heading).toBeHidden({ timeout: 60_000 });
  await agentsPage.search(lastName);
  await expect(agentsPage.entryFor(`${firstName} ${lastName}`)).toBeVisible({ timeout: 30_000 });
});

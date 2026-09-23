import { expect, Locator, Page } from '@playwright/test';

export type PollDetails = {
  name: string;
  description: string;
  targetResponses: string;
};

export class CreatePollPage {
  readonly page: Page;
  readonly dialog: Locator;
  readonly dialogHeading: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly targetResponsesInput: Locator;
  readonly startDateButton: Locator;
  readonly endDateButton: Locator;
  readonly primaryCandidateButton: Locator;
  readonly oppositionCandidatesButton: Locator;
  readonly selectedOpposition: Locator;
  readonly createDraftButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'Create poll' });
    // The Headless UI dialog wrapper itself has no dimensions, so visibility is read off its heading.
    this.dialogHeading = this.dialog.getByRole('heading', { name: 'Create poll' });
    this.nameInput = this.dialog.getByRole('textbox', { name: 'Poll name' });
    this.descriptionInput = this.dialog.getByRole('textbox', { name: 'Description' });
    this.targetResponsesInput = this.dialog.getByRole('spinbutton', { name: 'Target responses' });
    this.startDateButton = this.dialog.getByRole('button', { name: 'Start date' });
    this.endDateButton = this.dialog.getByRole('button', { name: 'End date' });
    this.primaryCandidateButton = this.dialog.getByRole('button', { name: 'Primary candidate' });
    this.oppositionCandidatesButton = this.dialog.getByRole('button', { name: 'Opposition candidates' });
    this.selectedOpposition = this.dialog.getByRole('list', { name: 'Selected opposition candidates' });
    this.createDraftButton = this.dialog.getByRole('button', { name: 'Create Draft Poll' });
  }

  async expectOpen() {
    await expect(this.dialogHeading).toBeVisible({ timeout: 30_000 });
  }

  async fillDetails({ name, description, targetResponses }: PollDetails) {
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
    await this.targetResponsesInput.fill(targetResponses);
  }

  /** The calendar opens on the current month, so days are addressed by their aria-label. */
  private dayLabel(day: number) {
    const now = new Date();
    return `${now.toLocaleString('en-US', { month: 'long' })} ${day}, ${now.getFullYear()}`;
  }

  /** Popovers stay mounted once opened, so each one is addressed via its trigger's aria-controls. */
  private async openPanel(trigger: Locator): Promise<Locator> {
    await trigger.click();
    const panelId = await trigger.getAttribute('aria-controls');
    return panelId ? this.page.locator(`[id="${panelId}"]`) : this.dialog;
  }

  private async pickDay(trigger: Locator, day: number) {
    const panel = await this.openPanel(trigger);
    await panel.getByRole('button', { name: this.dayLabel(day), exact: true }).click();
  }

  async pickStartDate(day: number) {
    await this.pickDay(this.startDateButton, day);
  }

  async pickEndDate(day: number) {
    await this.pickDay(this.endDateButton, day);
  }

  async selectPrimaryCandidate(name: string) {
    const panel = await this.openPanel(this.primaryCandidateButton);
    await panel.getByRole('button', { name, exact: true }).click();
    await expect(this.primaryCandidateButton).toContainText(name);
  }

  /** The opposition picker is a multi-select that discards its picks unless "Apply selection" is clicked. */
  async selectOppositionCandidates(names: string[]) {
    const panel = await this.openPanel(this.oppositionCandidatesButton);
    for (const name of names) {
      await panel.getByRole('button', { name, exact: true }).click();
    }
    await panel.getByRole('button', { name: 'Apply selection' }).click();
    await expect(this.selectedOpposition.getByRole('listitem')).toHaveCount(names.length);
  }

  async submit() {
    await this.createDraftButton.click();
  }
}

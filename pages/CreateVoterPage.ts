import { expect, Locator, Page } from '@playwright/test';

export type VoterIdentity = {
  fullName: string;
  phone: string;
  gender: string;
  ageBand: string;
  /** Contact details cannot be saved unless consent is captured. */
  consent: string;
};

export type VoterLocation = {
  state: string;
  lga: string;
  /** Typed prefix for the ward, then the exact option to click. */
  wardQuery: string;
  ward: string;
};

export class CreateVoterPage {
  readonly page: Page;
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly stateInput: Locator;
  readonly lgaInput: Locator;
  readonly wardInput: Locator;
  readonly continueButton: Locator;
  readonly createVoterButton: Locator;
  readonly identityHeading: Locator;
  readonly locationHeading: Locator;
  readonly reviewHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.getByLabel('Full name');
    this.phoneInput = page.getByLabel('Phone', { exact: true });
    this.stateInput = page.getByLabel('State', { exact: true });
    this.lgaInput = page.getByLabel('LGA', { exact: true });
    this.wardInput = page.getByLabel('Ward', { exact: true });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.createVoterButton = page.getByRole('button', { name: 'Create Voter' });
    this.identityHeading = page.getByRole('heading', { name: 'Identity' });
    this.locationHeading = page.getByRole('heading', { name: 'Location' });
    this.reviewHeading = page.getByRole('heading', { name: 'Review' });
  }

  private async choose(label: string, option: string) {
    await this.page.getByRole('button', { name: label, exact: true }).click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }

  /** Location fields are cascading autocompletes that only list options once typed into. */
  private async pickFromAutocomplete(input: Locator, typed: string, option: string) {
    await input.fill(typed);
    await this.page.getByRole('option', { name: option, exact: true }).click();
    await expect(input).toHaveValue(option);
  }

  async fillIdentity({ fullName, phone, gender, ageBand, consent }: VoterIdentity) {
    await this.fullNameInput.fill(fullName);
    await this.phoneInput.fill(phone);
    await this.choose('Gender', gender);
    await this.choose('Age band', ageBand);
    await this.choose('Consent status', consent);
  }

  async goToLocation() {
    await this.continueButton.click();
    await expect(this.locationHeading).toBeVisible({ timeout: 30_000 });
  }

  async fillLocation({ state, lga, wardQuery, ward }: VoterLocation) {
    await this.pickFromAutocomplete(this.stateInput, state, state);
    await this.pickFromAutocomplete(this.lgaInput, lga, lga);
    await this.pickFromAutocomplete(this.wardInput, wardQuery, ward);
  }

  async goToReview() {
    await this.continueButton.click();
    await expect(this.reviewHeading).toBeVisible({ timeout: 30_000 });
  }

  async submit() {
    await this.createVoterButton.click();
  }
}

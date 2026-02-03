import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }
  async click(selector: string) {
    await this.page.click(selector);
  }
  async type(selector: string, text: string) {
    await this.page.fill(selector, text);
  }
  async expectVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }
}

import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate (defaults to baseURL)
  async goto(url: string = '/') {
    await this.page.goto(url);
  }

  // Locator getter
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  // Safe click using locator (auto-wait)
  async click(selector: string) {
    await this.page.locator(selector).click();
  }

  // Safe fill using locator
  async type(selector: string, text: string) {
    await this.page.locator(selector).fill(text);
  }

  async expectVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  // New: wait for stable network
  async waitForNetworkIdle() {
    //await this.page.waitForLoadState('networkidle');
  }

  // New: flexible text expectation
  async expectText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  // URL getter
  get url(): string {
    return this.page.url();
  }
}
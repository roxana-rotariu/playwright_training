import { Page, Locator, expect } from "@playwright/test";

/**
 * BasePage provides:
 * - Unified page reference
 * - Smart waits
 * - Safe navigation
 * - Scrolling helpers
 * - Element helpers
 * - Allure-friendly structure
 * - Component compatibility
 */

export class BasePage {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // -------------------------------------------------
  // 🔹 Navigation (ALWAYS use absolute URLs in Demoblaze)
  // -------------------------------------------------
  async gotoAbsolute(url: string) {
    await this.page.goto(url, { timeout: 30000 });
  }

  async gotoHome() {
    await this.page.goto("/", { timeout: 30000 });
  }

  // -------------------------------------------------
  // 🔹 Element utilities
  // -------------------------------------------------
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async click(selector: string) {
    await this.page.locator(selector).click();
  }

  async fill(selector: string, value: string) {
    await this.page.locator(selector).fill(value);
  }

  async expectVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  // -------------------------------------------------
  // 🔹 Smart Wait Helpers (NO networkidle — breaks Demoblaze)
  // -------------------------------------------------
  async waitForDomStable() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async waitForLocator(locator: Locator) {
    await locator.waitFor({ timeout: 15000 });
  }

  // -------------------------------------------------
  // 🔹 Scroll helpers
  // -------------------------------------------------
  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollBy(y: number) {
    await this.page.evaluate((amount) => window.scrollBy(0, amount), y);
  }

  // -------------------------------------------------
  // 🔹 Visibility + existence helpers
  // -------------------------------------------------
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  async waitFor(selector: string) {
    await this.page.locator(selector).waitFor();
  }

  // -------------------------------------------------
  // 🔹 Retry helper for unstable elements
  // -------------------------------------------------
  async retry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        await this.page.waitForTimeout(250);
      }
    }
    throw lastErr;
  }

  // -------------------------------------------------
  // 🔹 URL getter
  // -------------------------------------------------
  get url() {
    return this.page.url();
  }
}

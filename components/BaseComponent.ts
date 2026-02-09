import { Page } from "@playwright/test";

export class BaseComponent {
  constructor(protected page: Page) {}

  async screenshot(name: string) {
    return await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }

  async isVisible(selector: string) {
    return await this.page.locator(selector).isVisible();
  }
}
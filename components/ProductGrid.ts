import { Page, Locator } from "@playwright/test";

export class ProductGrid {

  readonly page: Page;
  readonly productTitles: Locator;
  readonly nextBtn: Locator;
  readonly prevBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitles = page.locator(".hrefch");
    this.nextBtn = page.locator("#next2");
    this.prevBtn = page.locator("#prev2");
  }

  // ------------------------------------------------------
  // Wait until product grid loads at least one tile
  // ------------------------------------------------------
  async waitForLoad() {
    await this.productTitles.first().waitFor({ timeout: 15000 });
  }

  // ------------------------------------------------------
  // List product titles in current grid view
  // ------------------------------------------------------
  async listProductNames(): Promise<string[]> {
    const count = await this.productTitles.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      titles.push(await this.productTitles.nth(i).innerText());
    }

    return titles;
  }

  // ------------------------------------------------------
  // Select product by name (supports pagination)
  // ------------------------------------------------------
  async selectProduct(name: string): Promise<void> {

    // Demoblaze has at most 3 pages for a category
    for (let pageIndex = 0; pageIndex < 3; pageIndex++) {

      // Ensure grid loaded
      await this.waitForLoad();

      // Fresh locator each time (grid redraws often)
      const product = this.page.getByRole("link", { name, exact: true });

      // Try up to 2 clicks on this page
      for (let attempt = 0; attempt < 2; attempt++) {
        if (await product.isVisible().catch(() => false)) {
          try {
            await product.scrollIntoViewIfNeeded();
            await product.click();
            return; // SUCCESS
          } catch {
            await this.page.waitForTimeout(200);
          }
        }
      }

      // Move to next page (if available)
      if (await this.nextBtn.isVisible().catch(() => false)) {
        await this.nextBtn.scrollIntoViewIfNeeded();
        await this.nextBtn.click();
        await this.page.waitForLoadState("domcontentloaded");
        continue;
      }

      break;
    }

    throw new Error(`Product "${name}" could not be found or clicked.`);
  }
}
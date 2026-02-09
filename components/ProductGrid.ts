import { Page, Locator, expect } from "@playwright/test";

export class ProductGrid {

  readonly page: Page;
  readonly productTitles: Locator;
  readonly cards: Locator;
  readonly nextBtn: Locator;
  readonly prevBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Product tile title links
    this.productTitles = page.locator(".hrefch");

    // Full card container
    this.cards = page.locator(".card");

    // Pagination controls
    this.nextBtn = page.locator("#next2");
    this.prevBtn = page.locator("#prev2");
  }

  // -----------------------------
  // INITIAL GRID LOAD
  // -----------------------------
  async waitForLoad() {
    await this.productTitles.first().waitFor({ timeout: 15000 });
  }

  // -----------------------------
  // GET LIST OF PRODUCT NAMES
  // -----------------------------
  async listProductNames(): Promise<string[]> {
    const count = await this.productTitles.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      names.push(await this.productTitles.nth(i).innerText());
    }

    return names;
  }

  // -----------------------------
  // CLICK PRODUCT BY NAME
  // Supports multi-page search (Demoblaze quirk)
  // -----------------------------
  async selectProduct(name: string): Promise<void> {

    // Demoblaze has 1–3 pages depending on category
    for (let pageIndex = 0; pageIndex < 3; pageIndex++) {

      // Ensure grid is loaded
      await this.waitForLoad();

      // Try to find product on this page
      const product = this.page.getByRole("link", { name, exact: true });

      if (await product.isVisible().catch(() => false)) {
        await product.click();
        return;
      }

      // Try next page if available
      if (await this.nextBtn.isVisible().catch(() => false)) {
        await this.nextBtn.click();
        await this.page.waitForLoadState("domcontentloaded");
        continue;
      }

      break;
    }

    throw new Error(`Product "${name}" not found in product grid.`);
  }

  // -----------------------------
  // PAGINATION
  // -----------------------------
  async goNext() {
    if (await this.nextBtn.isVisible()) {
      await this.nextBtn.click();
      await this.page.waitForLoadState("domcontentloaded");
    }
  }

  async goPrev() {
    if (await this.prevBtn.isVisible()) {
      await this.prevBtn.click();
      await this.page.waitForLoadState("domcontentloaded");
    }
  }
}
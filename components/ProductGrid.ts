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
  // Wait for product grid to load its tiles
  // ------------------------------------------------------
  async waitForLoad() {
    await this.productTitles.first().waitFor({ timeout: 15000 });
  }

  // ------------------------------------------------------
  // List all product titles on the current page
  // ------------------------------------------------------
  async listProductNames(): Promise<string[]> {
    const count = await this.productTitles.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(await this.productTitles.nth(i).innerText());
    }
    return names;
  }

  // ------------------------------------------------------
  // Select a product by name with pagination and full
  // CI‑safe anti‑flakiness protections.
  // ------------------------------------------------------
  async selectProduct(name: string): Promise<void> {

    // Demoblaze has up to 3 pagination pages.
    for (let pageIndex = 0; pageIndex < 3; pageIndex++) {

      await this.waitForLoad();

      // Fresh locator each loop (grid re-renders constantly)
      const product = this.page.getByRole("link", { name, exact: true });

      // Try up to 3 robust click attempts on this page
      for (let attempt = 0; attempt < 3; attempt++) {

        if (await product.isVisible().catch(() => false)) {
          try {
            // Scroll into view — fixes CI animation instability
            await product.scrollIntoViewIfNeeded();

            // Wait for DOM stability & visibility (Playwright auto‑wait extended)
            await product.waitFor({ state: "visible", timeout: 5000 });

            // Try clicking — safe click
            await product.click({ timeout: 5000 });

            return; // SUCCESS
          } catch {
            // If click flaked → wait and retry
            await this.page.waitForTimeout(200);
          }
        }
      }

      // --------------------------------------------------
      // Product not found on this page → paginate
      // --------------------------------------------------
      if (await this.nextBtn.isVisible().catch(() => false)) {
        await this.nextBtn.click();
        await this.page.waitForLoadState("domcontentloaded");
        continue;
      }

      break; // No more pages
    }

    throw new Error(`Product "${name}" could not be found or clicked due to grid instability.`);
  }
}
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
  // Wait until product grid finishes re-rendering
  // Samsung specifically needs DOM stability!
  // ------------------------------------------------------
  async waitForGridStability(timeout = 5000) {
    const start = Date.now();
    let previousCount = -1;

    while (Date.now() - start < timeout) {
      const count = await this.productTitles.count();

      if (count === previousCount && count > 0) {
        // stable tile count
        return;
      }

      previousCount = count;
      await this.page.waitForTimeout(150); // allow re-render cycle
    }

    throw new Error("Product grid did not stabilize in time.");
  }

  async waitForLoad() {
    await this.productTitles.first().waitFor({ timeout: 15000 });
    await this.waitForGridStability();
  }

  // ------------------------------------------------------
  // List all product titles on the current page
  // ------------------------------------------------------
  async listProductNames(): Promise<string[]> {
    await this.waitForGridStability();
    const count = await this.productTitles.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      titles.push(await this.productTitles.nth(i).innerText());
    }
    return titles;
  }

  // ------------------------------------------------------
  // Select product by name (CI-stable)
  // ------------------------------------------------------
  async selectProduct(name: string): Promise<void> {

    // Up to 3 pages in Demoblaze
    for (let pageIndex = 0; pageIndex < 3; pageIndex++) {

      await this.waitForLoad();

      const product = this.page.getByRole("link", { name, exact: true });

      if (await product.isVisible().catch(() => false)) {

        // Try clicking safely up to 3 times
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            await product.scrollIntoViewIfNeeded();
            await product.waitFor({ state: "visible", timeout: 3000 });

            // Wait an extra stability window (fix Samsung detach)
            await this.page.waitForTimeout(150);

            await product.click({ timeout: 5000 });
            return;

          } catch {
            await this.page.waitForTimeout(200); // retry click
          }
        }
      }

      // Move to next page only if visible
      if (await this.nextBtn.isVisible().catch(() => false)) {

        // Ensure next button is stable
        await this.page.evaluate(() => window.scrollBy(0, 50));

        // Click next with multiple retries for CI
        for (let i = 0; i < 3; i++) {
          try {
            await this.nextBtn.click({ timeout: 3000 });
            await this.page.waitForLoadState("domcontentloaded");
            await this.waitForGridStability();
            break;
          } catch {
            await this.page.waitForTimeout(200);
          }
        }

        continue;
      }

      break;
    }

    throw new Error(`Product "${name}" could not be found or clicked (grid instability).`);
  }
}
import { Page, Locator } from "@playwright/test";

export class Sidebar {

  readonly page: Page;
  readonly root: Locator;

  // Category links
  readonly phones: Locator;
  readonly laptops: Locator;
  readonly monitors: Locator;

  // Pagination
  readonly nextBtn: Locator;
  readonly prevBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Root sidebar container
    this.root = page.locator("#cat");

    // Categories (Demoblaze menu)
    this.phones = page.getByRole("link", { name: "Phones" });
    this.laptops = page.getByRole("link", { name: "Laptops" });
    this.monitors = page.getByRole("link", { name: "Monitors" });

    // Pagination buttons
    this.nextBtn = page.locator("#next2");
    this.prevBtn = page.locator("#prev2");
  }

  // ---------------------------
  // LOAD & INITIALIZATION
  // ---------------------------

  async waitForLoad() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.root.waitFor({ timeout: 15000 });
  }

  // ---------------------------
  // CATEGORY SELECTION
  // ---------------------------

  async select(category: "Phones" | "Laptops" | "Monitors") {

    // Ensure sidebar is visible
    await this.waitForLoad();
    const categoryApi = this.getCategoryApiValue(category);
    const waitForCategory = this.page.waitForResponse((response) => {
      const request = response.request();
      if (!response.url().includes("bycat") || request.method() !== "POST") {
        return false;
      }
      const postData = request.postData() ?? "";
      return postData.includes(categoryApi);
    }).catch(() => null);

    switch (category) {
      case "Phones":
        await this.phones.click();
        break;
      case "Laptops":
        await this.laptops.click();
        break;
      case "Monitors":
        await this.monitors.click();
        break;
    }

    // After clicking, wait for category response (best signal)
    await waitForCategory;
    await this.page.locator(".hrefch").first().waitFor({ timeout: 15000 });
  }

  // ---------------------------
  // PAGINATION
  // ---------------------------

  async goNextPage() {
    if (await this.nextBtn.isVisible()) {
      await this.nextBtn.click();
      await this.page.waitForLoadState("domcontentloaded");
    }
  }

  async goPrevPage() {
    if (await this.prevBtn.isVisible()) {
      await this.prevBtn.click();
      await this.page.waitForLoadState("domcontentloaded");
    }
  }

  private getCategoryApiValue(category: "Phones" | "Laptops" | "Monitors"): string {
    switch (category) {
      case "Phones":
        return "phone";
      case "Laptops":
        return "notebook";
      case "Monitors":
        return "monitor";
    }
  }
}

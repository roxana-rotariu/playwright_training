import { Page, Locator, expect } from "@playwright/test";

export class CartTable {

  readonly page: Page;

  // Table root
  readonly tableBody: Locator;
  readonly rows: Locator;
  readonly deleteLinks: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    this.page = page;

    this.tableBody = page.locator("#tbodyid");

    // Cart table rows
    this.rows = page.locator("#tbodyid > tr");

    // Delete links
    this.deleteLinks = page.getByRole("link", { name: "Delete" });

    // Total price
    this.total = page.locator("#totalp");
  }

  // ---------------------------
  // Wait until cart is visible
  // ---------------------------
  async waitForLoad() {
    await this.tableBody.waitFor({ state: "attached", timeout: 15000 });
    if ((await this.rows.count()) > 0) {
      await this.rows.first().waitFor({ timeout: 15000 });
    }
  }

  // ---------------------------
  // Returns list of product names
  // ---------------------------
  async listItems(): Promise<string[]> {
    const count = await this.rows.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await this.rows.nth(i).locator("td").nth(1).innerText();
      names.push(text.trim());
    }

    return names;
  }

  // ---------------------------
  // Returns cart total
  // ---------------------------
  async getTotal(): Promise<number> {
    await expect.poll(async () => {
      const count = await this.rows.count();
      const text = await this.total.innerText();
      const value = Number(text || "0");
      return count > 0 ? value : 0;
    }, { timeout: 15000 }).toBeGreaterThan(0);
    const text = await this.total.innerText();
    return Number(text);
  }

  // ---------------------------
  // Remove product by name
  // ---------------------------
  async removeItem(name: string) {
    const count = await this.rows.count();

    for (let i = 0; i < count; i++) {
      const row = this.rows.nth(i);
      const productName = await row.locator("td").nth(1).innerText();

      if (productName.trim() === name) {
        await row.getByRole("link", { name: "Delete" }).click();

        // Wait for item to disappear
        await this.page.waitForTimeout(300);
        return;
      }
    }

    throw new Error(`Item "${name}" not found in cart table`);
  }

  // ---------------------------
  // Remove ALL products
  // ---------------------------
  async clearCart() {
    // Re-evaluate rows after each delete to avoid index drift
    while (await this.rows.count()) {
      await this.deleteLinks.first().click().catch(() => {});
      await this.page.waitForTimeout(200);
    }
  }

  // ---------------------------
  // Assert an item is present
  // ---------------------------
  async expectItem(name: string) {
    await expect.poll(async () => this.listItems(), { timeout: 15000 }).toContain(name);
  }

  // ---------------------------
  // Assert cart is empty
  // ---------------------------
  async expectEmpty() {
    await expect(this.rows).toHaveCount(0);
  }
}

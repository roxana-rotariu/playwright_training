import { Page, Locator, expect } from "@playwright/test";

export class CartTable {

  readonly page: Page;

  // Table root
  readonly rows: Locator;
  readonly deleteLinks: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    this.page = page;

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
    await this.rows.first().waitFor({ timeout: 15000 }).catch(() => {});
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
    const count = await this.rows.count();

    for (let i = 0; i < count; i++) {
      await this.deleteLinks.nth(i).click().catch(() => {});
      await this.page.waitForTimeout(200);
    }
  }

  // ---------------------------
  // Assert an item is present
  // ---------------------------
  async expectItem(name: string) {
    const items = await this.listItems();
    expect(items).toContain(name);
  }

  // ---------------------------
  // Assert cart is empty
  // ---------------------------
  async expectEmpty() {
    await expect(this.rows).toHaveCount(0);
  }
}
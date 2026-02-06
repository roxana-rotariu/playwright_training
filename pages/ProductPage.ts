import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
    productTitle = this.page.locator(".name");
    productPrice = this.page.locator(".price-container");
    addToCartButton = this.page.getByRole("link", { name: "Add to cart" });

    async addToCart(): Promise<void> {
        // First expected alert
        const dialog1 = this.page.waitForEvent("dialog");

        await this.addToCartButton.click({ noWaitAfter: true });

        // const first = await dialog1;
        // await first.accept();

        // 🔥 Nokia lumia 1520 BUG: sometimes fires a second alert or delayed dialog
        // We try to capture it, but DO NOT fail if it's not there.
        try {
            const dialog2 = await this.page.waitForEvent("dialog", {
                timeout: 1000,
            });
            await dialog2.accept();
        } catch {
            // No second alert — normal
        }

        // Small stabilization delay
        await this.page.waitForTimeout(200);
    }

    async expectAddToCartAlert(): Promise<void> {
        const dialogPromise = this.page.waitForEvent("dialog");

        const dialog = await dialogPromise;
        expect(dialog.message()).toContain("Product added");
        await dialog.accept();
    }

    async getProductPrice(): Promise<number> {
        const text = await this.productPrice.innerText();
        const match = text.match(/\d+/);
        return match ? Number(match[0]) : 0;
    }
}

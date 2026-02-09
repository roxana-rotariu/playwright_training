import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * ProductPage — Stable, component-ready version
 * Handles:
 * - Product title & price visibility
 * - Reliable add-to-cart with double-alert fix
 * - Product page validation
 */
export class ProductPage extends BasePage {
    readonly productTitle = this.page.locator(".name");
    readonly productPrice = this.page.locator(".price-container");
    readonly addToCartButton = this.page.getByRole("link", {
        name: "Add to cart",
    });

    constructor(page: Page) {
        super(page);
    }

    // 🔹 Ensure the product page is fully loaded
    async waitForProductPage() {
        await this.productTitle.waitFor({ timeout: 15000 });
        await this.productPrice.waitFor({ timeout: 15000 });
    }

    /**
     * 🚀 Stable add-to-cart handler with full alert handling.
     * Handles:
     * - Normal Demoblaze alert
     * - Nokia double-alert bug
     * - Slow-delayed alert
     */
    async addToCart(): Promise<void> {
        await this.waitForProductPage();

        let handled = false;

        const dialogPromise = new Promise<void>((resolve) => {
            this.page.once("dialog", async (dialog) => {
                if (!handled) {
                    handled = true;
                    try {
                        await dialog.accept();
                    } catch {}
                }
                resolve();
            });
        });

        await this.addToCartButton.click();

        // Wait for expected alert
        await dialogPromise;

        // Try to catch an optional 2nd alert (Nokia bug)
        try {
            const second = await this.page.waitForEvent("dialog", {
                timeout: 400,
            });
            if (!handled) {
                handled = true;
                try {
                    await second.accept();
                } catch {}
            } else {
                // Already handled first, so safely ignore second
                try {
                    await second.dismiss();
                } catch {}
            }
        } catch {
            // No second dialog — normal
        }

        await this.page.waitForTimeout(200);
    }

    /**
     * Verify product page loaded with correct product
     */
    async expectProductTitle(name: string) {
        await this.waitForProductPage();
        await expect(this.productTitle).toHaveText(name);
    }

    /**
     * Returns numeric product price
     */
    async getProductPrice(): Promise<number> {
        await this.productPrice.waitFor();
        const raw = await this.productPrice.innerText();
        const match = raw.match(/\d+/);
        return match ? Number(match[0]) : 0;
    }
}

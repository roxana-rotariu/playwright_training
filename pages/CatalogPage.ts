import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";
import type { Category } from "../fixtures/types";

export class CatalogPage extends BasePage {
    // async selectProduct(productName: string): Promise<void> {
    //     const product = this.page.getByRole("link", { name: productName });
    //     await expect(product).toBeVisible();
    //     await product.click();
    // }

    async waitForCatalog() {
        const phones = this.page.getByRole("link", { name: "Phones" });
        await expect(phones).toBeVisible({ timeout: 15000 });

        await phones.click();

        await expect(this.page.locator(".card").first()).toBeVisible({
            timeout: 15000,
        });
    }
    async selectProduct(productName: string) {
        const categories = ["Phones", "Laptops", "Monitors"];

        for (const category of categories) {
            // Go to category
            await this.page.getByRole("link", { name: category }).click();

            // Always reset pagination (ignore if disabled)
            const prevBtn = this.page.locator("#prev2");
            if (await prevBtn.isVisible()) {
                await prevBtn.click();
            }

            while (true) {
               const product = this.page.locator(".hrefch", {
                    hasText: productName,
                });

                try {
                    await product.waitFor({ timeout: 1000 });
                    await product.click();
                    return;
                } catch {
                    // product not on this page → continue pagination
                }

                const nextBtn = this.page.locator("#next2");

                // If no next page → stop searching this category
                if (!(await nextBtn.isVisible())) {
                    break;
                }

                await nextBtn.click();
                await this.page.waitForTimeout(300); // allow product grid to refresh
            }
        }

        throw new Error(
            `Product "${productName}" not found in any category page`,
        );
    }

    async filterCategory(category: Category) {
        // Always normalize state
        await this.page.goto("/");
        await this.waitForCatalog();

        const categoryLink = this.page.getByRole("link", { name: category });
        await categoryLink.click();
    }

    async listProducts(): Promise<string[]> {
        const items = this.page.locator(".hrefch");
        const count = await items.count();

        const productNames: string[] = [];
        for (let i = 0; i < count; i++) {
            productNames.push(await items.nth(i).innerText());
        }

        return productNames;
    }
}

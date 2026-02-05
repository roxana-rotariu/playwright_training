import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";
import type { Category } from "../fixtures/types";

export class CatalogPage extends BasePage {

    async selectProduct(productName: string): Promise<void> {
        const product = this.page.getByRole('link', { name: productName });
        await expect(product).toBeVisible();
        await product.click();
    }

    async filterCategory(category: Category) {
        const categoryLink = this.page.getByRole('link', { name: category });
        await categoryLink.click();
    }

    async listProducts(): Promise<string[]> {
        const items = this.page.locator('.hrefch');
        const count = await items.count();

        const productNames: string[] = [];
        for (let i = 0; i < count; i++) {
            productNames.push(await items.nth(i).innerText());
        }

        return productNames;
    }
}
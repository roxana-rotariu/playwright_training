import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
    productTitle    = this.page.locator(".name");
    productPrice    = this.page.locator(".price-container");
    addToCartButton = this.page.getByRole('link', { name: 'Add to cart' });

    async addToCart(): Promise<void> {
        await expect(this.addToCartButton).toBeVisible();
        await this.addToCartButton.click();
    }

    async expectAddToCartAlert(): Promise<void> {
        const dialogPromise = this.page.waitForEvent('dialog');

        const dialog = await dialogPromise;
        expect(dialog.message()).toContain('Product added');
        await dialog.accept();
    }

    async getProductPrice(): Promise<number> {
        const text = await this.productPrice.innerText();
        const match = text.match(/\d+/);
        return match ? Number(match[0]) : 0;
    }
}
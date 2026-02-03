import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
    productTitle    = this.page.locator(".name");
    productPrice    = this.page.locator(".price-container");
    addToCartButton = this.page.locator('a', {hasText: 'Add to cart'});

    async addToCart() {
        await this.addToCartButton.click();
    }

    async expectaddToCartAlert() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Product added');
            await dialog.accept();
        });
        //wait for dialog to close
        await this.page.waitForTimeout(1000);
    }
}
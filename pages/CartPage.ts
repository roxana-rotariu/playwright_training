import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class CartPage extends BasePage {

    rows = this.page.locator("#tbodyid > tr");
    totalPrice = this.page.locator("#totalp");
    placeOrderButton = this.page.getByRole('button', { name: 'Place Order' });

    async gotoCart(): Promise<void> {
        await this.page.goto("/cart.html");
        //await this.page.waitForLoadState('networkidle');
    }

    async removeProduct(productName: string): Promise<void> {
        const row = this.rows.filter({
            has: this.page.locator('td:nth-child(2)', { hasText: productName })
        });

        await expect(row).toHaveCount(1);

        const deleteLink = row.locator('a', { hasText: 'Delete' });
        await expect(deleteLink).toBeVisible();

        await deleteLink.click();

        // Wait for the product row to disappear
        await expect(row).toHaveCount(0);
    }

    async getTotalPrice(): Promise<number> {
        await expect(this.totalPrice).toBeVisible();

        const text = await this.totalPrice.innerText();
        const match = text.match(/[\d,.]+/);

        return match ? Number(match[0].replace(',', '')) : 0;
    }

    async openPlaceOrder(): Promise<void> {
        await expect(this.placeOrderButton).toBeVisible();
        await this.placeOrderButton.click();
    }

    // Highly recommended helper for cleanup
    async clearCart(): Promise<void> {
        const count = await this.rows.count();
        for (let i = 0; i < count; i++) {
            const row = this.rows.nth(0);
            const deleteLink = row.locator('a', { hasText: 'Delete' });
            await deleteLink.click();
            await row.waitFor({ state: 'detached' });
        }
    }
}
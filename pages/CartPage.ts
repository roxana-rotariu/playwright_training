import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
    rows = this.page.locator("#tbodyid > tr");
    async gotoCart() {
        await this.page.goto("/cart.html");
    }
    async removeProduct(productName: string) {
        const row = this.rows.filter({ has: this.page.locator('td:nth-child(2)', { hasText: productName }) });
        await row.locator('a', { hasText: 'Delete' }).click();
    }
    async getTotalPrice(): Promise<number> {
    const text = await this.page.locator("#totalp").innerText();
    const match = text.match(/[\d,.]+/);
    return match ? Number(match[0].replace(',', '')) : 0;
    }
    async openPlaceOrderModal() {
        await this.page.locator("button", { hasText: "Place Order" }).click();
    }
}
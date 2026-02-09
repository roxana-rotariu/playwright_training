import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CartTable } from "../components/CartTable";

export class CartPage extends BasePage {

    table: CartTable;

    constructor(page: Page) {
        super(page);
        this.table = new CartTable(page);
    }

    /**
     * Navigate to the cart page and wait for table to appear.
     */
    async gotoCart(): Promise<void> {
        // Use absolute URL for CI safety
        await this.page.goto("https://www.demoblaze.com/cart.html", {
            timeout: 30000
        });

        await this.table.waitForLoad();
    }

    /**
     * Remove a specific product by name using CartTable component.
     */
    async removeProduct(productName: string): Promise<void> {
        await this.table.removeItem(productName);
    }

    /**
     * Return current cart total.
     */
    async getTotalPrice(): Promise<number> {
        return await this.table.getTotal();
    }

    /**
     * Clicks the Place Order button
     */
    async openPlaceOrder(): Promise<void> {
        await this.page.getByRole("button", { name: "Place Order" }).click();
    }

    /**
     * Clear the entire cart (useful for cleanup)
     */
    async clearCart(): Promise<void> {
        await this.table.clearCart();
    }

    /**
     * Make CartPage.rows still available for tests using it
     */
    get rows() {
        return this.table.rows;
    }
}
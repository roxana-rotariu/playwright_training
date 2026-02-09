import { Page, Locator } from "@playwright/test";

export class ProductGrid {
    readonly page: Page;
    readonly productTitles: Locator;
    readonly nextBtn: Locator;
    readonly prevBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTitles = page.locator(".hrefch");
        this.nextBtn = page.locator("#next2");
        this.prevBtn = page.locator("#prev2");
    }

    // ------------------------------------------------------
    // Wait until product grid loads at least one tile
    // ------------------------------------------------------
    async waitForLoad() {
        await this.productTitles.first().waitFor({ timeout: 15000 });
    }

    // ------------------------------------------------------
    // List product titles in current grid view
    // ------------------------------------------------------
    async listProductNames(): Promise<string[]> {
        const count = await this.productTitles.count();
        const titles: string[] = [];

        for (let i = 0; i < count; i++) {
            titles.push(await this.productTitles.nth(i).innerText());
        }

        return titles;
    }

    // ------------------------------------------------------
    // Select product by name (supports pagination)
    // ------------------------------------------------------
    async selectProduct(productName: string): Promise<void> {
        let previousProductCount = 0;

        while (true) {
            // 1️⃣ Try to find the product on the current page
            const product = this.productTitles.filter({ hasText: productName });

            if ((await product.count()) > 0) {
                await product.first().click();
                return;
            }

            // 2️⃣ Detect end of pagination by product count
            const currentProductCount = await this.productTitles.count();

            if (currentProductCount === previousProductCount) {
                break; // No new products loaded → last page
            }

            previousProductCount = currentProductCount;

            // 3️⃣ Move to next page if possible
            if (!(await this.nextBtn.isVisible())) {
                break;
            }

            await this.nextBtn.click();

            // Wait for catalog to refresh
            await this.page.waitForLoadState("networkidle");
        }

        throw new Error(`Product not found in catalog: ${productName}`);
    }
}

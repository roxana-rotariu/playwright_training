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
        await this.waitForGridToSettle();
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
        await this.waitForLoad();
        let previousKey = "";
        let pageTurns = 0;
        const maxPageTurns = 10;

        while (true) {
            // 1️⃣ Try to find the product on the current page
            const product = this.productTitles.filter({ hasText: productName });

            if ((await product.count()) > 0) {
                await this.clickProduct(productName);
                return;
            }

            // 2️⃣ Detect end of pagination by content key
            const currentKey = await this.getGridKey();
            if (currentKey && currentKey === previousKey) {
                break; // No new products loaded → last page
            }
            previousKey = currentKey;

            // 3️⃣ Move to next page if possible
            if (!(await this.nextBtn.isVisible())) {
                break;
            }

            await this.nextBtn.click();

            // Wait for catalog to refresh (avoid networkidle on Demoblaze)
            await this.page.waitForLoadState("domcontentloaded");
            await this.productTitles.first().waitFor({ timeout: 15000 });
            await this.waitForGridToSettle();

            pageTurns += 1;
            if (pageTurns >= maxPageTurns) {
                break; // avoid infinite pagination loops
            }
        }

        throw new Error(`Product not found in catalog: ${productName}`);
    }

    /**
     * Click a product tile and wait for product page shell to load.
     */
    async clickProduct(productName: string): Promise<void> {
        const product = this.productTitles.filter({ hasText: productName });
        await this.waitForGridToSettle();
        await product.first().scrollIntoViewIfNeeded();
        try {
            await product.first().click({ timeout: 10000 });
        } catch {
            // Grid re-renders can keep elements "unstable"; fall back to a forced click.
            await product.first().click({ timeout: 10000, force: true });
        }
        await this.page.waitForLoadState("domcontentloaded");
    }

    private async waitForGridToSettle(): Promise<void> {
        const timeoutMs = 15000;
        const stableForMs = 300;
        const pollMs = 100;
        const start = Date.now();
        let lastKey = "";
        let stableSince = Date.now();

        while (Date.now() - start < timeoutMs) {
            const count = await this.productTitles.count();
            const firstText = count > 0
                ? (await this.productTitles.first().textContent())?.trim() ?? ""
                : "";
            const key = `${count}:${firstText}`;

            if (count > 0 && key === lastKey) {
                if (Date.now() - stableSince >= stableForMs) {
                    return;
                }
            } else {
                lastKey = key;
                stableSince = Date.now();
            }

            await this.page.waitForTimeout(pollMs);
        }

        throw new Error("Product grid did not settle in time.");
    }

    private async getGridKey(): Promise<string> {
        const count = await this.productTitles.count();
        const firstText = count > 0
            ? (await this.productTitles.first().textContent())?.trim() ?? ""
            : "";
        return `${count}:${firstText}`;
    }
}


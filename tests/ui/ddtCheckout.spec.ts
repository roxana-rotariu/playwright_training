import { test, expect } from "../../fixtures/baseTest";
import productsJson from "../../test-data/products.json";
import type { Category } from "../../fixtures/types";

test.describe("Data-driven checkout", () => {

    // test.beforeEach(async ({ page }) => {
    //     // ⭐ Reset JS context to avoid Demoblaze alert race condition
    //     await page.reload({ timeout: 30000 });
    // });

    for (const item of productsJson as { name: string; category: Category }[]) {

        test(`checkout with product: ${item.name}`, async ({
            catalogPage,
            productPage,
            cartPage,
            homePage
        }) => {

            await homePage.gotoHome();
            await catalogPage.waitForCatalog();

            await catalogPage.filterCategory(item.category);

            // Wait for product grid to fully load
            await expect(catalogPage.page.locator('.hrefch').first())
              .toBeVisible({ timeout: 15000 });

            // Use pagination-aware product finder
            await catalogPage.selectProduct(item.name);

            // Validate product page loaded
            await expect(productPage.productTitle).toHaveText(item.name);

            // Add to cart
            await productPage.addToCart();

            // Go to cart
            await cartPage.gotoCart();

            // Validate item in cart
            await expect(cartPage.rows).toContainText(item.name);
        });
    }
});
import { test, expect } from "../../fixtures/baseTest";
import productsJson from "../../test-data/products.json";
import type { Category } from "../../fixtures/types";

type ProductItem = {
  name: string;
  category: Category;
};

const products = productsJson as ProductItem[];

test.describe.parallel("Data-driven checkout", () => {
    for (const item of products) {

        test(`checkout with product: ${item.name}`, async ({
            catalogPage,
            productPage,
            cartPage,
        }) => {

            // Select the correct category BEFORE selecting product
            await catalogPage.filterCategory(item.category);

            // Open product
            await catalogPage.selectProduct(item.name);

            // Validate the product page is correct
            await expect(productPage.productTitle).toHaveText(item.name);

            // Add to cart — alert handled inside POM
            await productPage.addToCart();

            // Go to cart and validate
            await cartPage.gotoCart();
            await expect(cartPage.rows).toContainText(item.name);
        });
    }
});
import { test, expect } from "../../fixtures/dataFixtures";
import products from "../../test-data/products.json";

test.describe.parallel("Data-driven checkout", () => {
    products.forEach((product) => {
        test(`checkout with product: ${product}`, async ({
            homePage,
            catalogPage,
            productPage,
            cartPage,
        }) => {
            await homePage.gotoHome();
            await catalogPage.selectedProduct(product);
            await productPage.addToCart();
            await productPage.expectaddToCartAlert();

            await cartPage.gotoCart();
            await expect(cartPage.rows).toContainText(product);
        });
    });
});

test.only("checkout", async ({
    homePage,
    catalogPage,
    productPage,
    cartPage,
    productName,
}) => {
    await homePage.gotoHome();
    await catalogPage.selectedProduct(productName);
    await productPage.addToCart();
    await productPage.expectaddToCartAlert();

    await cartPage.gotoCart();
    await expect(cartPage.rows).toContainText(productName);
});

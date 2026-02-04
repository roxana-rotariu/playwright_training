import { setup as test, expect } from "../../tests/ui/setup";
import products from "../../test-data/products.json";

test.describe.parallel("Data-driven checkout", () => {
    products.forEach((product) => {
        test(`checkout with product: ${product}`, async ({
            homePage,
            catalogPage,
            productPage,
            cartPage,
        }) => {
            await catalogPage.selectedProduct(product);
            await productPage.addToCart();
            await productPage.expectaddToCartAlert();

            await cartPage.gotoCart();
            await expect(cartPage.rows).toContainText(product);
        });
    });
});

test("checkout", async ({
    homePage,
    catalogPage,
    productPage,
    cartPage,
    productName,
}) => {
    await catalogPage.selectedProduct(productName);
    await productPage.addToCart();
    await productPage.expectaddToCartAlert();

    await cartPage.gotoCart();
    await expect(cartPage.rows).toContainText(productName);
});

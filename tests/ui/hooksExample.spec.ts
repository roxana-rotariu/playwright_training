import { setup as test, expect } from "./setup";

test.describe("Cart flow", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => localStorage.clear());
    });

    test("test1", async ({ catalogPage, productPage, cartPage }) => {
        await catalogPage.selectedProduct("Nokia lumia 1520");

        await productPage.addToCart();
        await productPage.expectaddToCartAlert();
        const productPrice = await productPage.getProductPrice();

        await cartPage.gotoCart();
        await expect
            .poll(async () => {
                return Number(await cartPage.getTotalPrice());
            })
            .toBe(productPrice);
    });

    test("test2", async ({ catalogPage, productPage, cartPage }) => {
        await catalogPage.selectedProduct("Samsung galaxy s6");

        await productPage.addToCart();
        await productPage.expectaddToCartAlert();
        const productPrice = await  productPage.getProductPrice();

        await cartPage.gotoCart();
        await expect
            .poll(async () => {
                return Number(await cartPage.getTotalPrice());
            })
            .toBe(productPrice);
    });
});

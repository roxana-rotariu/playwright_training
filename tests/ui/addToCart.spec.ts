import { test, expect } from "../../fixtures/baseTest";

test('user can add a laptop to the cart', async ({ catalogPage, productPage }) => {

    // Filter category
    await catalogPage.filterCategory('Laptops');

    // Select product
    await catalogPage.selectProduct('Sony vaio i5');

    // Assert product page is correct
    await expect(productPage.productTitle).toHaveText('Sony vaio i5');

    // Add to cart (alert handled inside addToCart)
    await productPage.addToCart();
});
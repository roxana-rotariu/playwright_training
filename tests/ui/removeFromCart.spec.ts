import { test, expect } from "../../fixtures/baseTest";

test('remove a product from cart', async ({ catalogPage, productPage, cartPage }) => {

    // Filter category first
    await catalogPage.filterCategory('Phones');

    // Choose the product
    await catalogPage.selectProduct('Nokia lumia 1520');
    await expect(productPage.productTitle).toHaveText('Nokia lumia 1520');

    // Add to cart (alert handled internally)
    await productPage.addToCart();

    // Go to cart
    await cartPage.gotoCart();

    // Validate product is in the cart
    await expect(cartPage.rows).toContainText('Nokia lumia 1520');

    // Remove the product
    await cartPage.removeProduct('Nokia lumia 1520');

    // Validate the cart is empty
    await expect(cartPage.rows).toHaveCount(0);
});
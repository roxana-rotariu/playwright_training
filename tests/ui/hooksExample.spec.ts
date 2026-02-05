import { test, expect } from "../../fixtures/baseTest";

const products = [
    "Nokia lumia 1520",
    "Samsung galaxy s6"
];

test.describe("Cart flow", () => {

    for (const product of products) {
        
        test(`verify cart total equals product price for: ${product}`, async ({
            catalogPage,
            productPage,
            cartPage
        }) => {

            // Ensure correct category
            await catalogPage.filterCategory("Phones");

            // Open product
            await catalogPage.selectProduct(product);

            // Get product price from product page
            const productPrice = await productPage.getProductPrice();

            // Add to cart — dialog handled inside POM
            await productPage.addToCart();

            // Go to cart
            await cartPage.gotoCart();

            // Verify cart total matches product price
            await expect.poll(async () => {
                return await cartPage.getTotalPrice();
            }).toBe(productPrice);
        });

    }

});
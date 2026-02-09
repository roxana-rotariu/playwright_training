import { test, expect } from "../../fixtures/baseTest";

const products = [
  "Nokia lumia 1520",
  "Samsung galaxy s6"
];

test.describe("Cart flow", () => {

  for (const name of products) {

    test(`verify cart total equals product price for: ${name}`, async ({
      homePage, catalogPage, productPage, cartPage
    }) => {

      await homePage.gotoHome();

      await catalogPage.filterCategory("Phones");
      await catalogPage.findAndSelectProduct(name);

      const price = await productPage.getProductPrice();
      await productPage.addToCart();

      await cartPage.gotoCart();

      const total = await cartPage.getTotalPrice();
      expect(total).toBe(price);
    });
  }
});
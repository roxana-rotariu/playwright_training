import { test, expect } from "../../fixtures/baseTest";
import { AllureHelper } from "../../utils/allureHelper";

const products = [
  "Nokia lumia 1520",
  "Samsung galaxy s6"
];

test.describe("Cart flow", () => {

  for (const name of products) {

    test(`verify cart total equals product price for: ${name}`, async ({
      homePage, catalogPage, productPage, cartPage
    }) => {

      AllureHelper.epic("Shopping Cart");
      AllureHelper.feature("Cart total validation");
      AllureHelper.story(`Cart total equals product price for ${name}`);
      AllureHelper.severity("normal");

      await AllureHelper.step("Navigate to homepage", async () => {
        await homePage.gotoHome();
      });

      await AllureHelper.step("Select product from catalog", async () => {
        await catalogPage.filterCategory("Phones");
        await catalogPage.findAndSelectProduct(name);
      });

      const price = await AllureHelper.step("Capture price and add to cart", async () => {
        const value = await productPage.getProductPrice();
        await productPage.addToCart();
        return value;
      });

      await AllureHelper.step("Verify cart total", async () => {
        await cartPage.gotoCart();
        const total = await cartPage.getTotalPrice();
        expect(total).toBe(price);
      });
    });
  }
});

import { test, expect } from "../../fixtures/baseTest";
import { AllureHelper } from "../../utils/allureHelper";

test("user can add a laptop to the cart", async ({ homePage, catalogPage, productPage, cartPage }) => {

  AllureHelper.epic("Shopping Cart");
  AllureHelper.feature("Add to cart");
  AllureHelper.story("Add a laptop to the cart");
  AllureHelper.severity("critical");

  await AllureHelper.step("Navigate to homepage", async () => {
    await homePage.gotoHome();
  });

  await AllureHelper.step("Select product from catalog", async () => {
    await catalogPage.filterCategory("Laptops");
    await catalogPage.findAndSelectProduct("Sony vaio i5");
    await productPage.expectProductTitle("Sony vaio i5");
  });

  await AllureHelper.step("Add product to cart", async () => {
    await productPage.addToCart();
  });

  await AllureHelper.step("Verify cart contains product", async () => {
    await cartPage.gotoCart();
    await cartPage.table.expectItem("Sony vaio i5");
  });
});

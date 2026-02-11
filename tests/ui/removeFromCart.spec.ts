import { test, expect } from "../../fixtures/baseTest";
import { AllureHelper } from "../../utils/allureHelper";

test("remove a product from cart", async ({ homePage, catalogPage, productPage, cartPage }) => {

  AllureHelper.epic("Shopping Cart");
  AllureHelper.feature("Remove from cart");
  AllureHelper.story("Remove a product from cart");
  AllureHelper.severity("critical");

  await AllureHelper.step("Navigate to homepage", async () => {
    await homePage.gotoHome();
  });

  await AllureHelper.step("Add product to cart", async () => {
    await catalogPage.filterCategory("Phones");
    await catalogPage.findAndSelectProduct("Nokia lumia 1520");
    await productPage.addToCart();
  });

  await AllureHelper.step("Verify product in cart", async () => {
    await cartPage.gotoCart();
    await cartPage.table.expectItem("Nokia lumia 1520");
  });

  await AllureHelper.step("Remove product and verify cart empty", async () => {
    await cartPage.table.removeItem("Nokia lumia 1520");
    await cartPage.table.expectEmpty();
  });
});

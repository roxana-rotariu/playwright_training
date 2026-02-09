import { test, expect } from "../../fixtures/baseTest";

test("user can add a laptop to the cart", async ({ homePage, catalogPage, productPage, cartPage }) => {

  await homePage.gotoHome();

  await catalogPage.filterCategory("Laptops");
  await catalogPage.findAndSelectProduct("Sony vaio i5");

  await productPage.expectProductTitle("Sony vaio i5");

  await productPage.addToCart();

  await cartPage.gotoCart();
  await cartPage.table.expectItem("Sony vaio i5");
});
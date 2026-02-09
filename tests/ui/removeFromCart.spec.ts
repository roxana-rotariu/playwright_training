import { test, expect } from "../../fixtures/baseTest";

test("remove a product from cart", async ({ homePage, catalogPage, productPage, cartPage }) => {

  await homePage.gotoHome();

  await catalogPage.filterCategory("Phones");
  await catalogPage.findAndSelectProduct("Nokia lumia 1520");
  await productPage.addToCart();

  await cartPage.gotoCart();
  await cartPage.table.expectItem("Nokia lumia 1520");

  await cartPage.table.removeItem("Nokia lumia 1520");
  await cartPage.table.expectEmpty();
});
import { test, expect } from "../../../fixtures/baseTest";

test.describe("Visual Regression – Cart Page", () => {

  test("empty cart snapshot @visual", async ({ page, homePage, cartPage }) => {

    await homePage.gotoHome();

    await cartPage.gotoCart();
    await cartPage.table.waitForLoad();

    expect(await page.screenshot()).toMatchSnapshot("empty-cart.png");
  });

  test("cart with Samsung snapshot @visual", async ({
    homePage,
    catalogPage,
    productPage,
    cartPage,
    page,
  }) => {

    await homePage.gotoHome();

    await catalogPage.findAndSelectProduct("Samsung galaxy s6");
    await productPage.addToCart();

    await cartPage.gotoCart();

    expect(await page.screenshot())
      .toMatchSnapshot("cart-with-samsung.png");
  });

});
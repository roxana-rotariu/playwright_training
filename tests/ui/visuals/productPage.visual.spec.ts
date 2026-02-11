import { test, expect } from "../../../fixtures/baseTest";

test.describe("Visual Regression – Product Page", () => {

  test("Samsung galaxy s6 product page @visual", async ({
    page,
    homePage,
    catalogPage,
    productPage
  }) => {

    await homePage.gotoHome();

    await page.setViewportSize({ width: 1280, height: 800 });

    // Find and open Samsung product
    await catalogPage.findAndSelectProduct("Samsung galaxy s6");

    await productPage.waitForProductPage();

    // Mask footer (dynamic)
    const mask = [
      page.locator("footer")
    ];

    await page.waitForTimeout(200);

    expect(await page.screenshot({ mask }))
      .toMatchSnapshot("product-samsung.png");
  });

});
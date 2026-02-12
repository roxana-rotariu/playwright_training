import { test, expect } from "../../../fixtures/baseTest";
import { AllureHelper } from "../../../utils/allureHelper";

test.describe("Visual Regression – Cart Page", () => {

  test("empty cart snapshot @visual", async ({ page, homePage, cartPage }) => {

    AllureHelper.epic("Visual Regression");
    AllureHelper.feature("Cart Page");
    AllureHelper.story("Empty cart snapshot");
    AllureHelper.severity("minor");

    await AllureHelper.step("Navigate to homepage", async () => {
      await homePage.gotoHome();
    });

    await AllureHelper.step("Set viewport size", async () => {
      await page.setViewportSize({ width: 1280, height: 800 });
    });

    await AllureHelper.step("Open cart page", async () => {
      await cartPage.gotoCart();
      await cartPage.table.waitForLoad();
    });

    const mask = [
      page.locator("footer")
    ];

    await AllureHelper.step("Capture snapshot", async () => {
      await page.waitForTimeout(200);
      expect(await page.screenshot({ animations: "disabled", mask }))
        .toMatchSnapshot("empty-cart.png", { maxDiffPixels: 25 });
    });
  });

  test("cart with Samsung snapshot @visual", async ({
    homePage,
    catalogPage,
    productPage,
    cartPage,
    page,
  }) => {

    AllureHelper.epic("Visual Regression");
    AllureHelper.feature("Cart Page");
    AllureHelper.story("Cart with product snapshot");
    AllureHelper.severity("minor");

    await AllureHelper.step("Navigate to homepage", async () => {
      await homePage.gotoHome();
    });

    await AllureHelper.step("Set viewport size", async () => {
      await page.setViewportSize({ width: 1280, height: 800 });
    });

    await AllureHelper.step("Add product to cart", async () => {
      await catalogPage.findAndSelectProduct("Samsung galaxy s6");
      await productPage.addToCart();
    });

    await AllureHelper.step("Open cart page", async () => {
      await cartPage.gotoCart();
    });

    await AllureHelper.step("Capture snapshot", async () => {
      await page.waitForTimeout(200);
      await cartPage.table.waitForLoad();
      const cartContent = page.locator("#page-wrapper");
      expect(await cartContent.screenshot({ animations: "disabled" }))
        .toMatchSnapshot("cart-with-samsung.png", { maxDiffPixels: 25 });
    });
  });

});

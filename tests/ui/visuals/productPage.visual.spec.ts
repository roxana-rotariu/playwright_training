import { test, expect } from "../../../fixtures/baseTest";
import { AllureHelper } from "../../../utils/allureHelper";

test.describe("Visual Regression – Product Page", () => {

  test("Samsung galaxy s6 product page @visual", async ({
    page,
    homePage,
    catalogPage,
    productPage
  }) => {

    AllureHelper.epic("Visual Regression");
    AllureHelper.feature("Product Page");
    AllureHelper.story("Samsung product page snapshot");
    AllureHelper.severity("minor");

    await AllureHelper.step("Navigate to homepage", async () => {
      await homePage.gotoHome();
    });

    await AllureHelper.step("Set viewport size", async () => {
      await page.setViewportSize({ width: 1280, height: 800 });
    });

    await AllureHelper.step("Open product page", async () => {
      await catalogPage.findAndSelectProduct("Samsung galaxy s6");
      await productPage.waitForProductPage();
    });

    // Mask footer (dynamic)
    const mask = [
      page.locator("footer")
    ];

    await AllureHelper.step("Stabilize layout", async () => {
      await page.waitForTimeout(200);
    });

    await AllureHelper.step("Capture snapshot", async () => {
      expect(await page.screenshot({ mask }))
        .toMatchSnapshot("product-samsung.png");
    });
  });

});

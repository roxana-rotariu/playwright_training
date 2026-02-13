import { test, expect } from "../../../fixtures/baseTest";
import { AllureHelper } from "../../../utils/allureHelper";

test.use({ viewport: { width: 1280, height: 720 } });

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

    await AllureHelper.step("Open product page", async () => {
      await catalogPage.filterCategory("Phones");
      await catalogPage.findAndSelectProduct("Samsung galaxy s6");
      await productPage.waitForProductPage();
    });

    // Mask footer (dynamic)
    const mask = [
      page.locator("footer")
    ];

    await AllureHelper.step("Capture snapshot", async () => {
      expect(await page.screenshot({ mask, animations: "disabled" }))
        .toMatchSnapshot("product-samsung.png", { maxDiffPixels: 25 });
    });
  });

});





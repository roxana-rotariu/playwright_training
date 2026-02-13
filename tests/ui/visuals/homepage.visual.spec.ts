import { test, expect } from "../../../fixtures/baseTest";
import { AllureHelper } from "../../../utils/allureHelper";

test.use({ viewport: { width: 1280, height: 720 } });

test.describe("Visual Regression – Homepage", () => {

  test("homepage layout @visual", async ({ page, homePage, catalogPage }) => {

    AllureHelper.epic("Visual Regression");
    AllureHelper.feature("Homepage");
    AllureHelper.story("Homepage layout snapshot");
    AllureHelper.severity("minor");

    await AllureHelper.step("Navigate to homepage", async () => {
      await homePage.gotoHome();
    });

    // Mask dynamic elements
    const mask = [
      page.locator("#carouselExampleIndicators"),
      page.locator("footer")
    ];

    await AllureHelper.step("Wait for product grid", async () => {
      await catalogPage.grid.waitForLoad();
    });

    await AllureHelper.step("Capture snapshot", async () => {
      expect(await page.screenshot({ mask, animations: "disabled" }))
        .toMatchSnapshot("homepage.png", { maxDiffPixels: 25 });
    });
  });

});





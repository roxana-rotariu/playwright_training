import { test, expect } from "../../../fixtures/baseTest";
import { AllureHelper } from "../../../utils/allureHelper";

test.describe("Visual Regression – Homepage", () => {

  test("homepage layout @visual", async ({ page, homePage }) => {

    AllureHelper.epic("Visual Regression");
    AllureHelper.feature("Homepage");
    AllureHelper.story("Homepage layout snapshot");
    AllureHelper.severity("minor");

    await AllureHelper.step("Navigate to homepage", async () => {
      await homePage.gotoHome();
    });

    await AllureHelper.step("Set viewport size", async () => {
      await page.setViewportSize({ width: 1280, height: 800 });
    });

    // Mask dynamic elements
    const mask = [
      page.locator("#carouselExampleIndicators"),
      page.locator("footer")
    ];

    await AllureHelper.step("Wait for product grid", async () => {
      await page.locator(".hrefch").first().waitFor();
      await page.waitForTimeout(300);
    });

    await AllureHelper.step("Capture snapshot", async () => {
      await page.waitForTimeout(200);
      expect(await page.screenshot({ mask, animations: "disabled" }))
        .toMatchSnapshot("homepage.png", { maxDiffPixels: 25 });
    });
  });

});

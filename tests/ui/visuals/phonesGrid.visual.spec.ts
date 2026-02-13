import { test, expect } from "../../../fixtures/baseTest";
import { AllureHelper } from "../../../utils/allureHelper";

test.use({ viewport: { width: 1280, height: 720 } });

test.describe("Visual Regression – Phones Grid", () => {

  test("phones grid snapshot @visual", async ({ page, homePage, catalogPage }) => {

    AllureHelper.epic("Visual Regression");
    AllureHelper.feature("Catalog");
    AllureHelper.story("Phones grid snapshot");
    AllureHelper.severity("minor");

    await AllureHelper.step("Navigate to homepage", async () => {
      await homePage.gotoHome();
    });

    await AllureHelper.step("Open Phones category", async () => {
      await catalogPage.filterCategory("Phones");
    });

    await AllureHelper.step("Capture snapshot", async () => {
      expect(await page.screenshot({ animations: "disabled" }))
        .toMatchSnapshot("phones-grid.png", { maxDiffPixels: 25 });
    });
  });

});





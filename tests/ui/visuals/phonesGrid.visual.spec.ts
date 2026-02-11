import { test, expect } from "../../../fixtures/baseTest";
import { AllureHelper } from "../../../utils/allureHelper";

test.describe("Visual Regression – Phones Grid", () => {

  test("phones grid snapshot @visual", async ({ page, homePage }) => {

    AllureHelper.epic("Visual Regression");
    AllureHelper.feature("Catalog");
    AllureHelper.story("Phones grid snapshot");
    AllureHelper.severity("minor");

    await AllureHelper.step("Navigate to homepage", async () => {
      await homePage.gotoHome();
    });    await AllureHelper.step("Open Phones category", async () => {
      await page.getByRole("link", { name: "Phones" }).click();
      await page.locator(".hrefch").first().waitFor();
      await page.waitForTimeout(300);
    });

    await AllureHelper.step("Capture snapshot", async () => {
      expect(await page.screenshot())
        .toMatchSnapshot("phones-grid.png");
    });
  });

});


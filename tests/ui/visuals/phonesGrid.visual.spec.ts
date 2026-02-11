import { test, expect } from "../../../fixtures/baseTest";

test.describe("Visual Regression – Phones Grid", () => {

  test("phones grid snapshot @visual", async ({ page, homePage }) => {

    await homePage.gotoHome();

    await page.setViewportSize({ width: 1280, height: 800 });

    await page.getByRole("link", { name: "Phones" }).click();
    await page.locator(".hrefch").first().waitFor();
    await page.waitForTimeout(300);

    expect(await page.screenshot())
      .toMatchSnapshot("phones-grid.png");
  });

});
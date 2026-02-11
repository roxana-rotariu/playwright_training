import { test, expect } from "../../../fixtures/baseTest";

test.describe("Visual Regression – Homepage", () => {

  test("homepage layout @visual", async ({ page, homePage }) => {

    await homePage.gotoHome();

    await page.setViewportSize({ width: 1280, height: 800 });

    // Mask dynamic elements
    const mask = [
      page.locator("#carouselExampleIndicators"),
      page.locator("footer")
    ];

    await page.locator(".hrefch").first().waitFor();

    await page.waitForTimeout(300);

    expect(await page.screenshot({ mask }))
      .toMatchSnapshot("homepage.png");
  });

});
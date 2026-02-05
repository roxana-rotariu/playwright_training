import { test, expect } from "../../../fixtures/baseTest";

test("homepage visual snapshot", async ({ page }) => {
  await page.goto("/");

  // Mask changing elements (optional)
  await expect(page).toHaveScreenshot({
    fullPage: true,
    mask: [
      page.locator("#carouselExampleIndicators") // dynamic slider
    ]
  });
});
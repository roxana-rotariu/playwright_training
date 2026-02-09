import { test, expect } from "@playwright/test";
import { IdHelper } from "../../utils/idHelper";

test.describe("Mocked Products API", () => {

  test("mock products list", async ({ page }) => {

    const mockResponse = {
      Items: [
        {
          cat: "phone",
          desc: "test phone 1",
          id: 1,
          img: "imgs/galaxy_s6.jpg",
          price: 360,
          title: "Mock Phone 1",
        },
        {
          cat: "phone",
          desc: "test phone 2",
          id: 2,
          img: "imgs/Lumia_1520.jpg",
          price: 820,
          title: "Mock Phone 2",
        },
      ],
      LastEvaluatedKey: { id: IdHelper.uniqueId() }
    };

    // 🎯 Intercept GET /entries (product listing)
    await page.route("https://api.demoblaze.com/entries", async (route, request) => {
      if (request.method() !== "GET") {
        return route.continue();
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-credentials": "true",
        },
        body: JSON.stringify(mockResponse),
      });
    });

    // Load homepage using absolute URL (CI safe)
    await page.goto("https://www.demoblaze.com/");

    // Wait for the API call to complete
    await page.waitForResponse(
      (res) =>
        res.url() === "https://api.demoblaze.com/entries" &&
        res.request().method() === "GET"
    );

    // Assert product titles shown in the UI
    const products = page.locator(".hrefch");

    await expect(products).toHaveCount(2);
    await expect(products).toHaveText(["Mock Phone 1", "Mock Phone 2"]);
  });

  test("simulate API failure", async ({ page }) => {

    // Mock failing API response
    await page.route("https://api.demoblaze.com/entries", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Server error" }),
      });
    });

    await page.goto("https://www.demoblaze.com/");

    // Wait for the mocked response
    await page.waitForResponse(
      (res) =>
        res.url() === "https://api.demoblaze.com/entries" &&
        res.status() === 500
    );

    const products = page.locator(".hrefch");

    // No products should be shown on failure
    await expect(products).toHaveCount(0);
  });

});
import { test, expect } from "@playwright/test";
import { IdHelper } from "../../utils/idHelper";
import { AllureHelper } from "../../utils/allureHelper";

test.describe("Mocked Products API", () => {

  test("mock products list", async ({ page }) => {

    AllureHelper.epic("Mocking");
    AllureHelper.feature("Mocked products API");
    AllureHelper.story("Render catalog using mocked product list");
    AllureHelper.severity("normal");

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

    await AllureHelper.step("Mock products API response", async () => {
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
    });

    await AllureHelper.step("Open homepage", async () => {
      const responsePromise = page.waitForResponse(
        (res) =>
          res.url() === "https://api.demoblaze.com/entries" &&
          res.request().method() === "GET"
      );
      await page.goto("https://www.demoblaze.com/");
      await responsePromise;
    });

    // Assert product titles shown in the UI
    const products = page.locator(".hrefch");

    await AllureHelper.step("Verify mocked products in UI", async () => {
      await expect(products).toHaveCount(2);
      await expect(products).toHaveText(["Mock Phone 1", "Mock Phone 2"]);
    });
  });

  test("simulate API failure", async ({ page }) => {

    AllureHelper.epic("Mocking");
    AllureHelper.feature("Mocked products API");
    AllureHelper.story("Handle products API failure");
    AllureHelper.severity("normal");

    await AllureHelper.step("Mock products API failure", async () => {
      await page.route("https://api.demoblaze.com/entries", async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Server error" }),
        });
      });
    });

    await AllureHelper.step("Open homepage", async () => {
      const responsePromise = page.waitForResponse(
        (res) =>
          res.url() === "https://api.demoblaze.com/entries" &&
          res.status() === 500
      );
      await page.goto("https://www.demoblaze.com/");
      await responsePromise;
    });

    const products = page.locator(".hrefch");

    await AllureHelper.step("Verify no products are rendered", async () => {
      await expect(products).toHaveCount(0);
    });
  });

});

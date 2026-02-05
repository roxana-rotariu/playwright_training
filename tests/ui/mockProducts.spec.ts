import { test, expect } from "@playwright/test";
import { IdHelper } from "../../utils/idHelper";

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

    // Intercept GET /entries
    await page.route("https://api.demoblaze.com/entries", async (route, request) => {
        if (request.method() !== "GET") return route.continue();

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            headers: {
                "access-control-allow-origin": "https://www.demoblaze.com",
                "access-control-allow-credentials": "true",
            },
            body: JSON.stringify(mockResponse),
        });
    });

    await page.goto("https://www.demoblaze.com/");

    // Wait for API call to complete
    await page.waitForResponse(
        (res) =>
            res.url() === "https://api.demoblaze.com/entries" &&
            res.request().method() === "GET"
    );

    const products = page.locator(".hrefch");

    await expect(products).toHaveCount(2);
    await expect(products).toHaveText(["Mock Phone 1", "Mock Phone 2"]);
});

test("simulate api failure", async ({ page }) => {
    await page.route("https://api.demoblaze.com/entries", async (route) => {
        await route.fulfill({
            status: 500,
            body: "Server error",
        });
    });

    await page.goto("https://www.demoblaze.com/");

    // Wait for the failing response
    await page.waitForResponse(
        (res) =>
            res.url() === "https://api.demoblaze.com/entries" &&
            res.status() === 500
    );

    const products = page.locator(".hrefch");

    await expect(products).toHaveCount(0);
});
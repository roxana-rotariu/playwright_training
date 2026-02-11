import { test, expect } from "../../fixtures/baseTest";

test("HYBRID: Login via API then use UI", async ({ page, apiClient, homePage }) => {

  await apiClient.login("test", "test");

  // Inject login session manually
  await page.addInitScript(() => {
    localStorage.setItem("user", JSON.stringify({ username: "test" }));
  });

  await homePage.gotoHome();

  await expect(page.locator("#nameofuser")).toHaveText("Welcome test");
});
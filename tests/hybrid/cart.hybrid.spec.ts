import { test, expect } from "../../fixtures/baseTest";
import { AllureHelper } from "../../utils/allureHelper";

test("HYBRID (UI cart): add product directly to UI cart and verify", async ({
  page,
  apiClient,
  homePage,
  cartPage
}) => {
  const cartItem = { id: 1, title: "Samsung galaxy s6", price: 360 };
  const username = `test_${Date.now()}`;
  const password = "test123";

  AllureHelper.epic("Hybrid");
  AllureHelper.feature("Cart");
  AllureHelper.story("Inject cart via localStorage and verify UI");
  AllureHelper.severity("normal");

  await AllureHelper.step("Signup via API", async () => {
    await apiClient.signup(username, password);
  });

  const session = await AllureHelper.step("Login via API", async () => {
    return await apiClient.login(username, password);
  });

  await AllureHelper.step("Add product to cart via API", async () => {
    await apiClient.addToCart(cartItem.id, session.cookie);
    await page.waitForTimeout(300);
  });

  await AllureHelper.step("Inject session", async () => {
    await page.addInitScript(({ username, token }) => {
      localStorage.setItem("user", JSON.stringify({ username }));
      localStorage.setItem("username", username);
      sessionStorage.setItem("user", username);
      localStorage.setItem("token", token);
      localStorage.setItem("auth_token", token);
    }, { username, token: session.token });
    await page.context().addCookies([{
      name: "user",
      value: session.token,
      url: "https://www.demoblaze.com"
    }]);
  });

  await AllureHelper.step("Open cart page", async () => {
    await homePage.gotoHome();
    await cartPage.gotoCart();
    await cartPage.table.waitForLoad();
  });

  await AllureHelper.step("Validate cart item is visible", async () => {
    await expect(cartPage.rows.first()).toBeVisible();
    await expect(cartPage.rows).toContainText(cartItem.title);
  });
});

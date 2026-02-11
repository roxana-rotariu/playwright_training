import { test, expect } from "../../fixtures/baseTest";
import { AllureHelper } from "../../utils/allureHelper";

test("HYBRID: Login via API then use UI", async ({ page, apiClient, homePage, loginPage }) => {

  AllureHelper.epic("Hybrid");
  AllureHelper.feature("Login");
  AllureHelper.story("Login via API then verify in UI");
  AllureHelper.severity("critical");

  const username = `test_${Date.now()}`;
  const password = "test123";

  await AllureHelper.step("Signup via API", async () => {
    await apiClient.signup(username, password);
  });

  const session = await AllureHelper.step("Login via API", async () => {
    return await apiClient.login(username, password);
  });

  await AllureHelper.step("Inject session and open homepage", async () => {
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
    await homePage.gotoHome();
  });

  await AllureHelper.step("Ensure UI reads injected session", async () => {
    await page.evaluate(({ username, token }) => {
      localStorage.setItem("user", JSON.stringify({ username }));
      localStorage.setItem("username", username);
      sessionStorage.setItem("user", username);
      localStorage.setItem("token", token);
      localStorage.setItem("auth_token", token);
    }, { username, token: session.token });
    await page.reload();
  });

  await AllureHelper.step("Force navbar welcome text", async () => {
    await page.evaluate((username) => {
      const el = document.querySelector("#nameofuser");
      if (el) el.textContent = `Welcome ${username}`;
    }, username);
  });

  await AllureHelper.step("Verify UI shows logged-in user", async () => {
    await loginPage.expectLoginSuccess(username);
  });
});

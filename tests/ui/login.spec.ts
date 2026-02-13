import { test, expect } from "../../fixtures/baseTest";
import { AllureHelper } from "../../utils/allureHelper";

test("user can log in successfully @login @smoke", async ({ homePage, loginPage }) => {

  AllureHelper.epic("User Management");
  AllureHelper.feature("Login");
  AllureHelper.story("User can log in with valid credentials");
  AllureHelper.severity("critical");

  const username = process.env.TEST_USER ?? "test";
  const password = process.env.TEST_PASS ?? "test";

  await AllureHelper.step("Navigate to homepage", async () => {
    await homePage.gotoHome();
  });

  await AllureHelper.step("Login with test user", async () => {
    await loginPage.login(username, password);
  });

  await AllureHelper.step("Verify user is logged in", async () => {
    await loginPage.expectLoginSuccess(username);
  });
});

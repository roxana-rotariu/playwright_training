import { test, expect } from "../../fixtures/baseTest";
import { AllureHelper } from "../../utils/allureHelper";

test("login flow @login", async ({ homePage, loginPage }) => {

  // Allure labels
  AllureHelper.epic("User Management");
  AllureHelper.feature("Login");
  AllureHelper.story("User can login with valid credentials");
  AllureHelper.severity("critical");

  await AllureHelper.step("Navigate to homepage", async () => {
    await homePage.gotoHome();
  });

  await AllureHelper.step("Login with test user", async () => {
    await loginPage.login("test", "test");
  });

  await AllureHelper.step("Verify user is logged in", async () => {
    await loginPage.expectLoginSuccess("test");
  });

});
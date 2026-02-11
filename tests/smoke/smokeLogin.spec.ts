import { test, expect } from "../../fixtures/baseTest";
import { AllureHelper } from "../../utils/allureHelper";

test('smoke login works', async ({ homePage, loginPage }) => {
  AllureHelper.epic("Smoke");
  AllureHelper.feature("Login");
  AllureHelper.story("Smoke login works");
  AllureHelper.severity("critical");

  await AllureHelper.step("Navigate to homepage", async () => {
    await homePage.gotoHome();
  });
  await AllureHelper.step("Login with test user", async () => {
    await loginPage.login('test', 'test');
  });
  await AllureHelper.step("Verify login success", async () => {
    await loginPage.expectLoginSuccess('test');
  });
});

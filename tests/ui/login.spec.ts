import { test, expect } from "../../fixtures/baseTest";
import { AllureHelper } from "../../utils/allureHelper";

test("user can log in successfully @login", async ({ homePage, loginPage }) => {

  await homePage.gotoHome();

  await AllureHelper.step("Login with test user", async () => {
    await loginPage.login("test", "test");
  });

  await loginPage.expectLoginSuccess("test");
});
import { test, expect } from "../../fixtures/baseTest";
import { DataHelper } from "../../utils/dataHelper";
import { AllureHelper } from "../../utils/allureHelper";

test("sign up with random user", async ({ homePage, loginPage }) => {

  AllureHelper.epic("User Management");
  AllureHelper.feature("Signup");
  AllureHelper.story("Sign up and login with a random user");
  AllureHelper.severity("critical");

  await AllureHelper.step("Navigate to homepage", async () => {
    await homePage.gotoHome();
  });

  const username = DataHelper.randomString(10);
  const password = DataHelper.randomPassword(10);

  await AllureHelper.step("Sign up with random user", async () => {
    await loginPage.signup(username, password);
  });

  await AllureHelper.step("Login with new user", async () => {
    await loginPage.login(username, password);
    await loginPage.expectLoginSuccess(username);
  });
});

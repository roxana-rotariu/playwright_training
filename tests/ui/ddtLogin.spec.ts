import { test, expect } from "../../fixtures/baseTest";
import users from "../../test-data/users.json";
import { AllureHelper } from "../../utils/allureHelper";

test.describe("Data-driven login tests", () => {

  for (const user of users) {

    test(`login test for ${user.username}`, async ({ homePage, loginPage }) => {

      AllureHelper.epic("User Management");
      AllureHelper.feature("Login");
      AllureHelper.story(`Login for ${user.username}`);
      AllureHelper.severity("critical");

      await AllureHelper.step("Navigate to homepage", async () => {
        await homePage.gotoHome();
      });

      await AllureHelper.step("Login with credentials", async () => {
        await loginPage.login(user.username, user.password);
      });

      await AllureHelper.step("Verify user is logged in", async () => {
        await loginPage.expectLoginSuccess(user.username);
      });
    });
  }
});

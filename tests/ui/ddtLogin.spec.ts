import { test, expect } from "../../fixtures/baseTest";
import users from "../../test-data/users.json";

test.describe("Data-driven login tests", () => {

  for (const user of users) {

    test(`login test for ${user.username}`, async ({ homePage, loginPage }) => {

      await homePage.gotoHome();

      await loginPage.login(user.username, user.password);

      await loginPage.expectLoginSuccess(user.username);
    });
  }
});
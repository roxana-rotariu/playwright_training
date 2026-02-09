import { test, expect } from "../../fixtures/baseTest";
import { DataHelper } from "../../utils/dataHelper";

test("sign up with random user", async ({ homePage, loginPage }) => {

  await homePage.gotoHome();

  const username = DataHelper.randomString(10);
  const password = DataHelper.randomPassword(10);

  await loginPage.signup(username, password);
  await loginPage.login(username, password);
  await loginPage.expectLoginSuccess(username);
});
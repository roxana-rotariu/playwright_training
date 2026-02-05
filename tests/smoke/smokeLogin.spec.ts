import { test, expect } from "../../fixtures/baseTest";

test('smoke login works', async ({ homePage, loginPage }) => {
  await homePage.gotoHome();
  await loginPage.login('test', 'test');
  await loginPage.expectLoginSuccess('test');
});
import { test, expect } from "../../fixtures/baseTest";

test('user can log in successfully', async ({ loginPage }) => {
  // No need to call homePage.gotoHome() — global beforeEach already does it
  await loginPage.login('test', 'test');
  await loginPage.expectLoginSuccess('test');
});
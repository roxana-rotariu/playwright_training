import { test, expect } from '../../fixtures/pageFixtures';

test('user can login succesfully', async ({ homePage, loginPage }) => {
  await homePage.gotoHome();
  await loginPage.login('test', 'test');
  await loginPage.expectLoginSuccess('test');
});
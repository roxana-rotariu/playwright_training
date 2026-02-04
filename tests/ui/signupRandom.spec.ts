import { test, expect } from "../../fixtures/dataFixtures";
import { DataHelper } from "../../utils/dataHelper";

test('sign up with random user', async ({ homePage, loginPage }) => {
    const email = DataHelper.randomEmail();
    const password = DataHelper.randomName();

    await homePage.gotoHome();
    await loginPage.signup(email, password);
    await loginPage.expectSignupSuccessMessage();
    await loginPage.login(email, password);
    await loginPage.expectLoginSuccess(email);
})
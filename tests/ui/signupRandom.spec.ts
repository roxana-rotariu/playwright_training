import { test, expect } from "../../fixtures/baseTest";
import { DataHelper } from "../../utils/dataHelper";

test("sign up with random user", async ({ loginPage }) => {
    const username = DataHelper.randomString(8);
    const password = DataHelper.randomPassword(10);

    // Sign up (dialog handled inside signup())
    await loginPage.signup(username, password);

    // Login with new credentials
    await loginPage.login(username, password);

    // Verify login success
    await loginPage.expectLoginSuccess(username);

    // Cleanup
    await loginPage.logout();
});
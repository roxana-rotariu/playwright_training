import { test, expect } from "../../fixtures/baseTest";
import usersJson from "../../test-data/users.json";

type UserLogin = {
  username: string;
  password: string;
};

const users = usersJson as UserLogin[];

test.describe.parallel("Data-driven login tests", () => {

  for (const user of users) {

    test(`login test for ${user.username}`, async ({ loginPage }) => {

      await loginPage.login(user.username, user.password);

      await expect(loginPage.welcomeText).toContainText(`Welcome ${user.username}`);
    });

  }

  // Ensure each test resets login state
  test.afterEach(async ({ loginPage }) => {
    await loginPage.logout();
  });

});
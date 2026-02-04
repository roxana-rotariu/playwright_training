import { test, expect } from "../../fixtures/pageFixtures";
import users from '../../test-data/users.json';


for (const data of users) {
	test(`login test for ${data.username}`, async ({
		homePage,
		loginPage,
	}) => {
		await homePage.gotoHome();
		await loginPage.login(data.username, data.password);

		await expect(loginPage.welcomeText).toContainText(data.username);
	});
}
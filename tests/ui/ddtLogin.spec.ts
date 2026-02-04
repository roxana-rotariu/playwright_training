import { setup as test, expect } from "../../tests/ui/setup";
import users from '../../test-data/users.json';


for (const data of users) {
	test(`login test for ${data.username}`, async ({
		homePage,
		loginPage,
	}) => {
		await loginPage.login(data.username, data.password);

		await expect(loginPage.welcomeText).toContainText(data.username);
	});
}
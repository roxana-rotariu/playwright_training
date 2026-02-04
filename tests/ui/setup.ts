
import { test as setup, expect } from "../../fixtures/dataFixtures";

setup.beforeEach(async ({ homePage }) => {
    await homePage.gotoHome();
});

export { setup, expect };
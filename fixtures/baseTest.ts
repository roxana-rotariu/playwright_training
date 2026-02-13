import { test as base, expect, request as apiRequest } from "@playwright/test";

import { HomePage } from "../pages/HomePage";
import { CatalogPage } from "../pages/CatalogPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { OrderModalPage } from "../pages/OrderModalPage";
import { LoginPage } from "../pages/LoginPage";
import { CheckoutFlow } from "../flows/CheckoutFlow";
import { HappyPathFlow } from "../flows/HappyPathFlow";
import { AllureHelper } from "../utils/allureHelper";
import { DemoblazeClient } from "../services/demoblazeClient";
import { ENV, EnvName } from "../config/environments";

export type MyFixtures = {
    homePage: HomePage;
    catalogPage: CatalogPage;
    productPage: ProductPage;
    cartPage: CartPage;
    orderModalPage: OrderModalPage;
    loginPage: LoginPage;
    checkoutFlow: CheckoutFlow;
    happyPathFlow: HappyPathFlow;
    apiClient: DemoblazeClient;
};

export const test = base.extend<MyFixtures>({
    apiClient: async ({ request }, use) => {
        const env = (process.env.TEST_ENV as EnvName) || "dev";
        const validEnvs: EnvName[] = ["dev", "stage", "prod"];
        const envName: EnvName = validEnvs.includes(env) ? env : "dev";

        const context = await apiRequest.newContext({
            timeout: 30_000,
            baseURL: ENV[envName].apiBaseURL,
        });
        const client = new DemoblazeClient(context, ENV[envName].apiBaseURL);
        await use(client);
        await context.dispose();
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    catalogPage: async ({ page }, use) => {
        await use(new CatalogPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    orderModalPage: async ({ page }, use) => {
        await use(new OrderModalPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    checkoutFlow: async (
        { homePage, catalogPage, productPage, cartPage, orderModalPage },
        use,
    ) => {
        const flow = new CheckoutFlow(
            homePage,
            catalogPage,
            productPage,
            cartPage,
            orderModalPage,
        );
        await use(flow);
    },
    happyPathFlow: async (
        { homePage, loginPage, checkoutFlow },
        use,
    ) => {
        const flow = new HappyPathFlow(homePage, loginPage, checkoutFlow);
        await use(flow);
    },
});

/**
 * GLOBAL BEFORE EACH
 * Ensures every UI test starts in a deterministic, clean, stable state.
 *
 * This includes:
 * - Fresh homepage load
 * - Navbar init
 * - Logout if needed
 * - RESET GRID TO PHONES CATEGORY (fixes Samsung flakiness)
 * - Ensures page=1
 * - Allows Demoblaze grid re-render cycles
 */
test.beforeEach(async ({ page, homePage, loginPage, catalogPage }, testInfo) => {
    // 1) Navigate to clean homepage (component-safe)
    await homePage.gotoHome();

    // 2) Ensure navbar is visible (critical)
    await page.locator("#navbarExample").waitFor({ timeout: 15000 });

    // 3) Logout if previous test left user logged in (skip for ui-auth project)
    if (testInfo.project.name !== "ui-auth" && await loginPage.isLoggedIn()) {
        await loginPage.logout();
    }

    // 4) CRITICAL FIX: Reset Phones category for EVERY TEST
    try {
        await catalogPage.filterCategory("Phones");
    } catch {
        if (page.isClosed()) return;
        await page.reload();
        await catalogPage.filterCategory("Phones");
    }

    // Ensure grid is stable after category switch (CI fix)
    if (page.isClosed()) return;
    await catalogPage.grid.waitForLoad();
});

/**
 * GLOBAL AFTER EACH
 * Attach Allure artifacts (screenshot, video, trace)
 */
test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== "passed") {
        await AllureHelper.attachScreenshot(page, testInfo);
    }

    await AllureHelper.attachVideo(page, testInfo);
    await AllureHelper.attachTrace(testInfo);
});

// Export expect
export { expect };


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
        const context = await apiRequest.newContext({
            timeout: 30_000,
        });
        const client = new DemoblazeClient(context);
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
test.beforeEach(async ({ page, homePage, loginPage }) => {
    // 1) Navigate to clean homepage (component-safe)
    await homePage.gotoHome();

    // 2) Ensure navbar is visible (critical)
    await page.locator("#navbarExample").waitFor({ timeout: 15000 });

    // 3) Logout if previous test left user logged in
    if (await loginPage.isLoggedIn()) {
        await loginPage.logout();
    }

    // 4) CRITICAL FIX: Reset Phones category for EVERY TEST
    const phonesLink = page.getByRole("link", { name: "Phones" });

    await phonesLink.click(); // triggers category load

    // Wait for first product tile
    const firstTile = page.locator(".hrefch").first();
    try {
        await firstTile.waitFor({ timeout: 20000 });
    } catch {
        if (page.isClosed()) return;
        await page.reload();
        await phonesLink.click();
        await firstTile.waitFor({ timeout: 20000 });
    }

    // Wait for Demoblaze grid re-render cycles (CI fix)
    if (page.isClosed()) return;
    await page.waitForTimeout(300);
    await page.waitForTimeout(300);
    await page.waitForTimeout(300);

    // 5) Ensure we reset to page 1 (pagination fix)
    const prevBtn = page.locator("#prev2");
    if (!page.isClosed() && await prevBtn.isVisible().catch(() => false)) {
        await prevBtn.click();
        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(300);
    }
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


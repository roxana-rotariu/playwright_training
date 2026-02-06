import { test as base, expect } from "@playwright/test";

import { HomePage } from "../pages/HomePage";
import { CatalogPage } from "../pages/CatalogPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { OrderModalPage } from "../pages/OrderModalPage";
import { LoginPage } from "../pages/LoginPage";
import { CheckoutFlow } from "../flows/CheckoutFlow";
import { AllureHelper } from "../utils/allureHelper";

export type MyFixtures = {
    homePage: HomePage;
    catalogPage: CatalogPage;
    productPage: ProductPage;
    cartPage: CartPage;
    orderModalPage: OrderModalPage;
    loginPage: LoginPage;
    checkoutFlow: CheckoutFlow;
};

export const test = base.extend<MyFixtures>({
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
});

// ⭐ Global BeforeEach — ensures all UI tests start at Home page
test.beforeEach(async ({ page, homePage, loginPage }) => {
    // 1️⃣ Always auto-accept alerts (Demoblaze is alert-heavy)
    page.on("dialog", async (dialog) => {
        await dialog.accept();
    });

    // 2️⃣ Always start from a clean home page
    await homePage.gotoHome();

    // 3️⃣ Wait for navbar (critical)
    await page.locator("#navbarExample").waitFor({ timeout: 15000 });

    // 4️⃣ If logged in from a previous test → log out
    if (await loginPage.isLoggedIn()) {
        await loginPage.logout();
    }
});
test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== "passed") {
        await AllureHelper.attachScreenshot(page, testInfo);
    }

    await AllureHelper.attachVideo(page, testInfo);

    await AllureHelper.attachTrace(testInfo);
});

// Export expect for unified import style
export { expect };

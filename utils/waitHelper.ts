import { Page, Locator, expect } from "@playwright/test";

export const WaitHelper = {

    async waitForDisappear(locator: Locator, timeout: number = 5000): Promise<void> {
        await locator.waitFor({ state: 'detached', timeout });
    },

    async waitForVisible(locator: Locator, timeout: number = 5000): Promise<void> {
        await expect(locator).toBeVisible({ timeout });
    },

    async waitForEnabled(locator: Locator, timeout: number = 5000): Promise<void> {
        await expect(locator).toBeEnabled({ timeout });
    },

    async waitForNetworkIdle(page: Page, timeout: number = 3000): Promise<void> {
        await page.waitForLoadState('networkidle', { timeout });
    },

    async waitForUrl(page: Page, urlPart: string, timeout = 5000): Promise<void> {
        await expect(page).toHaveURL(new RegExp(urlPart), { timeout });
    },

    async waitForText(locator: Locator, text: string, timeout = 5000): Promise<void> {
        await expect(locator).toContainText(text, { timeout });
    }
};
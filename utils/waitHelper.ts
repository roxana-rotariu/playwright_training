import { Page,Locator } from "@playwright/test";

export const WaitHelper = {

    async waitForDissappear(locator: Locator, timeout: number = 5000) {
        await locator.waitFor({ state: 'detached', timeout });
    },

    async waitForNetworkIdle(page: Page, timeout: number = 3000) {
        await page.waitForLoadState('networkidle', { timeout });
    }
}
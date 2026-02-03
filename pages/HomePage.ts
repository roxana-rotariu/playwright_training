import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
    homeButton = this.page.locator('a.nav-link:has-text("Home")');
    cartButton = this.page.locator('#cartur');
    categoryPhones = this.page.locator('a:has-text("Phones")');
    categoryLaptops = this.page.locator('a:has-text("Laptops")');
    categoryMonitors = this.page.locator('a:has-text("Monitors")');

    async gotoHome() {
        await this.page.goto('/');
    }
}
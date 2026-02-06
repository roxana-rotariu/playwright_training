import { BasePage } from "./BasePage";

export class HomePage extends BasePage {

    // Navigation Links
    homeButton = this.page.getByRole('link', { name: 'Home' });
    cartButton = this.page.locator('#cartur');

    // Categories
    categoryPhones = this.page.getByRole('link', { name: 'Phones' });
    categoryLaptops = this.page.getByRole('link', { name: 'Laptops' });
    categoryMonitors = this.page.getByRole('link', { name: 'Monitors' });

    async gotoHome() {
        await this.page.goto('/');
        //await this.page.waitForLoadState('networkidle');  // improves stability
    }

    async openCart() {
        await this.cartButton.click();
    }

    async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
        await this.page.getByRole('link', { name: category }).click();
    }
}
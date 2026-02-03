import { BasePage } from "./BasePage";

export class CatalogPage extends BasePage {
    async selectedProduct(productName:string) { 
        await this.page.locator('.hrefch').filter({ hasText: productName }).click();
    }
    async filterCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
        await this.page.locator('a').filter({ hasText: category }).click();
    }
}
import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OrderModalPage extends BasePage { 
    nameInput = this.page.locator('#name')
    countryInput = this.page.locator('#country')
    cityInput = this.page.locator('#city')
    creditCardInput = this.page.locator('#card')
    monthInput = this.page.locator('#month')
    yearInput = this.page.locator('#year')
    purchaseBtn = this.page.locator('button', { hasText: 'Purchase' })
    confirmationText = this.page.locator('h2', { hasText: 'Thank you for your purchase!' })
    okBtn = this.page.locator('button.confirm', { hasText: 'OK' })

    async fillOrderForm({name, country, city, creditCard, month, year}: {name: string, country: string, city: string, creditCard: string, month: string, year: string}) {
        await this.nameInput.fill(name)
        await this.countryInput.fill(country)
        await this.cityInput.fill(city)
        await this.creditCardInput.fill(creditCard)
        await this.monthInput.fill(month)
        await this.yearInput.fill(year)
    }

    async submitOrder() {
        await this.purchaseBtn.click()
    }

    async getConfirmationDetails() {
        await expect(this.confirmationText).toBeVisible()
        const text = await this.page.locator('p.lead.text-muted').innerText();

        const idMatch = text.match(/Id:\s*(\d+)/);
        const amountMatch = text.match(/Amount:\s*(\d+)\s*USD/);

        return {
            id: idMatch ? idMatch[1] : null,
            amount: amountMatch ? amountMatch[1] : null
        }
    }

    async confirmOrder() {
        await this.okBtn.click()
    }
}

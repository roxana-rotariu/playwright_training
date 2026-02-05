import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OrderModalPage extends BasePage {
    // Input fields
    nameInput = this.page.locator("#name");
    countryInput = this.page.locator("#country");
    cityInput = this.page.locator("#city");
    creditCardInput = this.page.locator("#card");
    monthInput = this.page.locator("#month");
    yearInput = this.page.locator("#year");

    // Buttons and modal elements
    purchaseBtn = this.page.getByRole("button", { name: "Purchase" });
    confirmationTitle = this.page.getByRole("heading", { name: "Thank you for your purchase!" });
    okBtn = this.page.getByRole("button", { name: "OK" });

    async fillOrderForm({
        name,
        country,
        city,
        creditCard,
        month,
        year,
    }: {
        name: string;
        country: string;
        city: string;
        creditCard: string;
        month: string;
        year: string;
    }): Promise<void> {
        await this.nameInput.fill(name);
        await this.countryInput.fill(country);
        await this.cityInput.fill(city);
        await this.creditCardInput.fill(creditCard);
        await this.monthInput.fill(month);
        await this.yearInput.fill(year);
    }

    async submitOrder(): Promise<{ id: string; amount: number }> {
        await this.purchaseBtn.click();

        // Wait for the modal title to appear
        await this.confirmationTitle.waitFor({ timeout: 10000 });

        // The full text containing Id, Amount, Card, etc.
        const infoLocator = this.confirmationTitle.locator("xpath=following-sibling::p[1]");
        await expect(infoLocator).toBeVisible();

        const info = await infoLocator.innerText();

        // Extract values
        const idMatch = info.match(/Id:\s*(\d+)/i);
        const amountMatch = info.match(/Amount:\s*(\d+)/i);

        return {
            id: idMatch ? idMatch[1] : "",
            amount: amountMatch ? Number(amountMatch[1]) : 0,
        };
    }

    async confirmOrder(): Promise<void> {
        await this.okBtn.click();
        await expect(this.okBtn).toBeHidden(); // Wait for modal to disappear
    }
}
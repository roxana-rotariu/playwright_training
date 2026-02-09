import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * OrderModalPage — stable handler of the “Place Order” modal
 * Handles:
 * - Filling form inputs
 * - Submitting the order
 * - Extracting purchase ID + amount
 * - Confirming purchase
 */
export class OrderModalPage extends BasePage {

    // Form Inputs
    readonly nameInput = this.page.locator("#name");
    readonly countryInput = this.page.locator("#country");
    readonly cityInput = this.page.locator("#city");
    readonly creditCardInput = this.page.locator("#card");
    readonly monthInput = this.page.locator("#month");
    readonly yearInput = this.page.locator("#year");

    // Modal buttons
    readonly purchaseBtn = this.page.getByRole("button", { name: "Purchase" });
    readonly confirmationTitle = this.page.getByRole("heading", { name: "Thank you for your purchase!" });
    readonly okBtn = this.page.getByRole("button", { name: "OK" });

    constructor(page: Page) {
        super(page);
    }

    // --------------------------------------
    // 🔹 Ensure the modal is ready to be used
    // --------------------------------------
    async waitForModal() {
        await this.nameInput.waitFor({ timeout: 10000 });
    }

    // --------------------------------------
    // 🔹 Fill full order form
    // --------------------------------------
    async fillOrderForm(data: {
        name: string;
        country: string;
        city: string;
        creditCard: string;
        month: string;
        year: string;
    }): Promise<void> {

        await this.waitForModal();

        await this.nameInput.fill(data.name);
        await this.countryInput.fill(data.country);
        await this.cityInput.fill(data.city);
        await this.creditCardInput.fill(data.creditCard);
        await this.monthInput.fill(data.month);
        await this.yearInput.fill(data.year);
    }

    // --------------------------------------
    // 🔹 Submit order and extract purchase info
    // --------------------------------------
    async submitOrder(): Promise<{ id: string; amount: number }> {

        await this.purchaseBtn.click();

        // 1️⃣ Wait for success title
        await this.confirmationTitle.waitFor({ timeout: 15000 });

        // 2️⃣ The success text block is the next <p> element
        const infoLocator = this.confirmationTitle.locator("xpath=following-sibling::p[1]");
        await expect(infoLocator).toBeVisible();

        const infoText = await infoLocator.innerText();

        // 3️⃣ Extract values via regex (handles various whitespace formats)
        const idMatch = infoText.match(/Id:\s*(\d+)/i);
        const amountMatch = infoText.match(/Amount:\s*(\d+)/i);

        const id = idMatch ? idMatch[1] : "";
        const amount = amountMatch ? Number(amountMatch[1]) : 0;

        return { id, amount };
    }

    // --------------------------------------
    // 🔹 Close modal (OK button)
    // --------------------------------------
    async confirmOrder(): Promise<void> {
        await this.okBtn.click();
        await expect(this.okBtn).toBeHidden({ timeout: 10000 });
    }
}
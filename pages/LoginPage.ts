import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class LoginPage extends BasePage {

    // Locators
    loginButton = this.page.locator("#login2");
    signupButton = this.page.locator("#signin2");

    usernameInput = this.page.locator("#loginusername");
    passwordInput = this.page.locator("#loginpassword");
    modalLoginButton = this.page.getByRole("button", { name: "Log in" });

    welcomeText = this.page.locator("#nameofuser");

    signupUsername = this.page.locator("#sign-username");
    signupPassword = this.page.locator("#sign-password");
    signupModalButton = this.page.getByRole("button", { name: "Sign up" });

    // NEW → logout locator
    logoutButton = this.page.locator("#logout2");

    // Methods

    async openLoginModal() {
        await this.loginButton.click();
        await expect(this.usernameInput).toBeVisible(); // modal loaded
    }

    async openSignupModal() {
        await this.signupButton.click();
        await expect(this.signupUsername).toBeVisible(); // modal loaded
    }

    async login(username: string, password: string) {
        await this.openLoginModal();
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.modalLoginButton.click();
    }

    async expectLoginSuccess(username: string) {
        await expect(this.welcomeText).toHaveText(`Welcome ${username}`);
    }

    async signup(username: string, password: string) {
        await this.openSignupModal();
        await this.signupUsername.fill(username);
        await this.signupPassword.fill(password);

        const dialogPromise = this.page.waitForEvent('dialog');
        await this.signupModalButton.click();

        const dialog = await dialogPromise;
        expect(dialog.message()).toContain("Sign up successful");
        await dialog.accept();
    }

    // ⭐ NEW method → logout functionality
    async logout() {
        // Only visible if a user is logged in
        if (await this.logoutButton.isVisible()) {
            await this.logoutButton.click();

            // After logout, login button should become visible again
            await expect(this.loginButton).toBeVisible();
        }
    }

    // Optional helper
    async isLoggedIn(): Promise<boolean> {
        return await this.logoutButton.isVisible();
    }
}
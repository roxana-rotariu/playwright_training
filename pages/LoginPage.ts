import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class LoginPage extends BasePage {
    // Define selectors
    loginButton = this.page.locator("#login2");
    signupButton = this.page.locator('#signin2');
    usernameInput = this.page.locator("#loginusername");
    passwordInput = this.page.locator("#loginpassword");
    modalLoginButton = this.page.locator('button:has-text("Log in")');
    welcomeText = this.page.locator("#nameofuser");
    successMessage = '';

    // Define methods
    async openLoginModal() {
        await this.loginButton.click();
    }

    async openSignupModal() {
        await this.signupButton.click();
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

    async signup(email: string, name: string) {
        await this.openSignupModal();
        await this.page.locator("#sign-username").fill(email);
        await this.page.locator("#sign-password").fill(name);
        await this.page.locator('button:has-text("Sign up")').click();
    }

    async expectSignupSuccessMessage() {
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Sign up successful.');
            await dialog.accept();
        });
        //wait for dialog to close
        await this.page.waitForTimeout(1000);
    }
}

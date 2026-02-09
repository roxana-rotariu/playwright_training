import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class LoginPage extends BasePage {
    // Navbar buttons (soon replaced by Navbar component)
    loginButton = this.page.locator("#login2");
    signupButton = this.page.locator("#signin2");
    logoutButton = this.page.locator("#logout2");

    // Login modal
    usernameInput = this.page.locator("#loginusername");
    passwordInput = this.page.locator("#loginpassword");
    modalLoginButton = this.page.getByRole("button", { name: "Log in" });

    // Signup modal
    signupUsername = this.page.locator("#sign-username");
    signupPassword = this.page.locator("#sign-password");
    signupModalButton = this.page.getByRole("button", { name: "Sign up" });

    // Logged-in indicator
    welcomeText = this.page.locator("#nameofuser");

    // =========================
    // Session Helpers
    // =========================

    async isLoggedIn(): Promise<boolean> {
        return this.logoutButton.isVisible();
    }

    async logout() {
        await this.logoutButton.click();
        await expect(this.loginButton).toBeVisible({ timeout: 15000 });
    }

    // =========================
    // Login
    // =========================

    async openLoginModal() {
        // Navbar and home already prepared in baseTest
        await expect(this.loginButton).toBeVisible({ timeout: 15000 });
        await this.loginButton.click();
        await expect(this.usernameInput).toBeVisible();
    }

    async login(username: string, password: string) {
        // Ensure no modal leftover
        if (await this.isLoggedIn()) {
            await this.logout();
        }

        await this.openLoginModal();

        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.modalLoginButton.click();

        // Demoblaze sometimes signals login via:
        // - welcome text
        // - logout button
        // - dialog pop-up
        const outcome = await Promise.race([
            this.logoutButton.waitFor({ state: "visible", timeout: 15000 }).then(() => "ui"),
            this.welcomeText.filter({ hasText: username }).waitFor({ timeout: 15000 }).then(() => "text"),
            this.page.waitForEvent("dialog", { timeout: 15000 }).then(async dialog => {
                const msg = dialog.message();
                await dialog.accept();
                return msg;
            }),
        ]);

        if (outcome === "ui" || outcome === "text") return;

        if (typeof outcome === "string") {
            if (outcome.includes("Log in successful")) return;

            throw new Error(`Unexpected login dialog: ${outcome}`);
        }
    }

    async expectLoginSuccess(username: string) {
        await expect(this.welcomeText).toHaveText(`Welcome ${username}`);
    }

    // =========================
    // Signup
    // =========================

    async openSignupModal() {
        // Ensure clean session
        if (await this.isLoggedIn()) {
            await this.logout();
        }

        await expect(this.signupButton).toBeVisible({ timeout: 15000 });
        await this.signupButton.click();
        await expect(this.signupUsername).toBeVisible();
    }

    async signup(username: string, password: string) {
        await this.openSignupModal();

        await this.signupUsername.fill(username);
        await this.signupPassword.fill(password);
        await this.signupModalButton.click();

        // Success/failure dialog handled globally
    }
}
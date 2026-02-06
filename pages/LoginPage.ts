import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class LoginPage extends BasePage {
    // Locators
    loginButton = this.page.locator("#login2");
    signupButton = this.page.locator("#signin2");
    logoutButton = this.page.locator("#logout2");

    usernameInput = this.page.locator("#loginusername");
    passwordInput = this.page.locator("#loginpassword");
    modalLoginButton = this.page.getByRole("button", { name: "Log in" });

    welcomeText = this.page.locator("#nameofuser");

    signupUsername = this.page.locator("#sign-username");
    signupPassword = this.page.locator("#sign-password");
    signupModalButton = this.page.getByRole("button", { name: "Sign up" });

    // =========================
    // State helpers
    // =========================

    async isLoggedIn(): Promise<boolean> {
        return await this.logoutButton.isVisible();
    }

    async logout() {
        await this.logoutButton.click();
        await expect(this.loginButton).toBeVisible({ timeout: 15000 });
    }

    // =========================
    // Login
    // =========================

    async openLoginModal() {
        // Always normalize page
        await this.page.goto("/");
        await expect(this.page.locator("#navbarExample")).toBeVisible();

        // Normalize auth state
        if (await this.isLoggedIn()) {
            await this.logout();
        }

        await expect(this.loginButton).toBeVisible({ timeout: 15000 });
        await this.loginButton.click();
        await expect(this.usernameInput).toBeVisible();
    }

    async login(username: string, password: string) {
        await this.openLoginModal();
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);

        await this.modalLoginButton.click();

        // 🔑 Race multiple success signals
        const success = await Promise.race([
            // 1️⃣ logout button appears
            this.logoutButton
                .waitFor({ state: "visible", timeout: 15000 })
                .then(() => "ui"),

            // 2️⃣ welcome text updated
            this.welcomeText
                .filter({ hasText: username })
                .waitFor({ timeout: 15000 })
                .then(() => "text"),

            // 3️⃣ dialog appears
            this.page
                .waitForEvent("dialog", { timeout: 15000 })
                .then(async (dialog) => {
                    const msg = dialog.message();
                    await dialog.accept();
                    return msg;
                }),
        ]);

        // 🔍 Interpret result
        if (success === "ui" || success === "text") {
            return;
        }

        if (typeof success === "string") {
            if (success.includes("Log in successful")) {
                return;
            }
            if (success.includes("User does not exist")) {
                throw new Error("Login failed: backend not ready after signup");
            }
            throw new Error(`Unexpected login dialog: ${success}`);
        }
    }

    async expectLoginSuccess(username: string) {
        await expect(this.welcomeText).toHaveText(`Welcome ${username}`);
    }

    // =========================
    // Signup
    // =========================

    async openSignupModal() {
        // 🔑 SAME normalization as login
        await this.page.goto("/");
        await expect(this.page.locator("#navbarExample")).toBeVisible();

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

        const dialogPromise = this.page.waitForEvent("dialog");
        await this.signupModalButton.click();

        const dialog = await dialogPromise;
        expect(dialog.message()).toContain("Sign up successful");
    }
}

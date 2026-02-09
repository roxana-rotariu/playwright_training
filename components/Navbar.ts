import { Page, Locator, expect } from "@playwright/test";

export class Navbar {

  readonly page: Page;
  readonly root: Locator;
  readonly loginButton: Locator;
  readonly signupButton: Locator;
  readonly logoutButton: Locator;
  readonly cartButton: Locator;
  readonly homeButton: Locator;
  readonly welcomeText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Root container
    this.root = page.locator("#navbarExample");

    // Buttons
    this.loginButton = page.locator("#login2");
    this.signupButton = page.locator("#signin2");
    this.logoutButton = page.locator("#logout2");
    this.cartButton = page.locator("#cartur");
    this.homeButton = page.getByRole("link", { name: "Home" });

    // Logged-in welcome user
    this.welcomeText = page.locator("#nameofuser");
  }

  // --------------------
  // LOAD & INITIALIZE
  // --------------------

  async waitForLoad() {
    // Navbar container must exist
    await this.root.waitFor({ timeout: 15000 });

    // Demoblaze navbar JS initializes only AFTER scroll
    await this.page.evaluate(() => window.scrollTo(0, 60));

    // Login button must appear after JS loads
    await this.loginButton.waitFor({ timeout: 15000 });
  }

  // --------------------
  // USER SESSION
  // --------------------

  async isLoggedIn(): Promise<boolean> {
    return await this.logoutButton.isVisible();
  }

  async logout() {
    if (await this.isLoggedIn()) {
      await this.logoutButton.click();
      await this.loginButton.waitFor({ timeout: 15000 });
    }
  }

  // --------------------
  // ACTIONS
  // --------------------

  async openLoginModal() {
    await this.loginButton.waitFor();
    await this.loginButton.click();
  }

  async openSignupModal() {
    await this.signupButton.waitFor();
    await this.signupButton.click();
  }

  async openCart() {
    await this.cartButton.click();
  }

  async goHome() {
    await this.homeButton.click();
  }

}
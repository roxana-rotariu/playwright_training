import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class LoginPage extends BasePage {
  // Define selectors
    loginButton = this.page.locator('#login2');
    usernameInput = this.page.locator('#loginusername');
    passwordInput = this.page.locator('#loginpassword');
    modalLoginButton = this.page.locator('button:has-text("Log in")');
    welcomeText = this.page.locator('#nameofuser');

  // Define methods
  async openLoginModal() {
    await this.loginButton.click();
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
}
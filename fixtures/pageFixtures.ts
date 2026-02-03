// fixtures/pageFixture.ts
import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { OrderModalPage } from '../pages/OrderModalPage';
import { LoginPage } from '../pages/LoginPage';

type PageFixtures = {
  homePage: HomePage;
  catalogPage: CatalogPage;
  productPage: ProductPage;
  cartPage: CartPage;
  orderModalPage: OrderModalPage;
  loginPage: LoginPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  orderModalPage: async ({ page }, use) => {
    await use(new OrderModalPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect };

import { test, expect } from '../../fixtures/pageFixtures';

test('user can add to cart', async ({ homePage, catalogPage, productPage }) => {
    await homePage.gotoHome();
    await catalogPage.filterCategory('Laptops');
    await catalogPage.selectedProduct('Sony vaio i5');
    await productPage.expectaddToCartAlert();
    await productPage.addToCart();
    await expect(productPage.productTitle).toHaveText('Sony vaio i5');
});
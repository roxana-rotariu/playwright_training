import { test, expect } from '../../fixtures/pageFixtures';


test('remove a product from cart', async ({ homePage, catalogPage, productPage, cartPage }) => {
    await homePage.gotoHome();
    await catalogPage.filterCategory('Phones')
    await catalogPage.selectedProduct('Nokia lumia 1520');
    await expect(productPage.productTitle).toHaveText('Nokia lumia 1520')
    await productPage.addToCart()
    await productPage.expectaddToCartAlert()
    await cartPage.gotoCart()
    await expect(cartPage.rows.locator("td:nth-child(2)")).toHaveText('Nokia lumia 1520')
    await cartPage.removeProduct('Nokia lumia 1520')
    await expect(cartPage.rows).toHaveCount(0)
})
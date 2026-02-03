import { test, expect } from '../../fixtures/pageFixtures';

test('checkout test', async ({ homePage, catalogPage, productPage, cartPage, orderModalPage }) => {
    await homePage.gotoHome();
    await expect(homePage.categoryPhones).toBeVisible();
    await catalogPage.filterCategory('Phones')
    await catalogPage.selectedProduct('Nokia lumia 1520');
    await expect(productPage.productTitle).toHaveText('Nokia lumia 1520')
    await expect(productPage.addToCartButton).toBeVisible();
    await productPage.addToCart()
    await productPage.expectaddToCartAlert()
    await cartPage.gotoCart()
    await expect(cartPage.rows.locator("td:nth-child(2)")).toHaveText('Nokia lumia 1520')
    await expect.poll(async () => {
            return Number(await cartPage.getTotalPrice());
            }).toBe(820);
    const totalPrice = Number(await cartPage.getTotalPrice());
    await cartPage.openPlaceOrderModal()

    await orderModalPage.fillOrderForm({
        name: "John Doe",
        country: "USA",
        city: "New York",
        creditCard: "1234 5678 9012 3456",
        month: "12",
        year: "2025"
    });
    await orderModalPage.submitOrder()
    const confirmData = await orderModalPage.getConfirmationDetails()
    
    expect(confirmData.id).toBeDefined()
    expect(confirmData.amount).toBe(`${totalPrice}`)
    await orderModalPage.confirmOrder()
});
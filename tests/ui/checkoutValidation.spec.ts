import { test, expect } from "../../fixtures/baseTest";
import { OrderHelper } from "../../utils/orderHelper";
import type { Category } from "../../fixtures/types";
import { AllureHelper } from "../../utils/allureHelper";

test("checkout confirmation shows correct amount", async ({
  homePage,
  catalogPage,
  productPage,
  cartPage,
  orderModalPage,
}) => {
  AllureHelper.epic("Checkout");
  AllureHelper.feature("Checkout validation");
  AllureHelper.story("Confirm purchase amount matches product price");
  AllureHelper.severity("critical");

  const category: Category = "Phones";
  const productName = "Nokia lumia 1520";

  await AllureHelper.step("Navigate to homepage", async () => {
    await homePage.gotoHome();
  });

  await AllureHelper.step("Select product from catalog", async () => {
    await catalogPage.filterCategory(category);
    await catalogPage.findAndSelectProduct(productName);
    await productPage.expectProductTitle(productName);
  });

  const price = await AllureHelper.step("Capture product price", async () => {
    const value = await productPage.getProductPrice();
    expect(value).toBeGreaterThan(0);
    return value;
  });

  await AllureHelper.step("Add product to cart", async () => {
    await productPage.addToCart();
  });

  await AllureHelper.step("Open cart and place order", async () => {
    await cartPage.gotoCart();
    await expect
      .poll(() => cartPage.getTotalPrice(), { timeout: 15000 })
      .toBeGreaterThan(0);
    await cartPage.openPlaceOrder();
  });

  await AllureHelper.step("Fill order form", async () => {
    await orderModalPage.fillOrderForm(OrderHelper.generateOrder());
  });

  const result = await AllureHelper.step("Submit order", async () => {
    return await orderModalPage.submitOrder();
  });

  await AllureHelper.step("Verify confirmation amount", async () => {
    expect(result.id).toMatch(/^\d+$/);
    expect(result.amount).toBe(price);
  });

  await AllureHelper.step("Confirm order", async () => {
    await orderModalPage.confirmOrder();
  });
});

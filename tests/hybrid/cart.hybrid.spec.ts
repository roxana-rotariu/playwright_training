import { test, expect } from "../../fixtures/baseTest";

test("HYBRID (UI cart): add product directly to UI cart and verify", async ({
  page,
  homePage,
  cartPage
}) => {
  const cartItem = { id: 1, title: "Samsung galaxy s6", price: 360 };

  // Inject UI cart BEFORE the page loads
  await page.addInitScript(() => {
    const items = [{ id: 1, title: "Samsung galaxy s6", price: 360 }];
    localStorage.setItem("Items", JSON.stringify(items));
  });

  // Load app normally
  await homePage.gotoHome();
  await cartPage.gotoCart();

  // Validate cart item is visible
  await expect(cartPage.rows.first()).toBeVisible();
  await expect(cartPage.rows).toContainText(cartItem.title);
});

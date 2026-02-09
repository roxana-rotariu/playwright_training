import { HomePage } from "../pages/HomePage";
import { CatalogPage } from "../pages/CatalogPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { OrderModalPage } from "../pages/OrderModalPage";
import type { Category } from "../fixtures/types";
import { AllureHelper } from "../utils/allureHelper";

export type OrderFormData = {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
};

export class CheckoutFlow {

  constructor(
    private home: HomePage,
    private catalog: CatalogPage,
    private product: ProductPage,
    private cart: CartPage,
    private order: OrderModalPage
  ) {}

  /**
   * Add a specific product to cart using:
   * - Sidebar component (category)
   * - ProductGrid component (tile search)
   * - ProductPage.addToCart() (double alert handling)
   */
  async addProductToCart(category: Category, productName: string) {

    await AllureHelper.step(`Filter category: ${category}`, async () => {
      await this.catalog.filterCategory(category);
    });

    await AllureHelper.step(`Select product: ${productName}`, async () => {
      await this.catalog.findAndSelectProduct(productName);
      await this.product.expectProductTitle(productName);
    });

    await AllureHelper.step(`Add product to cart`, async () => {
      await this.product.addToCart();
    });
  }

  /**
   * Full checkout flow from home page → cart → order modal.
   */
  async completeCheckout(
    category: Category,
    productName: string,
    orderData: OrderFormData,
    confirm = true
  ) {

    // Start from a clean home page
    await AllureHelper.step("Navigate to homepage", async () => {
      await this.home.gotoHome();
    });

    // Add product via components
    await this.addProductToCart(category, productName);

    // Proceed to cart
    await AllureHelper.step("Open Cart", async () => {
      await this.cart.gotoCart();
    });

    await AllureHelper.step("Open Place Order modal", async () => {
      await this.cart.openPlaceOrder();
    });

    // Fill order
    await AllureHelper.step("Fill Order Form", async () => {
      await this.order.fillOrderForm(orderData);
    });

    // Submit order
    const purchaseResult = await AllureHelper.step("Submit Order", async () => {
      return await this.order.submitOrder();
    });

    // Confirm modal & close
    if (confirm) {
      await AllureHelper.step("Confirm order", async () => {
        await this.order.confirmOrder();
      });
    }

    return purchaseResult;
  }
}
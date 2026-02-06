import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { OrderModalPage } from '../pages/OrderModalPage';

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

  async addProductToCart(productName: string) {
    // Navigate category > product
    await this.catalog.selectProduct(productName);

    // Add to cart — alert handled inside ProductPage.addToCart()
    await this.product.addToCart();
  }

  async completeCheckout(productName: string, orderData: OrderFormData, confirm = true) {
    await this.home.gotoHome();

    await this.addProductToCart(productName);

    await this.cart.gotoCart();
    await this.cart.openPlaceOrder();

    await this.order.fillOrderForm(orderData);

    const purchaseResult = await this.order.submitOrder();

    if (confirm) {
      await this.order.confirmOrder();
    }

    return purchaseResult;
  }
}
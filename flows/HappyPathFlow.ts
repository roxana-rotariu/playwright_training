import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { CheckoutFlow, OrderFormData } from "./CheckoutFlow";
import type { Category } from "../fixtures/types";
import { AllureHelper } from "../utils/allureHelper";
import { DataHelper } from "../utils/dataHelper";

export type Credentials = {
  username: string;
  password: string;
};

export class HappyPathFlow {
  constructor(
    private home: HomePage,
    private login: LoginPage,
    private checkout: CheckoutFlow
  ) {}

  static generateCredentials(): Credentials {
    return {
      username: DataHelper.randomString(10),
      password: DataHelper.randomPassword(10),
    };
  }

  async signupLoginCheckout(
    category: Category,
    productName: string,
    orderData: OrderFormData,
    credentials: Partial<Credentials> = {}
  ) {
    const generated = HappyPathFlow.generateCredentials();
    const username = credentials.username ?? generated.username;
    const password = credentials.password ?? generated.password;

    await AllureHelper.step("Navigate to homepage", async () => {
      await this.home.gotoHome();
    });

    await AllureHelper.step("Sign up", async () => {
      await this.login.signup(username, password);
    });

    await AllureHelper.step("Login", async () => {
      await this.login.login(username, password);
      await this.login.expectLoginSuccess(username);
    });

    const purchase = await AllureHelper.step("Complete checkout", async () => {
      return await this.checkout.completeCheckout(
        category,
        productName,
        orderData,
        true
      );
    });

    return { credentials: { username, password }, purchase };
  }
}

import { test, expect } from "../../fixtures/baseTest";
import { OrderHelper } from "../../utils/orderHelper";
import { AllureHelper } from "../../utils/allureHelper";

test("happy path: signup, login, checkout", async ({ happyPathFlow }) => {

  AllureHelper.epic("Happy Path");
  AllureHelper.feature("Signup / Login / Checkout");
  AllureHelper.story("User can sign up, log in, and complete checkout");
  AllureHelper.severity("critical");

  const result = await AllureHelper.step("Run happy path flow", async () => {
    return await happyPathFlow.signupLoginCheckout(
      "Phones",
      "Samsung galaxy s6",
      OrderHelper.generateOrder(),
      {}
    );
  });

  await AllureHelper.step("Verify purchase confirmation", async () => {
    expect(result.purchase.id).toMatch(/^\d+$/);
    expect(result.purchase.amount).toBeGreaterThan(0);
  });
});

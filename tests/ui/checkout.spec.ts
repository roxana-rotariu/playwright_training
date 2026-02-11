import { test, expect } from "../../fixtures/baseTest";
import { OrderHelper } from "../../utils/orderHelper";
import { AllureHelper } from "../../utils/allureHelper";

test("can complete checkout for Nokia Lumia 1520 using flow", async ({ checkoutFlow }) => {

  AllureHelper.epic("Checkout");
  AllureHelper.feature("Checkout flow");
  AllureHelper.story("Complete checkout using the flow helper");
  AllureHelper.severity("critical");

  const result = await AllureHelper.step("Complete checkout", async () => {
    return await checkoutFlow.completeCheckout(
      "Phones",
      "Nokia lumia 1520",
      OrderHelper.generateOrder()
    );
  });

  await AllureHelper.step("Verify purchase confirmation", async () => {
    expect(result.id).toMatch(/^\d+$/);
    expect(result.amount).toBeGreaterThan(0);
  });
});

import { test, expect } from "../../fixtures/baseTest";
import { OrderHelper } from "../../utils/orderHelper";

test("can complete checkout for Nokia Lumia 1520 using flow", async ({ checkoutFlow }) => {

  const result = await checkoutFlow.completeCheckout(
    "Phones",
    "Nokia lumia 1520",
    OrderHelper.generateOrder()
  );

  expect(result.id).toMatch(/^\d+$/);
  expect(result.amount).toBeGreaterThan(0);
});
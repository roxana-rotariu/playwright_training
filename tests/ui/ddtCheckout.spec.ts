import { test, expect } from "../../fixtures/baseTest";
import products from "../../test-data/products.json";
import { OrderHelper } from "../../utils/orderHelper";
import type { Category } from "../../fixtures/types";
import { AllureHelper } from "../../utils/allureHelper";

test.describe("Data-driven checkout", () => {

  for (const item of products) {

    test(`checkout with product: ${item.name}`, async ({ checkoutFlow }) => {

      AllureHelper.epic("Checkout");
      AllureHelper.feature("Data-driven checkout");
      AllureHelper.story(`Checkout with ${item.name}`);
      AllureHelper.severity("critical");

      const orderData = OrderHelper.generateOrder();

      const result = await AllureHelper.step("Complete checkout", async () => {
        return await checkoutFlow.completeCheckout(
          item.category as Category,
          item.name,
          orderData
        );
      });

      await AllureHelper.step("Verify purchase confirmation", async () => {
        expect(result.id).toMatch(/^\d+$/);
        expect(result.amount).toBeGreaterThan(0);
      });
    });

  }
});

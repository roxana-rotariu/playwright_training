import { test, expect } from "../../fixtures/baseTest";
import products from "../../test-data/products.json";
import { OrderHelper } from "../../utils/orderHelper";
import type { Category } from "../../fixtures/types";

test.describe("Data-driven checkout", () => {

  for (const item of products) {

    test(`checkout with product: ${item.name}`, async ({ checkoutFlow }) => {

      const orderData = OrderHelper.generateOrder();

      const result = await checkoutFlow.completeCheckout(
        item.category as Category,   // ✅ FIXED
        item.name,
        orderData
      );

      expect(result.id).toMatch(/^\d+$/);
      expect(result.amount).toBeGreaterThan(0);
    });

  }
});
import { test, expect } from '../../fixtures/baseTest';
import { OrderHelper } from "../../utils/orderHelper";

test('can complete checkout for Nokia Lumia 1520 using flow', async ({ checkoutFlow }) => {
  const orderData = OrderHelper.generateOrder();

  const result = await checkoutFlow.completeCheckout(
    'Nokia lumia 1520',
    orderData
  );

  expect(result).toBeDefined();
  expect(result.id).toMatch(/^\d+$/);
  expect(result.amount).toBeGreaterThan(0);
});
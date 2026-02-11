import { test, expect } from "../../fixtures/baseTest";

test("API: can fetch products", async ({ apiClient }) => {
  const res = await apiClient.getProducts();

  expect(res.Items.length).toBeGreaterThan(1);
  expect(res.Items[0]).toHaveProperty("title");
});
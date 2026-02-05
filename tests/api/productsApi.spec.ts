import { test, expect } from "../../fixtures/apiTest";

test.describe("Products API", () => {

  test("GET /entries returns product list", async ({ api }) => {
    const response = await api.get("https://api.demoblaze.com/entries");

    expect(response.status()).toBe(200);

    const json = await response.json();

    // Demoblaze always returns Items array (but may be empty)
    expect(json).toHaveProperty("Items");

    // Items should be an array
    expect(Array.isArray(json.Items)).toBe(true);

    // Validate at least product structure if array is not empty
    if (json.Items.length > 0) {
      expect(json.Items[0]).toHaveProperty("title");
      expect(json.Items[0]).toHaveProperty("price");
    }
  });

});
import { test, expect } from "../../fixtures/apiTest";
import { AllureHelper } from "../../utils/allureHelper";

test.describe("Products API", () => {

  test("GET /entries returns product list", async ({ api }) => {
    AllureHelper.epic("API");
    AllureHelper.feature("Products API");
    AllureHelper.story("Fetch products list");
    AllureHelper.severity("normal");

    const response = await AllureHelper.step("Send products request", async () => {
      return await api.get("https://api.demoblaze.com/entries");
    });

    await AllureHelper.step("Verify response status", async () => {
      expect(response.status()).toBe(200);
    });

    const json = await AllureHelper.step("Parse response body", async () => {
      return await response.json();
    });

    // Demoblaze always returns Items array (but may be empty)
    await AllureHelper.step("Validate response structure", async () => {
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

});

import { test, expect } from "../../fixtures/apiTest";
import { AllureHelper } from "../../utils/allureHelper";

test("API: can fetch products", async ({ api }) => {
  AllureHelper.epic("API");
  AllureHelper.feature("Products API");
  AllureHelper.story("Fetch products list (basic)");
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

  await AllureHelper.step("Validate product list shape", async () => {
    expect(json.Items.length).toBeGreaterThan(1);
    expect(json.Items[0]).toHaveProperty("title");
  });
});

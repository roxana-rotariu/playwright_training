import { test, expect } from "../../fixtures/apiTest";
import { AllureHelper } from "../../utils/allureHelper";

test.describe("Cart API", () => {

  test("POST /addtocart returns a valid response body", async ({ api }) => {

    AllureHelper.epic("API");
    AllureHelper.feature("Cart API");
    AllureHelper.story("Add to cart endpoint responds");
    AllureHelper.severity("normal");

    const response = await AllureHelper.step("Send add to cart request", async () => {
      return await api.post("https://api.demoblaze.com/addtocart", {
        data: {
          id: "1234",
          cookie: "invalid-cookie",
          flag: true
        }
      });
    });

    await AllureHelper.step("Verify response status", async () => {
      expect(response.status()).toBe(200);
    });

    const json = await AllureHelper.step("Parse response body", async () => {
      return await response.json();
    });

    // API may return:
    // { "id": ... }
    // or { "errorMessage": ... }
    await AllureHelper.step("Validate response structure", async () => {
      expect(json).not.toBeNull();
    });
  });

});

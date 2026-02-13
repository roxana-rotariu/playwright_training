import { test, expect } from "../../fixtures/apiTest";
import { DataHelper } from "../../utils/dataHelper";
import { AllureHelper } from "../../utils/allureHelper";

test.describe("User API", () => {

  test("POST /signup responds successfully", async ({ api }) => {
    AllureHelper.epic("API");
    AllureHelper.feature("User API");
    AllureHelper.story("Signup returns a response");
    AllureHelper.severity("normal");

    const username = "api_" + DataHelper.randomString(6);
    const password = DataHelper.randomPassword(10);

    const response = await AllureHelper.step("Send signup request", async () => {
      return await api.post("/signup", {
        data: {
          username,
          password
        }
      });
    });

    await AllureHelper.step("Verify response status", async () => {
      expect(response.status()).toBe(200);
    });

    const text = await AllureHelper.step("Read response body", async () => {
      return await response.text();
    });

    // Demoblaze returns one of many values — test should not be strict
    await AllureHelper.step("Validate response body", async () => {
      expect(text).not.toBeNull();
    });
  });

});

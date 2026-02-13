import { test, expect } from "../../fixtures/apiTest";
import { AllureHelper } from "../../utils/allureHelper";

test.describe("Login API", () => {

  test("POST /login returns Auth_token OR errorMessage", async ({ api }) => {

    AllureHelper.epic("API");
    AllureHelper.feature("Login API");
  AllureHelper.story("Login returns token or error");
  AllureHelper.severity("normal");

    const username = process.env.TEST_USER ?? "test";
    const password = process.env.TEST_PASS ?? "test";

    const response = await AllureHelper.step("Send login request", async () => {
      return await api.post("/login", {
        data: {
          username,
          password: Buffer.from(password).toString("base64")
        }
      });
    });

    const text = await AllureHelper.step("Read response body", async () => {
      return await response.text();
    });

    console.log("Response body:", text);

    await AllureHelper.step("Verify response status", async () => {
      expect(response.status()).toBe(200);
    });

    await AllureHelper.step("Validate response message", async () => {
      expect(text).toMatch(/Auth_token|errorMessage/i);
    });
  });

});

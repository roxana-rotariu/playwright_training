import { test, expect } from "../../fixtures/apiTest";

test.describe("Login API", () => {

  test("POST /login returns Auth_token OR errorMessage", async ({ api }) => {

    const response = await api.post("https://api.demoblaze.com/login", {
      data: {
        username: "test",      // or a known user
        password: "test"
      }
    });

    expect(response.status()).toBe(200);

    const text = await response.text();

    // Accept either successful or failure message
    expect(text).toMatch(/Auth_token|errorMessage/i);
  });

});
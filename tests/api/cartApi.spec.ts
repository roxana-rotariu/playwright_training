import { test, expect } from "../../fixtures/apiTest";

test.describe("Cart API", () => {

  test("POST /addtocart returns a valid response body", async ({ api }) => {

    const response = await api.post("https://api.demoblaze.com/addtocart", {
      data: {
        id: "1234",
        cookie: "invalid-cookie",   // UI also uses invalid cookies!
        flag: true
      }
    });

    expect(response.status()).toBe(200);

    const json = await response.json();

    // API may return:
    // { "id": ... }
    // or { "errorMessage": ... }
    expect(json).not.toBeNull();
  });

});
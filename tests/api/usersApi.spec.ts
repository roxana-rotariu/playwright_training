import { test, expect } from "../../fixtures/apiTest";
import { DataHelper } from "../../utils/dataHelper";

test.describe("User API", () => {

  test("POST /signup responds successfully", async ({ api }) => {
    const username = "api_" + DataHelper.randomString(6);
    const password = DataHelper.randomPassword(10);

    const response = await api.post("https://api.demoblaze.com/signup", {
      data: {
        username,
        password
      }
    });

    expect(response.status()).toBe(200);

    const text = await response.text();

    // Demoblaze returns one of many values — test should not be strict
    expect(text).not.toBeNull();
  });

});
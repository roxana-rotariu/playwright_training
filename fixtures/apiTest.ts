import { test as base, expect, APIRequestContext } from "@playwright/test";

export type ApiFixtures = {
  api: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    // Use Playwright's built-in API client
    await use(request);
  },
});

export { expect };
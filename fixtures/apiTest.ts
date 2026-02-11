import { test as base, expect, APIRequestContext, request as apiRequest } from "@playwright/test";

export type ApiFixtures = {
  api: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    const context = await apiRequest.newContext({
      timeout: 30_000,
    });
    await use(context);
    await context.dispose();
  },
});

export { expect };

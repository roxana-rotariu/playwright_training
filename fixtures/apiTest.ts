import { test as base, expect, APIRequestContext, request as apiRequest } from "@playwright/test";
import { ENV, EnvName } from "../config/environments";

export type ApiFixtures = {
  api: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    const env = (process.env.TEST_ENV as EnvName) || "dev";
    const validEnvs: EnvName[] = ["dev", "stage", "prod"];
    const envName: EnvName = validEnvs.includes(env) ? env : "dev";

    const context = await apiRequest.newContext({
      timeout: 30_000,
      baseURL: ENV[envName].apiBaseURL,
    });
    await use(context);
    await context.dispose();
  },
});

export { expect };

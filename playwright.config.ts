import { defineConfig } from "@playwright/test";
import { ENV, EnvName } from "./config/environments";

const env = (process.env.TEST_ENV as EnvName) || "dev";

// Validate env name
const validEnvs: EnvName[] = ["dev", "stage", "prod"];
const envName: EnvName = validEnvs.includes(env) ? env : "dev";

export default defineConfig({
    // Global test timeout
    timeout: 60_000,

    // Global run timeout
    globalTimeout: 10 * 60 * 1000,

    // Test retries (CI only)
    retries: process.env.CI ? 2 : 0,

    // Worker count
    workers: process.env.CI ? 2 : undefined,

    // Reporters
    reporter: [["html", { open: "never" }], ["allure-playwright"]],

    use: {
        video: "on",
        trace: "on",
        screenshot: "on",
        // Base URL from environment
        baseURL: ENV[envName].baseURL,

        headless: true,

        // Timeouts
        actionTimeout: 10_000,
        navigationTimeout: 30_000,

        // Additional stability flags
        ignoreHTTPSErrors: true,
    },

    // Test Projects
    projects: [
        {
            name: "smoke",
            testMatch: ["tests/smoke/*.spec.ts"],
        },
        {
            name: "ui-regression",
            testMatch: ["tests/ui/*.spec.ts", "tests/ui/**/*.spec.ts", "tests/hybrid/**/*.spec.ts"],
            grepInvert: /mock/i,
            workers: 1,
        },
        {
            name: "api",
            testMatch: ["tests/api/*.spec.ts"],
        },
        {
            name: "mock",
            testMatch: ["tests/ui/mockProducts.spec.ts"],
            workers: 1,
        },
    ],
});

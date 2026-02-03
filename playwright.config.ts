import { defineConfig, devices } from '@playwright/test';
import { ENV, EnvName } from './config/environments';

const env = (process.env.TEST_ENV as EnvName) || 'dev';



/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 30 * 1000,
  retries: 1,
  workers: 4, // run 4 tests in padrallel

  use: {
    baseURL: ENV[env].baseURL,
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'smoke',
      testMatch: ['tests/smoke/*.spec.ts']
    },
    {
      name: 'ui-regression',
      testMatch: ['tests/ui/*.spec.ts']
    }
  ]
});

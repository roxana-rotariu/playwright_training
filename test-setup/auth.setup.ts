import { test as setup } from "@playwright/test";
import path from "path";
import fs from "fs";
import { ENV, EnvName } from "../config/environments";
import { Navbar } from "../components/Navbar";
import { LoginPage } from "../pages/LoginPage";

const authFile = path.join("test-results", ".auth", "user.json");

setup("authenticate user and save storage state", async ({ page }) => {
  const env = (process.env.TEST_ENV as EnvName) || "dev";
  const validEnvs: EnvName[] = ["dev", "stage", "prod"];
  const envName: EnvName = validEnvs.includes(env) ? env : "dev";

  const username = process.env.TEST_USER ?? "test";
  const password = process.env.TEST_PASS ?? "test";

  await page.goto(ENV[envName].baseURL);

  const navbar = new Navbar(page);
  await navbar.waitForLoad();

  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);
  await loginPage.expectLoginSuccess(username);

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});

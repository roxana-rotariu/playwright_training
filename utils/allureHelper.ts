import { allure } from "allure-playwright";

export const AllureHelper = {
  async step(name: string, fn: () => Promise<void>): Promise<void> {
    return await allure.step(name, async () => {
      await fn();
    });
  }
};
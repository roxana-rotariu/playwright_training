import { test as base } from "./pageFixtures";

type DataFixtures = {
    productName: string;
};

export const test = base.extend<DataFixtures>({
    productName: [
        "Nokia lumia 1520", { option: true }
    ],
});

export { expect } from "@playwright/test";

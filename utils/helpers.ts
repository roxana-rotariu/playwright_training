import { Locator, Page, expect } from "@playwright/test";

/**
 * Generic helpers used across framework.
 * These functions do NOT belong to a specific page or domain.
 */
export const Helpers = {

    /**
     * Safely clicks a locator with full auto-waiting.
     * Includes: visible → enabled → stable → clickable
     */
    async safeClick(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
        await expect(locator).toBeEnabled();
        await locator.click();
    },

    /**
     * Safely fills an input.
     */
    async safeFill(locator: Locator, value: string): Promise<void> {
        await expect(locator).toBeVisible();
        await locator.fill(value);
    },

    /**
     * Normalize text by trimming spaces and removing line breaks.
     */
    normalize(text: string): string {
        return text.replace(/\s+/g, " ").trim();
    },

    /**
     * Capitalize the first letter of a string.
     */
    capitalize(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    },

    /**
     * Convert a string to a URL-friendly slug.
     */
    toSlug(value: string): string {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    },

    /**
     * Pick a random element from an array.
     */
    pickRandom<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Shuffle an array (Fisher–Yates).
     */
    shuffle<T>(array: T[]): T[] {
        let m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    },

    /**
     * Assert that the current URL contains a fragment.
     */
    async assertUrlContains(page: Page, fragment: string) {
        await expect(page).toHaveURL(new RegExp(fragment));
    },

    /**
     * Log steps in a readable format (great for debugging).
     */
    logStep(message: string): void {
        console.log(`\n--- STEP: ${message} ---`);
    },

    /**
     * Wait for a specific amount of time (use sparingly).
     */
    async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
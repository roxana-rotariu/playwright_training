import type { Page, TestInfo } from "@playwright/test";
import { allure } from "allure-playwright";  // legacy API for steps + labels

export class AllureHelper {

  // -----------------------------
  //  VIDEO ATTACHMENT (new API)
  // -----------------------------
  static async attachVideo(page: Page, testInfo: TestInfo) {
    try {
      const video = page.video();
      if (video) {
        const filePath = await video.path();
        await testInfo.attach("Video", {
          path: filePath,
          contentType: "video/webm",
        });
      }
    } catch {}
  }

  // -----------------------------
  //  SCREENSHOT ATTACHMENT (new API)
  // -----------------------------
  static async attachScreenshot(page: Page, testInfo: TestInfo, name = "Screenshot") {
    try {
      const buffer = await page.screenshot();
      await testInfo.attach(name, {
        body: buffer,
        contentType: "image/png",
      });
    } catch {}
  }

  // -----------------------------
  //  TRACE ATTACHMENT (new API)
  // -----------------------------
  static async attachTrace(testInfo: TestInfo) {
    try {
      for (const attachment of testInfo.attachments || []) {
        if (attachment.name === "trace") {
          await testInfo.attach("Trace", {
            path: attachment.path!,
            contentType: "application/zip",
          });
        }
      }
    } catch {}
  }

  // -----------------------------
  //  ⭐ ALLURE STEP (legacy API)
  // -----------------------------
  static async step(name: string, fn: () => Promise<void>): Promise<void> {
    return await allure.step(name, async () => {
      await fn();
    });
  }

  // -----------------------------
  //  LABELS (legacy API)
  // -----------------------------
  static epic(name: string) {
    allure.label("epic", name);
  }

  static feature(name: string) {
    allure.label("feature", name);
  }

  static story(name: string) {
    allure.label("story", name);
  }

  static severity(level: "blocker" | "critical" | "normal" | "minor" | "trivial") {
    allure.severity(level);
  }

  static parameter(name: string, value: string) {
    allure.parameter(name, value);
  }
}
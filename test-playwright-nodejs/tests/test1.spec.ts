import { test, expect } from "@playwright/test";

test("test1", async ({ page }) => {
  await page.goto("https://www.wikipedia.org/");
});

test("test2", async ({ page }) => {
  await page.goto("https://www.wikipedia.org/");
  await page.screenshot({ path: "screenshot.png" });
});

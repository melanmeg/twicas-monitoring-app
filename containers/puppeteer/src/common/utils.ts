import { Page } from "puppeteer";

export async function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1000 * seconds));
}

// 実質的な配信中であるかの判定処理
export async function checkStreaming(page: Page, timeout: number = 5000) {
  try {
    await page.waitForSelector("body", {
      visible: true,
      timeout: timeout,
    });

    // `data-is-onlive` の値を取得
    const isOnLive = await page.evaluate(() => {
      return document.body.getAttribute("data-is-onlive");
    });

    if (isOnLive === "false") {
      console.log("Streaming is not on live.");
      throw new Error("Streaming is not on live.");
    }
  } catch (e) {
    console.error("Error waiting for selector.");
    throw e;
  }
}

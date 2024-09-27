import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { recordMedia } from "./record-media.js";

// __dirnameの代替として、現在のディレクトリを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, 1000 * seconds));
}

(async () => {
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // "--enable-live-caption-pref-for-testing",
    ],
    defaultViewport: null,
    headless: true,
  });

  const page = await browser.newPage();
  // 解像度を設定 (デフォルトは1280x720っぽい)
  // await page.setViewport({ width: 800, height: 600 });

  const downloadPath = path.resolve(__dirname, "downloads");
  fs.mkdirSync(downloadPath, { recursive: true });
  await page._client().send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
  );

  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(`BROWSER LOG: ${msg.text()}`);
    }
  });

  // await page.goto("https://twitcasting.tv/kirakira_jk_da");
  await page.goto(
    "https://www.youtube.com/watch?v=BILQV4gAOGI&list=RDBILQV4gAOGI&start_radio=1"
  );

  await Promise.all([
    recordMedia(page, 20000, "audio.webm", true), // 20秒間音声録音
    recordMedia(page, 20000, "video.webm", false), // 20秒間動画録音
  ]);

  await wait(3);
  await browser.close();
})();

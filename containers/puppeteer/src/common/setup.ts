import puppeteer, { Browser, Page } from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import { Config } from "../environments.js";

// __dirnameの代替として、現在のディレクトリを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupBrowser(): Promise<Browser> {
  return await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--enable-live-caption-pref-for-testing",
    ],
    defaultViewport: null,
    headless: true,
  });
}

export async function setupPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();

  const downloadPath = path.resolve(__dirname, "..", "..", Config.DOWNLOAD_DIR);
  const client = await page.createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });

  await page.setUserAgent(Config.USER_AGENT);

  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(`BROWSER LOG: ${msg.text()}`);
    }
  });

  return page;
}

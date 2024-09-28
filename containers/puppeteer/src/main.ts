import { wait } from "./common/utils.js";
import { setupBrowser, setupPage } from "./common/setup.js";
import { webhook } from "./api/webhook.js";

(async () => {
  const browser = await setupBrowser();
  const page = await setupPage(browser);

  await webhook(page);

  await wait(3);
  await browser.close();
})();

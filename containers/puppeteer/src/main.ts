import { wait } from "./common/utils.js";
import { setupBrowser, setupPage, setupLogDir } from "./common/setup.js";
import { webhook } from "./api/webhook.js";
import { twicasMonitoring } from "./api/twicas_monitoring.js";

const userId = "nyr_6r";

(async () => {
  const browser = await setupBrowser();
  const page = await setupPage(browser);

  await setupLogDir();
  await webhook(page);
  // await twicasMonitoring(page, userId);

  await wait(3);
  await browser.close();
})();

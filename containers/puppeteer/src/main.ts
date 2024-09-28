import { setupLogDir } from "./common/setup.js";
import { webhook } from "./api/webhook.js";

(async () => {
  await setupLogDir();
  await webhook();
})();

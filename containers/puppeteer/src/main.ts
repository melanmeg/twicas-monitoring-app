import { setupLogDir } from "./common/setup.js";
import { consumeMessageOne } from "./api/consume_one.js";

(async () => {
  await setupLogDir();
  await consumeMessageOne();

  // SIGTERMを送信
  process.kill(process.pid, "SIGTERM");
})();

import "./dotenv.js";

export class Config {
  static readonly YOUTUBE_TEST_URL: string = process.env.YOUTUBE_TEST_URL!;

  static readonly OPENSEARCH_URL: string = process.env.OPENSEARCH_URL!;

  static readonly OPENSEARCH_USER: string = process.env.OPENSEARCH_USER!;

  static readonly OPENSEARCH_PASSWORD: string =
    process.env.OPENSEARCH_PASSWORD!;

  static readonly USER_AGENT: string = process.env.USER_AGENT!;

  static readonly DOWNLOAD_DIR: string = process.env.DOWNLOAD_DIR!;

  static readonly PORT_NUM: number = parseInt(process.env.PORT_NUM!, 10);

  static readonly LOG_DIR: string = process.env.LOG_DIR!;

  static readonly LOG_FILE_PATH: string = `${Config.LOG_DIR}/webhook.log`;
}

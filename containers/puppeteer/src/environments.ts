import "./dotenv.js";

export class Config {
  static readonly YOUTUBE_TEST_URL: string = process.env.YOUTUBE_TEST_URL!;

  static readonly OPENSEARCH_URL: string = process.env.OPENSEARCH_URL!;

  static readonly OPENSEARCH_USER: string = process.env.OPENSEARCH_USER!;

  static readonly OPENSEARCH_PASSWORD: string =
    process.env.OPENSEARCH_PASSWORD!;

  static readonly USER_AGENT: string = process.env.USER_AGENT!;

  static readonly DOWNLOAD_DIR: string = process.env.DOWNLOAD_DIR!;

  static readonly LOG_DIR: string = process.env.LOG_DIR!;

  static readonly LOG_FILE_PATH: string = `${Config.LOG_DIR}/mqhook.log`;

  static readonly RABBITMQ_URL: string = process.env.RABBITMQ_URL!;

  static readonly RABBITMQ_PORT: number = parseInt(
    process.env.RABBITMQ_PORT!,
    10
  );

  static readonly RABBITMQ_USER: string = process.env.RABBITMQ_USER!;

  static readonly RABBITMQ_PASSWORD: string = process.env.RABBITMQ_PASSWORD!;
}

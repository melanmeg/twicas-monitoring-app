export class Config {
  static readonly YOUTUBE_TEST_URL: string = "https://www.youtube.com/watch?v=BILQV4gAOGI&list=RDBILQV4gAOGI&start_radio=1";
  // static readonly USER_ID: string = "c:mairu_da";
  static readonly USER_ID: string = "nyr_6r";

  static readonly TWICAS_USER_URL: string = `https://twitcasting.tv/${Config.USER_ID}`;
  static readonly LOKI_URL: string = "http://x.x.x.x:3100/loki/api/v1/push"

  static readonly USER_AGENT: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";
  static readonly DOWNLOAD_DIR: string = "downloads";

  static readonly PORT_NUM: number = 18080;
  static readonly LOG_DIR: string = "/root/work/log/";
  static readonly LOG_FILE_PATH: string = `${Config.LOG_DIR}webhook.log`;
}

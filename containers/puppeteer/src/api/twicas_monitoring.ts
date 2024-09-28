import { TimeoutError, Page } from "puppeteer";
import { recordMedia } from "./record_media.js";
import { collectComments } from "./collect_comments.js";
// import { wait } from '../common/utils.js';

export async function twicasMonitoring(
  page: Page,
  userId: string
): Promise<void> {
  // ツイキャス用
  const twicasUserUrl = `https://twitcasting.tv/${userId}`;
  await page.goto(twicasUserUrl);
  // ツイキャス配信の再生ボタン
  const selector =
    "#player > div > div.tw-stream-movie-layout__movie > div > div.tw-play-button-layer.tw-play-button-layer--mandatory.tw-big-play-button > div > button";
  try {
    const element = await page.waitForSelector(selector, {
      visible: true,
      timeout: 5000,
    });
    if (element) {
      await element.click();
    } else {
      console.warn("指定した要素が見つかりませんでした");
    }
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.info(
        "要素が指定された時間内に見つかりませんでしたが、処理を続けます。"
      );
    } else {
      console.error("エラー:", error); // 他のエラーを表示
    }
  }

  // Youtube テスト用
  // await page.goto(Config.YOUTUBE_TEST_URL);
  // await wait(3);
  // await page.evaluate(() => {
  //   const playButton = document.querySelector('button[aria-label="再生"]') as HTMLButtonElement;
  //   if (playButton) playButton.click();
  // });

  await Promise.all([
    recordMedia(page, 10000, "audio.webm", true), // 音声録音
    // recordMedia(page, 10000, "video.webm", false), // 動画録音
    collectComments(page, userId), // コメント収集
  ]);
}

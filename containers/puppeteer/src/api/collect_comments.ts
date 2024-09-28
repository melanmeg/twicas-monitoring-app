import { Page } from "puppeteer";
import * as cheerio from "cheerio";
import axios from "axios";

import { Config } from "../environments.js";
import { CommentData, CommentValues } from "../interfaces.js";

export async function fetchComments(page: Page): Promise<CommentData | null> {
  const html: string = await page.content(); // ページのHTMLコンテンツを取得
  const $ = cheerio.load(html); // cheerioを使ってHTMLをパース
  const contentDiv = $(
    "#comment-list-app > div.tw-comment-list-view.tw-player-page__comment__list > div.tw-comment-list-view__scroller"
  );

  if (contentDiv.length === 0) {
    console.log("List is empty.");
    return null;
  }

  const name: string[] = contentDiv
    .find(".tw-comment-item-name")
    .map((i, el) => $(el).text())
    .get();
  const id: string[] = contentDiv
    .find(".tw-comment-item-screen-id")
    .map((i, el) => $(el).text())
    .get();
  const comment: string[] = contentDiv
    .find(".tw-comment-item-comment")
    .map((i, el) => $(el).text())
    .get();
  const date: string[] = contentDiv
    .find(".tw-comment-item-date")
    .map((i, el) => $(el).text())
    .get();

  return { name, id, comment, date };
}

export async function postCommentToLoki(
  userId: string,
  name: string[],
  id: string[],
  comment: string[],
  date: string[]
): Promise<void> {
  const currentUnixTime = Math.floor(Date.now() * 10 ** 6); // ナノ秒のタイムスタンプを生成
  const headers = { "Content-Type": "application/json" };

  const values: CommentValues = {
    name: name[0],
    id: id[0],
    comment: comment[0],
    date: date[0],
  };

  const data = {
    streams: [
      {
        stream: { twicas: `${userId}/comments` },
        values: [[String(currentUnixTime), JSON.stringify(values)]],
      },
    ],
  };

  try {
    await axios.post(Config.LOKI_URL, data, { headers });
    console.log("Comment posted to Loki");
  } catch (error) {
    console.error("Error posting comment to Loki:", error);
  }
}

export async function collectComments(
  page: Page,
  userId: string,
  flag: boolean = true
): Promise<void> {
  await page.waitForSelector(
    "#comment-list-app > div.tw-comment-list-view.tw-player-page__comment__list > div.tw-comment-list-view__scroller"
  );

  let oldId = "",
    oldComment = "";
  while (flag) {
    await new Promise((r) => setTimeout(r, 100)); // 0.1秒スリープ
    const commentsData = await fetchComments(page);
    if (commentsData) {
      const { name, id, comment, date } = commentsData;
      if (oldId !== id[0] && oldComment !== comment[0]) {
        // await postCommentToLoki(userId, name, id, comment, date);
        oldId = id[0];
        oldComment = comment[0];

        console.info("Names:", name[0]);
        console.info("IDs:", id[0]);
        console.info("Comments:", comment[0]);
        console.info("Dates:", date[0]);
      }
    } else {
      console.log("No comments data available.");
    }
  }
}

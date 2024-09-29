import { Page } from "puppeteer";
import * as cheerio from "cheerio";
import { Client } from "@opensearch-project/opensearch";

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

export async function postCommentToOpensearch(
  userId: string,
  name: string[],
  id: string[],
  comment: string[],
  date: string[]
): Promise<void> {
  const client = new Client({
    node: Config.OPENSEARCH_URL,
    auth: {
      username: Config.OPENSEARCH_USER,
      password: Config.OPENSEARCH_PASSWORD,
    },
    ssl: {
      rejectUnauthorized: false, // SSL証明書の検証を無効化
    },
  });

  const currentDate = new Date();
  const currentTimestamp = currentDate.toISOString();

  const values: CommentValues = {
    name: name[0],
    id: id[0],
    comment: comment[0],
    date: date[0],
  };

  const data = {
    timestamp: currentTimestamp,
    userId: userId,
    values: values,
  };

  try {
    const response = await client.index({
      index: "comments-index", // インデックス名
      body: data,
    });
    console.log(
      `Comment posted to OpenSearch - ID: ${response.body._id}, Status: ${
        response.statusCode
      }, Result: ${response.body.result}, Shards: ${JSON.stringify(
        response.body._shards
      )}`
    );
  } catch (error) {
    console.error("Error posting comment to Opensearch:", error);
  }
}

export async function collectComments(
  page: Page,
  userId: string,
  signal: AbortSignal,
  flag: boolean = true
): Promise<void> {
  signal.addEventListener("abort", () => {
    console.info(`${userId}: Monitoring aborted`);
  });

  const selector =
    "#comment-list-app > div.tw-comment-list-view.tw-player-page__comment__list > div.tw-comment-list-view__scroller";
  await page.waitForSelector(selector, {
    visible: true,
    timeout: 5000,
  });

  let oldId = "",
    oldComment = "";
  while (flag) {
    // 任意のモニタリング処理
    if (signal.aborted) {
      console.info(`${userId}: Aborting monitoring...`);
      break;
    }

    await new Promise((r) => setTimeout(r, 100)); // 0.1秒スリープ
    const commentsData = await fetchComments(page);
    if (commentsData) {
      const { name, id, comment, date } = commentsData;
      if (oldId !== id[0] && oldComment !== comment[0]) {
        await postCommentToOpensearch(userId, name, id, comment, date);
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

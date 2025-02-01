import * as fs from "fs";
import { Page } from "puppeteer";
import { IncomingWebHookResponse } from "../interfaces.js";
import { Config } from "../environments.js";
import { twicasMonitoring } from "./twicas_monitoring.js";
import { setupBrowser, setupPage } from "../common/setup.js";

const log = (message: string) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(Config.LOG_FILE_PATH, `${timestamp} - INFO - ${message}\n`);
};

const processMap = new Map<string, AbortController>(); // userIdごとにAbortControllerを管理

export async function liveStart(page: Page, userId: string): Promise<void> {
  console.info(`${userId}: Live Start`);

  const abortController = new AbortController(); // キャンセル用のコントローラー
  // プロセスを実行して保存
  processMap.set(userId, abortController);

  try {
    await twicasMonitoring(page, userId, abortController.signal); // キャンセル可能な処理
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      console.info(`${userId}: Process aborted`);
    } else {
      console.error("Unexpected error");
      throw e;
    }
  }
}

export async function liveEnd(userId: string): Promise<void> {
  console.info(`${userId}: Live End`);

  // 該当するuserIdのプロセスが存在すれば終了
  const controller = processMap.get(userId);
  if (controller) {
    controller.abort(); // プロセスのキャンセル
    console.info(`${userId}: Process terminated`);
    processMap.delete(userId);
  } else {
    console.warn(`${userId}: No process found`);
  }
}

export async function mqhook(msg: string): Promise<void> {
  log("| ---------------------------- |");
  log("| ---------------------------- |");
  log("| ----- WebhookIncoming! ----- |");
  log("| -------- twicasting -------- |");
  log("| ---------------------------- |");
  log("| ------- Incoming Data ------ |");
  log(msg);
  log("| ---------------------------- |");

  // JSON.parseを使ってbodyをオブジェクトに変換
  let parsedBody: IncomingWebHookResponse;
  try {
    parsedBody = JSON.parse(msg);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    log("Failed to parse JSON body: " + errorMessage);

    console.error("Failed to parse JSON body: " + errorMessage);
    throw e;
  }

  const is_live: boolean = parsedBody.broadcaster.is_live;
  const userId: string = parsedBody.broadcaster.screen_id;

  const browser = await setupBrowser();
  const page = await setupPage(browser);

  if (is_live) {
    await liveStart(page, userId);
  } else {
    await liveEnd(userId);
  }
}

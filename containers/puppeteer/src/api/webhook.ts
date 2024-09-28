import * as http from 'http';
import * as fs from 'fs';
// import * as path from 'path';
import { Page } from "puppeteer";
// import { spawn, ChildProcess } from 'child_process';
import { IncomingWebHookResponse } from '../interfaces.js';
import { Config } from '../environments.js'
import { twicasMonitoring } from './twicas_monitoring.js'

// let processes: ChildProcess[] = [];

const log = (message: string) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(Config.LOG_FILE_PATH, `${timestamp} - INFO - ${message}\n`);
};

export async function liveStart(page: Page, userId: string): Promise<void> {
  console.info(`${userId}: Live Start`);
  await Promise.all([
    twicasMonitoring(page, userId), // コメント収集
  ]);
  console.info(`${userId}: Start`);
}

export function liveEnd(userId: string): void {
  console.info(`${userId}: Live End`);
}

// export function liveStart(page: Page, userId: string): void {
//   console.info(`${userId}: Live Start`);
//   const process = spawn('node', [path.join(__dirname, 'backgroundTask.js'), userId], {
//     detached: true,
//     stdio: 'ignore',
//   });

//   process.unref();
//   processes.push(process);
//   console.info(`${userId}: Background Process Start`);
// }

// export function liveEnd(userId: string): void {
//   console.info(`${userId}: Live End`);
//   processes.forEach((process) => {
//     if (process.pid) {
//       process.kill();
//       console.info(`${userId}: Background Process Terminate`);
//     }
//   });
// }

export async function webhook(page: Page): Promise<void> {
    const server = http.createServer((req, res) => {
        if (req.method === 'POST') {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string
            });

            req.on('end', () => {
                log('| ---------------------------- |');
                log('| ---------------------------- |');
                log('| ----- WebhookIncoming! ----- |');
                log('| -------- twicasting -------- |');
                log('| ---------------------------- |');
                log('| ------- Incoming Data ------ |');
                log(body);
                log('| ---------------------------- |');

                // JSON.parseを使ってbodyをオブジェクトに変換
                let parsedBody: IncomingWebHookResponse;
                try {
                    parsedBody = JSON.parse(body);
                } catch (error: unknown) {
                    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
                    log('Failed to parse JSON body: ' + errorMessage);
                    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Invalid JSON');
                    return;
                }

                const is_live: boolean = parsedBody.broadcaster.is_live;
                const userId: string = parsedBody.broadcaster.screen_id;

                if (is_live) {
                    liveStart(page, userId);
                } else {
                    liveEnd(userId);
                }

                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end();
            });
        } else {
            res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Method Not Allowed');
        }
    });

    server.listen(Config.PORT_NUM, () => {
        log(`Server running at http://localhost:${Config.PORT_NUM}/`);
    });
}

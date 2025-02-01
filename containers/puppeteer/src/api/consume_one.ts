import amqp from "amqplib";
import { Config } from "../environments.js";
import { mqhook } from "./mqhook.js";

export async function consumeMessageOne() {
  try {
    // RabbitMQ接続設定
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: Config.RABBITMQ_URL,
      port: Config.RABBITMQ_PORT,
      username: Config.RABBITMQ_USER,
      password: Config.RABBITMQ_PASSWORD,
    });
    const channel = await connection.createChannel();

    // キューの宣言
    await channel.assertQueue("my_queue", { durable: false });
    console.log("キューの宣言が完了しました");

    // メッセージを1件取得
    const msg = await channel.get("my_queue", { noAck: false });

    if (msg) {
      try {
        console.log(`受信したメッセージ: ${msg.content.toString()}`);
        console.log("メッセージの処理が正常に完了しました");

        // mqhook関数を呼び出し
        await mqhook(msg.content.toString());

        // 処理が成功した場合にACKを送信
        channel.ack(msg);
      } catch (e) {
        console.error("予期せぬエラー");
        // 処理に失敗した場合はACKを送信せず、再試行させる
        channel.nack(msg, false, true);
        throw e;
      }
    } else {
      console.log("メッセージがありません");
    }

    // 終了処理
    await channel.close();
    await connection.close();
  } catch (e) {
    console.error("consumeMessageOne エラー");
    throw e;
  }
}

import amqp from "amqplib";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function consumeMessage() {
  try {
    // RabbitMQ接続設定
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "192.168.11.161",
      port: 8091,
      username: "admin",
      password: "admin",
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
        await sleep(100000); // Added sleep

        // 処理が成功した場合にACKを送信
        channel.ack(msg);
      } catch (e) {
        console.error(`エラーが発生しました: ${e}`);
        // 処理に失敗した場合はACKを送信せず、再試行させる
        channel.nack(msg, false, true);
      }
    } else {
      console.log("メッセージがありません");
    }

    // 終了処理
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error(`接続エラー: ${error}`);
  }
}

consumeMessage();

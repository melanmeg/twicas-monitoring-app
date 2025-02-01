from time import sleep

import pika

# RabbitMQ接続設定
credentials = pika.PlainCredentials("admin", "admin")
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host="192.168.11.161", port=8091, credentials=credentials)
)
channel = connection.channel()

# キューの宣言
channel.queue_declare(queue="my_queue")
print("キューの宣言が完了しました")

# メッセージを1件取得
method_frame, properties, body = channel.basic_get(queue="my_queue", auto_ack=False)

if method_frame:
    try:
        print(f"受信したメッセージ: {body.decode()}")
        # メッセージの処理を実行
        # ここに処理ロジックを追加
        print("メッセージの処理が正常に完了しました")
        sleep(1000)

        # 処理が成功した場合にACKを送信
        channel.basic_ack(delivery_tag=method_frame.delivery_tag)
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        # 処理に失敗した場合はACKを送信せず、再試行させる
        channel.basic_nack(delivery_tag=method_frame.delivery_tag, requeue=True)
else:
    print("メッセージがありません")

# 終了処理
channel.close()
connection.close()

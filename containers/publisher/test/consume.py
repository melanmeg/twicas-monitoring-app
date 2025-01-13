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


# メッセージ処理コールバック
def callback(ch, method, properties, body):
    try:
        print(f"受信したメッセージ: {body.decode()}")
        # メッセージの処理を実行
        # ここに処理ロジックを追加
        print("メッセージの処理が正常に完了しました")

        # 処理が成功した場合にACKを送信
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        # 処理に失敗した場合はACKを送信せず、再試行させる
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)


# メッセージの消費設定
channel.basic_consume(
    queue="my_queue", on_message_callback=callback, auto_ack=False  # 明示的なACKを利用
)

print("メッセージを待機しています...")
try:
    channel.start_consuming()
except KeyboardInterrupt:
    print("停止されました。")

# 終了処理
channel.close()
connection.close()

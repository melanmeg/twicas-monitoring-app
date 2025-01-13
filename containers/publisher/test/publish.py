import pika

# RabbitMQ接続設定
credentials = pika.PlainCredentials("admin", "admin")
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host="192.168.11.161", port=8091, credentials=credentials)
)
channel = connection.channel()

# キューの宣言
channel.queue_declare(queue="my_queue")

# メッセージ送信
message = "テストメッセージ"
channel.basic_publish(
    exchange="",  # デフォルトのエクスチェンジを使用
    routing_key="my_queue",  # 宛先キューの名前
    body=message,  # メッセージの内容
)
print(f"メッセージを送信しました: {message}")

# 接続を閉じる
channel.close()
connection.close()

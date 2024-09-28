# twicas-monitoring-app

## 概要

### puppeteer
- webhookを利用
- コメントをリアルタイム収集
- 録画・録音

### flask
- webhook するユーザーを登録

### ffmpeg
- コーデック変換したい時用

## コマンド

### puppeteer

```bash
# puppeteer
node test.js
```

### ffmpeg
```bash
# コーデック確認
ffprobe input.mp4

### webm to webm (音声だけそのまま抽出)
ffmpeg -i input.mp4 -c:a copy -q:a 0 -map a output.mp3

# webm to mp4 (メタデータ付与と音声コーデックをopusからmp3へ変換)
ffmpeg -i input.webm -c:v copy -c:a libmp3lame output.mp4

# webm to mp3 (メタデータ付与と音声コーデックをopusからmp3へ変換)
ffmpeg -i input.webm -c:a libmp3lame -q:a 0 output.mp3

# webm or mp4 to mp3 (メタデータ付与と音声コーデックをopusからmp3へ変換)
ffmpeg -i input.mp4 -c:a libmp3lame -q:a 0 -map a output.mp3
```

### デバイス情報確認
```bash
sudo lspci # PCIデバイスを一覧表示する
sudo lspci -v | grep VGA # VGA確認
sudo lspci -v | grep Ethernet # ネットワークカード確認
sudo lspci -v | grep Audio # オーディオデバイス確認
```

### kvm
```bash
# オプションメモ
# --video model=qxl \
# --soundhw ich6 \

# メモ
sudo apt-get install -y \
  libatk1.0-0 libatk-bridge2.0-0 libnss3 libxss1 libxrandr2 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 \
  libasound2t64 \
  libcups2 \
  libgbm1 \
  libpango-1.0-0 libpangocairo-1.0-0 \
# ↑これは↓ので一括で入ると思われる
chromium-browser
```


## タスク
> dockerで録画・録音の成功まではきた。

-　webhook実装もjs,tsで、puppeteerコンテナ完成させる
- scyllaDB容易・使い方
- scyllaDBと連携
- webで可視化
- k8sに載せて動くかシンプルテスト
- k8sに載せる方法考える

## テスト

```bash
curl -X POST -H "Content-Type: application/json" -d ' {"signature": "hoge","broadcaster": {"screen_id": "twitcasting_jp", "is_live": "true"}}' http://localhost:18080

```

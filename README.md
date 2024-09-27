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

# webm to mp4 (メタデータ付与と音声コーデックをopusからmp3へ変換)
ffmpeg -i input.webm -c:v copy -c:a libmp3lame output.mp4

# webm to mp3 (メタデータ付与と音声コーデックをopusからmp3へ変換)
ffmpeg -i input.webm -c:a libmp3lame -q:a 0 output.mp3

# mp4 to mp3
ffmpeg -i input.mp4 -q:a 0 -map a output.mp3
```

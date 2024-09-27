# twicas-monitoring-app

## 概要

### flask

- webhook するユーザーを登録

### webhook

- webhook を利用
- コメントをリアルタイム収集

## コマンド

### puppeteer

```bash
# puppeteer
node test.js
```

### ffmpeg
```bash
### mp4
ffmpeg -i input.mp4 -c:v copy -c:a aac -b:a 128k output.mp4
# 試してない
ffmpeg -i input.mp4 -i audio.mp3 -c:v copy -c:a aac -b:a 128k output.mp4

### mp3
# ffmpeg -i input.mp3 -c:a libmp3lame -b:a 192k output.mp3
# ffmpeg -encoders | grep mp3
ffmpeg -i input.mp3 -c:a aac -b:a 192k output.m4a
```

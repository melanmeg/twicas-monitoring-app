import puppeteer from "puppeteer-core";

async function wait(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, 1000 * seconds));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Users\\528na\\.cache\\puppeteer\\chrome\\win64-129.0.6668.70\\chrome-win64\\chrome.exe",
    defaultViewport: null,
    headless: false,
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
  );

  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(`BROWSER LOG: ${msg.text()}`);
    }
  });

  await page.goto("https://twitcasting.tv/aika_meido");

  await recordMedia(page, 30000, "audio.mp3", true); // 30秒間音声録音
  await recordMedia(page, 30000, "video.mp4", false); // 30秒間動画録音

  await wait(70);
  await browser.close();
})();

async function recordMedia(
  page,
  duration: number,
  filename: string,
  isAudio: boolean
) {
  await page.evaluate(
    async (duration, filename, isAudio) => {
      const video = document.querySelector("video");
      if (!video) {
        console.log("Video element not found");
        return;
      }

      const mediaStream = video.captureStream();
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = audioContext.createMediaElementSource(video);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      source.connect(audioContext.destination); // 音声再生用に接続

      const mediaRecorder = new MediaRecorder(
        isAudio ? destination.stream : mediaStream
      );
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: isAudio ? "audio/mp3" : "video/mp4",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // ダウンロードファイル名
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      mediaRecorder.start();
      console.log(`${isAudio ? "Audio" : "Video"} recording started`);

      await new Promise((resolve) => {
        setTimeout(() => {
          mediaRecorder.stop();
          console.log(`${isAudio ? "Audio" : "Video"} recording stopped`);
          resolve();
        }, duration);
      });

      video.play();
    },
    duration,
    filename,
    isAudio
  );
}

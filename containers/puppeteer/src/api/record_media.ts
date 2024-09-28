import { Page } from "puppeteer";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }

  interface HTMLVideoElement {
    captureStream(): MediaStream;
  }
}

export async function recordMedia(
  page: Page,
  duration: number,
  filename: string,
  isAudio: boolean
): Promise<void> {
  await page.evaluate(
    async (duration: number, filename: string, isAudio: boolean) => {
      const video = document.querySelector<HTMLVideoElement>("video");
      if (!video) {
        console.log("Video element not found");
        return;
      }

      const mediaStream = video.captureStream();
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      let source: MediaElementAudioSourceNode | undefined;
      if (isAudio) {
        source = audioContext.createMediaElementSource(video);
      }

      const destination = audioContext.createMediaStreamDestination();

      if (isAudio && source) {
        source.connect(destination);
        source.connect(audioContext.destination); // 音声再生用に接続
      }

      const mediaRecorder = new MediaRecorder(
        isAudio ? destination.stream : mediaStream
      );
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
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

      await new Promise<void>((resolve) => {
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

import Hls from "hls.js";
import { type TemplateRef } from "vue";

const streamUrl = "http://localhost:8888/cam/index.m3u8";

const errorHandler = (video, hls) => {
  let attemptedErrorRecovery = null;
  video.value.addEventListener("error", (event) => {
    const mediaError = event.currentTarget.error;
    if (mediaError.code === mediaError.MEDIA_ERR_DECODE) {
      const now = Date.now();
      if (!attemptedErrorRecovery || now - attemptedErrorRecovery > 5000) {
        attemptedErrorRecovery = now;
        hls.recoverMediaError();
      }
    }
  });

  hls.on(Hls.Events.ERROR, (event, data) => {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.MEDIA_ERROR: {
          const now = Date.now();
          if (!attemptedErrorRecovery || now - attemptedErrorRecovery > 5000) {
            console.log(
              `Fatal media error encountered (${video.error}), attempting to recover`,
            );
            attemptedErrorRecovery = now;
            hls.recoverMediaError();
          } else {
            console.log(
              `Skipping media error recovery (only ${now - attemptedErrorRecovery} ms since last error)`,
            );
          }
          break;
        }
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.error("fatal network error encountered", data);
          break;
        default:
          hls.destroy();
          console.warn("hls destroyed");
          break;
      }
    }
  });
};

export const useBroadcaster = (
  videoRef: TemplateRef<HTMLMediaElement | null>,
) => {
  const initStream = () => {
    if (!videoRef.value) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        startPosition: -1,
        maxBufferLength: 5,
        backBufferLength: 0,
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.value);

      errorHandler(videoRef, hls);
    } else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.value.src = streamUrl;
    }
  };

  return {
    initStream,
  };
};

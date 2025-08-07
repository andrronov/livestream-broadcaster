import Hls from "hls.js";
import { type TemplateRef } from "vue";
import { getStreamUrl } from "@/config";

const streamUrl = getStreamUrl();

const errorHandler = (
  video: TemplateRef<HTMLMediaElement | null>,
  hls: Hls,
) => {
  let attemptedErrorRecovery: number | null = null;

  if (!video.value) return;

  video.value.addEventListener("error", (event) => {
    const target = event.currentTarget as HTMLVideoElement;
    const mediaError = target.error;

    if (mediaError && mediaError.code === mediaError.MEDIA_ERR_DECODE) {
      const now = Date.now();
      if (!attemptedErrorRecovery || now - attemptedErrorRecovery > 5000) {
        console.log("Attempting to recover from media decode error");
        attemptedErrorRecovery = now;
        hls.recoverMediaError();
      }
    }
  });

  hls.on(Hls.Events.ERROR, (event, data) => {
    console.log("HLS Error:", data.type, data.details, data.fatal);

    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.MEDIA_ERROR: {
          const now = Date.now();
          if (!attemptedErrorRecovery || now - attemptedErrorRecovery > 5000) {
            console.log("Fatal media error encountered, attempting to recover");
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
          console.error("Fatal network error encountered", data);
          setTimeout(() => {
            console.log("Attempting to reload stream after network error");
            hls.loadSource(streamUrl);
          }, 3000);
          break;
        default:
          console.warn("Unknown fatal error, destroying HLS instance", data);
          hls.destroy();
          break;
      }
    }
  });
};

export const useBroadcaster = (
  videoRef: TemplateRef<HTMLMediaElement | null>,
) => {
  const initStream = () => {
    if (!videoRef.value) {
      console.error("Video element not found");
      return;
    }

    console.log("Initializing stream with URL:", streamUrl);

    if (Hls.isSupported()) {
      const hls = new Hls({
        startPosition: -1,
        maxBufferLength: 5,
        backBufferLength: 0,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.value);

      errorHandler(videoRef, hls);

      hls.on(Hls.Events.MANIFEST_LOADED, () => {
        console.log("Stream manifest loaded successfully");
      });
    } else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("Using native HLS support");
      videoRef.value.src = streamUrl;
    } else {
      console.error("HLS is not supported in this browser");
    }
  };

  return {
    initStream,
  };
};

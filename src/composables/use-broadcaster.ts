import Hls from "hls.js";
import { type TemplateRef } from "vue";

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
  streamUrl: string = import.meta.env.VITE_HLS_URL,
) => {
  let hls: Hls | null = null;

  const initStream = () => {
    if (!videoRef.value) return;

    console.log("Initializing stream with URL:", streamUrl);

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 5,
        maxBufferSize: 5 * 1000 * 1000, // 5 MB
        liveSyncDuration: 2,
        liveMaxLatencyDuration: 3,
        backBufferLength: 0,
        lowLatencyMode: false,
        autoStartLoad: true,
        maxLiveSyncPlaybackRate: 1.5,
        frontBufferFlushThreshold: 1,
        maxMaxBufferLength: 5,
      });

      videoRef.value.controls = false;
      videoRef.value.disableRemotePlayback = true;

      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.value);

      errorHandler(videoRef, hls);
    } else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("Using native HLS support");
      videoRef.value.src = streamUrl;
    } else {
      console.error("HLS is not supported in this browser");
    }
  };

  const pauseStream = () => {
    if (!videoRef.value || !hls) return;
    console.log("asdsadsd");
    hls.stopLoad();
    hls.detachMedia();
    videoRef.value.src = "";
  };

  const destroyStream = () => {
    if (!videoRef.value) return;

    if (hls) {
      hls.destroy();
      hls = null;
    }
  };

  return {
    initStream,
    destroyStream,
    pauseStream,
  };
};

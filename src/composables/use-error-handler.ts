import Hls from "hls.js";
import { type TemplateRef, ref } from "vue";

type Video = TemplateRef<HTMLMediaElement | null>;

export const useErrorHandler = () => {
  const attemptedErrorRecovery = ref<number | null>(null);
  let videoErrorHandler: ((event: Event) => void) | null = null;
  let hlsErrorHandler: ((event: string, data: any) => void) | null = null;

  const attachErrorHandlers = (video: Video, hls: Hls, streamUrl: string) => {
    if (!video.value) return;

    detachErrorHandlers(video, hls);

    videoErrorHandler = (event: Event) => {
      const target = event.currentTarget as HTMLVideoElement;
      const mediaError = target.error;

      if (mediaError && mediaError.code === mediaError.MEDIA_ERR_DECODE) {
        const now = Date.now();
        if (
          !attemptedErrorRecovery.value ||
          now - attemptedErrorRecovery.value > 5000
        ) {
          console.log("Attempting to recover from media decode error");
          attemptedErrorRecovery.value = now;
          hls.recoverMediaError();
        }
      }
    };

    hlsErrorHandler = (event: string, data: any) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.MEDIA_ERROR: {
            const now = Date.now();
            if (
              !attemptedErrorRecovery.value ||
              now - attemptedErrorRecovery.value > 5000
            ) {
              console.log(
                "Fatal media error encountered, attempting to recover",
              );
              attemptedErrorRecovery.value = now;
              hls.recoverMediaError();
            } else {
              console.log(
                `Skipping media error recovery (only ${now - attemptedErrorRecovery.value} ms since last error)`,
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
    };

    video.value.addEventListener("error", videoErrorHandler);
    hls.on(Hls.Events.ERROR, hlsErrorHandler);
  };

  const detachErrorHandlers = (video: Video, hls: Hls) => {
    if (video.value && videoErrorHandler) {
      video.value.removeEventListener("error", videoErrorHandler);
    }

    if (hlsErrorHandler) {
      hls.off(Hls.Events.ERROR, hlsErrorHandler);
    }

    videoErrorHandler = null;
    hlsErrorHandler = null;
  };

  return {
    attachErrorHandlers,
    detachErrorHandlers,
  };
};

import Hls from "hls.js";
import { type TemplateRef } from "vue";
import { useErrorHandler } from "@/utils/use-error-handling";

export const useBroadcaster = (
  videoRef: TemplateRef<HTMLMediaElement | null>,
  streamUrl: string = import.meta.env.VITE_HLS_URL,
) => {
  let hls: Hls | null = null;
  const { attachErrorHandlers, detachErrorHandlers } = useErrorHandler();

  const pauseStream = () => {
    if (!videoRef.value || !hls) return;
    hls.stopLoad();
    hls.detachMedia();
    videoRef.value.pause();
    videoRef.value.src = "";
    detachErrorHandlers(videoRef, hls);
  };

  const resumeStream = () => {
    if (!videoRef.value || !hls) return;
    hls.loadSource(streamUrl);
    hls.attachMedia(videoRef.value);
    attachErrorHandlers(videoRef, hls, streamUrl);
  };

  const initStream = () => {
    if (!videoRef.value) return;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 10,
        maxBufferSize: 25 * 1000 * 1000,
        liveMaxLatencyDurationCount: 5,
        liveSyncDurationCount: 3,
        backBufferLength: 0,
        lowLatencyMode: false,
        maxLiveSyncPlaybackRate: 1.5,
        frontBufferFlushThreshold: 1,
        maxMaxBufferLength: 5,
      });

      videoRef.value.controls = false;
      videoRef.value.disableRemotePlayback = true;
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.value);

      attachErrorHandlers(videoRef, hls, streamUrl);
    } else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("Using native HLS support");
      videoRef.value.src = streamUrl;
    } else {
      console.error("HLS is not supported in this browser");
    }
  };

  const destroyStream = () => {
    if (!videoRef.value || !hls) return;
    detachErrorHandlers(videoRef, hls);
    videoRef.value.remove();
    hls.destroy();
    hls = null;
  };

  return {
    initStream,
    destroyStream,
    pauseStream,
    resumeStream,
  };
};

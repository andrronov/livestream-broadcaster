<script setup>
import { onMounted, ref } from "vue";
import Hls from "hls.js";

const video = ref(null);
const streamUrl = "http://localhost:8888/cam/index.m3u8";
const showStream = ref(false);

onMounted(() => {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(video.value);
  } else if (video.value.canPlayType("application/vnd.apple.mpegurl")) {
    video.value.src = streamUrl;
  }
});
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center">
    <video ref="video" controls muted class="w-full h-full z-100" />
  </div>
</template>

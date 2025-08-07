<script setup lang="ts">
import { useTemplateRef, onMounted } from "vue";
import { useBroadcaster } from "@/composables/use-broadcaster";

const video = useTemplateRef("video");

const { initStream } = useBroadcaster(video);

onMounted(() => {
  initStream();
});
</script>

<template>
  <video
    ref="video"
    :controls="false"
    autoplay
    muted
    class="w-full h-full z-100"
  />
</template>

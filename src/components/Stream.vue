<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, watch } from "vue";
import { useBroadcaster } from "@/composables/use-broadcaster";

const props = defineProps<{
  disabled: boolean;
}>();

const video = useTemplateRef("video");

const { initStream, destroyStream, pauseStream, resumeStream } =
  useBroadcaster(video);

onMounted(() => {
  initStream();
});
onUnmounted(() => {
  destroyStream();
});

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      pauseStream();
    } else {
      resumeStream();
    }
  },
);
</script>

<template>
  <video ref="video" :controls="false" autoplay muted />
</template>

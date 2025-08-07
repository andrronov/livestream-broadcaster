<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, watch } from "vue";
import { useBroadcaster } from "@/composables/use-broadcaster";

const props = defineProps<{
  active: boolean;
}>();

const video = useTemplateRef("video");

const { initStream, destroyStream, pauseStream } = useBroadcaster(video);

onMounted(() => {
  initStream();
});
onUnmounted(() => {
  destroyStream();
});
</script>

<template>
  <video
    ref="video"
    :controls="false"
    autoplay
    muted
    class="w-full h-full"
    :class="{ 'scale-200': props.active }"
  />
</template>

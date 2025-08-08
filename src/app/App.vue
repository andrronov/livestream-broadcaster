<script setup lang="ts">
import { ref } from "vue";
import Stream from "@/components/Stream.vue";

const activeStream = ref<number | null>(null);
const isActive = (streamIdx: number) => {
  return activeStream.value === streamIdx;
};

const setActiveStream = (streamIdx: number) => {
  if (!activeStream.value) {
    activeStream.value = streamIdx;
  } else {
    activeStream.value = null;
  }
};
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div class="w-full h-full grid grid-cols-3 gap-1">
      <template v-for="(stream, idx) in 9" :key="idx">
        <Stream
          @click="setActiveStream(idx)"
          :disabled="!isActive(idx) && activeStream !== null"
          :class="{
            'absolute top-0 left-0 w-full h-full z-100': isActive(idx),
          }"
        />
      </template>
    </div>
  </div>
</template>

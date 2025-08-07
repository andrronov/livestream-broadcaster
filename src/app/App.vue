<script setup lang="ts">
import { computed, ref } from "vue";
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
  <div
    class="w-full h-screen flex justify-center items-center"
    :class="{ 'bg-black-500/70': activeStream !== null }"
  >
    <div class="w-full h-full grid grid-cols-3 gap-1">
      <template v-for="(stream, idx) in 9" :key="idx">
        <Stream
          @click="setActiveStream(idx)"
          :active="isActive(idx) && activeStream !== null"
          :class="{
            'absolute top-0 left-0 w-full h-full z-1000 transition-all':
              isActive(idx),
            '-z-1000': activeStream !== null && !isActive(idx),
          }"
        />
      </template>
    </div>
  </div>
</template>

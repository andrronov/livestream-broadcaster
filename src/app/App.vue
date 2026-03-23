<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import Stream from "@/components/Stream.vue";
import { API_URL, HLS_URL } from "@/config";

type StreamData = {
  key: string;
  title: string;
  location: string;
};

const activeStream = ref<number | null>(null);
const streams = shallowRef<string[]>([]);

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

onMounted(async () => {
  try {
    const res: Response = await fetch(`${API_URL}/api/streams`);
    const { data } = await res.json();

    streams.value = data.map(
      (stream: StreamData) => `${HLS_URL}/${stream.key}/index.m3u8`,
    );
    console.log(streams.value);
  } catch (e) {
    console.error(e);
  }
});
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div class="w-full h-full grid grid-cols-3 gap-1">
      <template v-for="(stream, idx) in streams" :key="idx">
        <Stream
          @click="setActiveStream(idx)"
          :stream-url="stream"
          :disabled="!isActive(idx) && activeStream !== null"
          :class="{
            'absolute top-0 left-0 w-full h-full z-100': isActive(idx),
          }"
        />
      </template>
    </div>
  </div>
</template>

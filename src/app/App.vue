<script setup lang="ts">
import Stream from "../components/Stream.vue";
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div class="w-11/12 h-full grid grid-cols-3 gap-2">
      <template v-for="(stream, idx) in 9" :key="idx">
        <Stream />
      </template>
    </div>
  </div>
</template>

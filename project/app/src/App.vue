<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <main class="h-full w-full">
      <Component :is="Component" />
    </main>
  </RouterView>
</template>

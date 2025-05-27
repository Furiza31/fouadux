<script setup lang="ts">
import { RouterView } from "vue-router";
import { useUserStore } from "./stores/user.store";

useUserStore().init();
</script>

<template>
  <RouterView v-slot="{ Component }">
    <main class="h-full w-full">
      <Component :is="Component" />
    </main>
  </RouterView>
</template>

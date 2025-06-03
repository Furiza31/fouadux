<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import { RouterView } from "vue-router";
import "vue-sonner/style.css";
import { useUserStore } from "./stores/user.store";

useUserStore().init();
</script>

<template>
  <Toaster />
  <RouterView v-slot="{ Component }">
    <main class="h-full w-full">
      <Component :is="Component" />
    </main>
  </RouterView>
</template>

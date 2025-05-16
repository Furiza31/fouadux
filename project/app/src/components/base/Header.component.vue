<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <header
    class="w-full h-12 flex items-center justify-start flex-row flex-nowrap px-4 gap-2 py-2 border-b"
  >
    <SidebarTrigger class="size-9" />
    <Separator orientation="vertical" />
    <h1 class="text-xl font-bold">
      {{ route.name }}
    </h1>
  </header>
</template>

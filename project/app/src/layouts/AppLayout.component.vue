<script setup lang="ts">
import HeaderComponent from "@/components/base/Header.component.vue";
import SidebarComponent from "@/components/sidebar/Sidebar.component.vue";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RouterView } from "vue-router";
</script>

<template>
  <SidebarProvider class="h-full w-full">
    <SidebarComponent />
    <RouterView v-slot="{ Component }">
      <main class="h-full w-full">
        <HeaderComponent />
        <Component :is="Component" />
      </main>
    </RouterView>
  </SidebarProvider>
</template>

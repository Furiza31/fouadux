<script setup lang="ts">
import { links } from "@/components/sidebar/links";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/stores/user.store";
import { LoaderCircle, LogOut } from "lucide-vue-next";
import { RouterLink } from "vue-router";

const userStore = useUserStore();
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarHeader class="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <h1 class="w-full text-center">{{ userStore.user?.email }}</h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarGroup class="pt-0">
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="link in links" :key="link.title">
              <SidebarMenuButton asChild>
                <RouterLink :to="link.url">
                  <component :is="link.icon" />
                  <span>{{ link.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <Button
            variant="destructive"
            class="w-full justify-start"
            @click="userStore.logout"
            :disabled="userStore.loading"
          >
            <LoaderCircle
              class="size-6 bg-destructive-foreground animate-spin mr-2"
              v-if="userStore.loading"
            />
            <LogOut class="mr-2 bg-destructive-foreground" v-else />
            Logout
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

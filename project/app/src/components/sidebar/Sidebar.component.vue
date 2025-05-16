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
import { LogOut } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarHeader class="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <h1>👋 NOM</h1>
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
          <Button variant="destructive" class="w-full justify-start">
            <LogOut class="mr-2" />
            Logout
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

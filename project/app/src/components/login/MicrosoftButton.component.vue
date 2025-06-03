<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { login } from "@/lib/msalAuth";
import { useUserStore } from "@/stores/user.store";
import { LoaderCircle } from "lucide-vue-next";
import { toast } from "vue-sonner";

const userStore = useUserStore();

const wrapper = async () => {
  userStore.loading = true;
  try {
    const user = await login();
    userStore.microsoftLogin(user);
  } catch (error) {
    console.error("Error logging in with Microsoft:", error);
    toast.error("Failed to log in with Microsoft. Please try again.");
  } finally {
    userStore.loading = false;
  }
};
</script>

<template>
  <Button
    :disabled="userStore.loading"
    variant="outline"
    class="w-full"
    @click="wrapper"
  >
    <img
      src="@/assets/icons/microsoft.svg"
      alt="Microsoft"
      class="w-6 h-6"
      v-if="!userStore.loading"
    />
    <LoaderCircle class="size-6 animate-spin" v-else />
  </Button>
</template>

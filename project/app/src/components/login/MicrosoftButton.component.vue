<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { login } from "@/lib/msalAuth";
import { useUserStore } from "@/stores/user.store";
import { LoaderCircle } from "lucide-vue-next";

const userStore = useUserStore();

const wrapper = async () => {
  userStore.loading = true;
  const user = await login();
  userStore.microsoftLogin(user);
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

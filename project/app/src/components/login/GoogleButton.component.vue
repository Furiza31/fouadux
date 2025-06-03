<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { getUserInformations, googleRequestedScopes } from "@/lib/googleAuth";
import { useUserStore } from "@/stores/user.store";
import { LoaderCircle } from "lucide-vue-next";
import { toast } from "vue-sonner";
import {
  useTokenClient,
  type AuthCodeFlowErrorResponse,
  type AuthCodeFlowSuccessResponse,
} from "vue3-google-signin";

const handleOnSuccess = async (response: AuthCodeFlowSuccessResponse) => {
  userStore.loading = false;
  const userInfo = await getUserInformations({ token: response.access_token });
  userStore.googleLogin({
    email: userInfo.email,
    token: response.access_token,
    expireAt: new Date(
      new Date().getTime() + Number(response.expires_in) * 1000
    ),
    uuid: userInfo.sub,
    provider: "google",
  });
};

const handleOnError = (_: AuthCodeFlowErrorResponse) => {
  userStore.loading = false;
  toast.error("Failed to log in with Google. Please try again.");
};

const userStore = useUserStore();

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  scope: googleRequestedScopes.scope,
  prompt: "consent",
});

const wrapper = () => {
  userStore.loading = true;
  try {
    login();
  } catch (error) {
    console.error("Error logging in:", error);
    toast.error("Failed to log in with Google. Please try again.");
  } finally {
    userStore.loading = false;
  }
};
</script>

<template>
  <Button
    variant="outline"
    :disabled="userStore.loading || !isReady"
    class="w-full"
    @click="wrapper"
  >
    <img
      src="@/assets/icons/google.svg"
      alt="Google"
      class="w-6 h-6"
      v-if="!userStore.loading && isReady"
    />
    <LoaderCircle class="size-6 animate-spin" v-else />
  </Button>
</template>

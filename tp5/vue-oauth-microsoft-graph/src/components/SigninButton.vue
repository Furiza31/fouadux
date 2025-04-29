<template>
  <div>
    <BaseButton
      v-if="!isAuthenticated"
      @click="handleSignIn"
      :disabled="isLoading"
    >
      {{ isLoading ? "Connection..." : "Sign in" }}
    </BaseButton>
    <BaseButton v-else @click="handleSignOut">Se déconnecter</BaseButton>
  </div>
</template>

<script setup>
import BaseButton from "@/components/BaseButton.vue";
import { useUserStore } from "@/store/user";
import { computed } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const isAuthenticated = computed(() => userStore.isAuthenticated);
const isLoading = computed(() => userStore.isLoading);

const handleSignIn = async () => {
  try {
    await userStore.signIn();
  } catch (err) {
    console.error("Erreur durant la connexion :", err);
  }
};

const handleSignOut = () => {
  userStore.signOut();
  router.push("/");
};
</script>

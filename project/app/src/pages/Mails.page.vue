<script lang="ts" setup>
import MailsListComponent from "@/components/mails/MailsList.component.vue";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user.store";
import type { Mail } from "@/types/mail";
import { ChevronLeft, ChevronRight, LoaderCircle, Plus } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
const mails = ref<Mail[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();
const userStore = useUserStore();
const mailService = userStore.getMailService();
const page = ref(1);
const canGoNext = ref(true);

const loadMails = async (pageNumber: number) => {
  loading.value = true;
  error.value = null;
  try {
    const fetchedMails = await mailService.getMails(
      userStore.user!,
      pageNumber
    );
    mails.value = fetchedMails;
    canGoNext.value = fetchedMails.length > 0;
  } catch (err) {
    console.error("Error fetching emails:", err);
    error.value = "Failed to fetch emails";
  } finally {
    loading.value = false;
  }
};

const goToPreviousPage = async () => {
  if (page.value > 1) {
    page.value--;
    await loadMails(page.value);
  }
};

const goToNextPage = async () => {
  if (canGoNext.value) {
    page.value++;
    await loadMails(page.value);
  }
};

onMounted(async () => {
  await loadMails(page.value);
});

const onDelete = (id: string) => {
  console.log("Delete mail with id:", id);
};
</script>

<template>
  <section class="w-full p-4 h-full">
    <div v-if="loading" class="flex justify-center items-center h-full w-full">
      <LoaderCircle class="w-10 h-10 animate-spin text-primary" />
    </div>

    <div
      v-else-if="error"
      class="h-full w-full flex flex-col items-center justify-center"
    >
      <p class="text-destructive text-lg">{{ error }}</p>
      <Button class="mt-4" variant="outline" @click="router.back()">
        Go Back</Button
      >
    </div>
    <div v-else-if="mails" class="flex flex-col gap-2 w-full h-full">
      <div class="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          @click="goToPreviousPage"
          :disabled="page === 1"
          class="flex items-center gap-1"
        >
          <ChevronLeft class="h-4 w-4" />
          Précédent
        </Button>
        <span class="text-sm">Page {{ page }}</span>
        <Button
          variant="outline"
          size="sm"
          @click="goToNextPage"
          :disabled="!canGoNext"
          class="flex items-center gap-1"
        >
          Suivant
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
      <MailsListComponent :mails="mails" v-on:on-delete="onDelete" />
      <Button
        size="icon"
        class="rounded-md fixed bottom-4 right-4 size-11"
        asChild
      >
        <RouterLink to="/app/mails/new">
          <Plus class="size-6" />
        </RouterLink>
      </Button>
    </div>
  </section>
</template>

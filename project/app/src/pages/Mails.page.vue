<script lang="ts" setup>
import MailsListComponent from "@/components/mails/MailsList.component.vue";
import { Button } from "@/components/ui/button";
import { useMailsService } from "@/services/mails.service";
import type { Mail } from "@/types/mail";
import { LoaderCircle, Plus } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const mailsService = useMailsService();
const mails = ref<Mail[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();

onMounted(async () => {
  loading.value = true;
  try {
    const response = await mailsService.getMails();
    mails.value = response.data;
  } catch (err) {
    console.error("Error fetching emails:", err);
    error.value = "Failed to fetch emails";
  } finally {
    loading.value = false;
  }
});

const onDelete = (id: number) => {
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

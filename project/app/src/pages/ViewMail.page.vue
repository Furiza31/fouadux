<script setup lang="ts">
import MailComponent from "@/components/mails/Mail.component.vue";
import { Button } from "@/components/ui/button";
import { useApiService } from "@/services/api.service";
import type { Mail } from "@/types/mail";
import { LoaderCircle } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

const route = useRoute();
const router = useRouter();
const mail = ref<Mail | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const mailId = route.params.id as string;
  if (!mailId) {
    error.value = "Invalid mail ID";
    loading.value = false;
    return;
  }

  try {
    const response = await useApiService().get<Mail>(`/mails/${mailId}`);
    mail.value = response.data || null;
    if (!mail.value) {
      error.value = "Mail not found";
    }
  } catch (err) {
    error.value = "Failed to fetch mail";
    console.error("Failed to fetch mail:", err);
  } finally {
    loading.value = false;
  }
});

const onDelete = async (id: number) => {
  try {
    await useApiService().delete(`/mails/${id}`);
    toast.success("Mail deleted successfully");
    router.push({ path: "/app/mails" });
  } catch (error) {
    toast.error("Failed to delete mail");
  }
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
    <MailComponent :mail="mail" v-else-if="mail" @on-delete="onDelete" />
  </section>
</template>

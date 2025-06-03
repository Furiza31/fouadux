<script lang="ts" setup>
import MailsListComponent from "@/components/mails/MailsList.component.vue";
import { Button } from "@/components/ui/button";
import { useApiService } from "@/services/api.service";
import type { Mail } from "@/types/mail";
import { ChevronLeft, ChevronRight, LoaderCircle, Plus } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
const mails = ref<Mail[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();
const canGoNext = ref(true);
const route = useRoute();
const page = ref(route.query.page ? Number(route.query.page) : 1);

const loadMails = async (pageNumber: number) => {
  loading.value = true;
  error.value = null;
  try {
    const fetchedMails = await useApiService().get<Mail[]>(
      "/mails?page=" + pageNumber
    );
    mails.value = fetchedMails.data || [];
    canGoNext.value = fetchedMails.data.length > 0;
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
    router.push({ path: "/app/mails", query: { page: page.value } });
  }
};

const goToNextPage = async () => {
  if (canGoNext.value) {
    page.value++;
    router.push({ path: "/app/mails", query: { page: page.value } });
  }
};

onMounted(async () => {
  await loadMails(page.value);
});

watch(
  () => route.query.page,
  (newPage, oldPage) => {
    if (newPage !== oldPage) {
      page.value = Number(newPage);
      loadMails(page.value);
    }
  }
);

const onDelete = async (id: string) => {
  try {
    await useApiService().delete(`/mails/${id}`);
    toast.success(`Mail deleted successfully`);
    mails.value = mails.value.filter((mail) => mail.id !== id);
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
      <MailsListComponent
        :mails="mails"
        v-if="mails.length > 0"
        @on-delete="onDelete"
      />
      <div
        v-if="mails.length <= 0"
        class="flex justify-center items-center h-full w-full"
      >
        <p class="text-center text-muted-foreground">
          Empty inbox. Start by sending a new mail!
        </p>
      </div>
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

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApiService } from "@/services/api.service";
import { useUserStore } from "@/stores/user.store";
import type { Mail } from "@/types/mail";
import {
  Clock,
  Inbox,
  LoaderCircle,
  Mail as MailIcon,
  Plus,
  User,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const userStore = useUserStore();

const recentMails = ref<Mail[]>([]);
const stats = ref({
  totalMails: 0,
  contacts: 0,
});
const loading = ref(false);
const error = ref<string | null>(null);

const loadDashboardData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const responseMails = await useApiService().get<Mail[]>("/mails");
    recentMails.value = responseMails.data.slice(0, 5) || [];

    const responseStats = await useApiService().get<{
      totalMails: number;
      totalContacts: number;
    }>("/mails/dashboard");

    stats.value = {
      totalMails: responseStats.data?.totalMails || 0,
      contacts: responseStats.data?.totalContacts || 0,
    };
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    error.value = "Failed to load dashboard data";
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  await loadDashboardData();
});
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold">Tableau de bord</h1>
      <p class="text-muted-foreground">Bienvenue {{ userStore.user?.email }}</p>
    </div>

    <div v-if="loading" class="w-full flex justify-center py-12">
      <LoaderCircle class="animate-spin h-8 w-8" />
    </div>

    <div v-else class="grid gap-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium"
              >Mails Totaux récupérés</CardTitle
            >
          </CardHeader>
          <CardContent>
            <div class="flex items-center">
              <Inbox class="mr-2 h-4 w-4 text-muted-foreground" />
              <div class="text-2xl font-bold">{{ stats.totalMails }}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium"
              >Contacts récupérés</CardTitle
            >
          </CardHeader>
          <CardContent>
            <div class="flex items-center">
              <User class="mr-2 h-4 w-4 text-muted-foreground" />
              <div class="text-2xl font-bold">{{ stats.contacts }}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription
            >Accédez rapidement aux fonctionnalités principales</CardDescription
          >
        </CardHeader>
        <CardContent class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RouterLink to="/app/mails/new">
            <Button class="w-full" variant="outline">
              <Plus class="h-4 w-4 mr-2" />
              Nouveau mail
            </Button>
          </RouterLink>

          <RouterLink to="/app/mails">
            <Button class="w-full" variant="outline">
              <Inbox class="h-4 w-4 mr-2" />
              Voir mails
            </Button>
          </RouterLink>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mails récents</CardTitle>
          <CardDescription>Vos emails les plus récents</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-if="recentMails.length === 0"
              class="text-center py-6 text-muted-foreground"
            >
              Aucun email récent à afficher
            </div>

            <div
              v-for="mail in recentMails"
              :key="mail.id"
              class="flex items-center space-x-4 rounded-md border p-4"
            >
              <RouterLink
                :to="`/app/mails/${mail.id}`"
                class="flex items-center space-x-4 w-full"
              >
                <div>
                  <MailIcon class="h-6 w-6" />
                </div>
                <div class="flex-1 space-y-1">
                  <p class="font-medium leading-none">{{ mail.subject }}</p>
                  <p class="text-sm text-muted-foreground">
                    De: {{ mail.sender }}
                  </p>
                </div>
                <div class="flex flex-col items-end">
                  <div class="text-sm text-muted-foreground flex items-center">
                    <Clock class="mr-1 h-3 w-3" />
                    {{ formatDate(mail.date) }}
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <RouterLink to="/app/mails">
            <Button variant="ghost">Voir tous les mails</Button>
          </RouterLink>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

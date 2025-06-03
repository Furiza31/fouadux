<script setup lang="ts">
import NewMailComponent from "@/components/mails/NewMail.component.vue";
import { useApiService } from "@/services/api.service";
import { useUserStore } from "@/stores/user.store";
import { type Mail, type MailForm } from "@/types/mail";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

const loading = ref(false);
const router = useRouter();
const userStore = useUserStore();

const handleSubmit = async (values: MailForm) => {
  console.log(values);
  try {
    const response = await useApiService().post<Mail>("/mails", {
      ...values,
      sender: userStore.user?.email,
    });
    toast.success("Mail sent successfully!");
    router.push({ name: "Mail", params: { id: response.data.id } });
  } catch (error) {
    toast.error("Failed to send mail. Please try again.");
  }
};
</script>

<template>
  <section class="w-full p-4 h-full">
    <NewMailComponent @submit="handleSubmit" :loading="loading" />
  </section>
</template>

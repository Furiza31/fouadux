<script lang="ts" setup>
import MailActionComponent from "@/components/mails/MailAction.component.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import type { Mail } from "@/types/mail";
import { Search } from "lucide-vue-next";
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps<{
  mails: Mail[];
}>();

const sender = (email: Mail) => {
  return (
    email.sender.split("@")[0].charAt(0).toUpperCase() +
    email.sender.split("@")[0].slice(1)
  );
};

const search = ref("");

const sortedMails = computed<Mail[]>(() =>
  props.mails
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
);

const mailsToDisplay = computed<Mail[]>(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) {
    return sortedMails.value;
  }

  return sortedMails.value.filter((mail) => {
    const { subject, body, sender, date } = mail;
    const subjectL = subject.toLowerCase();
    const bodyL = body.toLowerCase();
    const senderL = sender.toLowerCase();
    const dateStr = formatDate(date);

    return (
      subjectL.includes(term) ||
      bodyL.includes(term) ||
      senderL.includes(term) ||
      dateStr.includes(term)
    );
  });
});

const emits = defineEmits(["on-delete"]);

const onDelete = (id: string) => {
  emits("on-delete", id);
};
</script>

<template>
  <section class="w-full h-fit">
    <div class="sticky top-0 mb-4 bg-background w-full items-center z-10">
      <Input
        type="text"
        placeholder="Search..."
        class="pl-10 w-full"
        v-model="search"
      />
      <span
        class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
      >
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>
    <Button
      variant="outline"
      asChild
      v-for="mail in mailsToDisplay"
      :key="mail.id"
      class="w-full flex flex-row flex-nowrap justify-start items-center rounded-none"
    >
      <RouterLink
        :to="{ name: 'Mail', params: { id: mail.id } }"
        class="p-4 w-full"
      >
        <div
          class="grid grid-cols-[200px_1fr_100px_25px] gap-4 items-center w-full"
        >
          <h1 class="font-bold truncate">
            {{ sender(mail) }}
          </h1>
          <div class="overflow-hidden">
            <p
              class="text-sm text-muted-foreground flex flex-row flex-nowrap gap-2 items-center justify-start"
            >
              <span class="font-bold truncate">
                {{ mail.subject }}
              </span>
              -
              <span class="truncate">
                {{ mail.body }}
              </span>
            </p>
          </div>
          <p class="text-sm text-muted-foreground text-end whitespace-nowrap">
            {{
              new Date(mail.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            }}
          </p>
          <MailActionComponent
            :mail="mail"
            v-on:on-delete="onDelete(mail.id)"
          />
        </div>
      </RouterLink>
    </Button>
  </section>
</template>

<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Mail } from "@/types/mail";
import { ArrowLeft } from "lucide-vue-next";
import { useRouter } from "vue-router";

const props = defineProps<{
  mail: Mail;
}>();

const router = useRouter();

const emits = defineEmits(["on-delete"]);

const onDelete = (id: string) => {
  emits("on-delete", id);
};
</script>

<template>
  <section class="w-full h-full">
    <Card class="w-full h-fit">
      <CardHeader>
        <div class="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            @click="router.back()"
            class="rounded-full"
          >
            <ArrowLeft class="side-4" />
          </Button>
          <h1 class="text-xl font-semibold">{{ props.mail.subject }}</h1>
        </div>
      </CardHeader>

      <Accordion
        type="single"
        collapsible
        class="w-full"
        default-value="mail-details"
      >
        <AccordionItem value="mail-details">
          <AccordionTrigger
            class="px-4 py-2 hover:no-underline hover:bg-muted/50 cursor-pointer"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-3">
                <div
                  class="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <span class="text-primary font-medium">{{
                    props.mail.sender.charAt(0).toUpperCase()
                  }}</span>
                </div>
                <div class="text-left">
                  <p class="font-medium">{{ props.mail.sender }}</p>
                  <p class="text-sm text-muted-foreground">to me</p>
                </div>
              </div>
              <div class="text-sm text-muted-foreground">
                {{ formatDate(props.mail.date) }}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent class="px-4 py-6 border-t">
            <div class="mail-body prose max-w-none">
              <div class="flex flex-row justify-center items-center">
                <iframe
                  class="w-full h-[500px] border-0"
                  sandbox="allow-same-origin"
                  :srcdoc="props.mail.body"
                  frameborder="0"
                ></iframe>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <CardFooter class="flex justify-end">
        <Button variant="destructive" @click="onDelete(props.mail.id)">
          Delete
        </Button>
      </CardFooter>
    </Card>
  </section>
</template>

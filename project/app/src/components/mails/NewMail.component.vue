<script setup lang="ts">
import { mailFormSchema } from "@/components/mails/schemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type MailForm } from "@/types/mail";
import { ArrowLeft } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  loading?: boolean;
}>();

const emits = defineEmits(["submit"]);

const form = useForm({
  validationSchema: mailFormSchema,
});

const onSubmit = form.handleSubmit((values: MailForm) => {
  emits("submit", values);
});
</script>

<template>
  <section class="w-full">
    <Card>
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
          <h2 class="text-lg font-semibold">New Mail</h2>
        </div>
      </CardHeader>
      <form @submit="onSubmit" class="w-full">
        <CardContent
          class="flex flex-col items-start justify-center gap-4 w-full"
        >
          <FormField v-slot="{ componentField }" name="to">
            <FormItem class="w-full">
              <FormLabel>To</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter recipient's email"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="subject">
            <FormItem class="w-full">
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter subject"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="body">
            <FormItem class="w-full">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  rows="10"
                  placeholder="Enter your message"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
        <CardFooter>
          <div class="flex justify-end mt-4 w-full">
            <Button type="submit">
              <span v-if="!props.loading">Send Mail</span>
              <span v-else>Sending...</span>
            </Button>
            <Button variant="destructive" class="ml-2" @click="router.back()">
              Cancel
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  </section>
</template>

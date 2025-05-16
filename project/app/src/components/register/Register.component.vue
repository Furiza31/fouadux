<script setup lang="ts">
import { registerFormSchema } from "@/components/register/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UserRegisterForm } from "@/types/user";
import { useForm } from "vee-validate";

const form = useForm({
  validationSchema: registerFormSchema,
});

const emits = defineEmits(["submit"]);

const onSubmit = form.handleSubmit((values: UserRegisterForm) => {
  emits("submit", values);
});
</script>

<template>
  <section class="w-full max-w-sm">
    <Card class="w-full">
      <CardContent>
        <div class="flex flex-col items-center justify-center mb-8 gap-1">
          <h1 class="text-xl font-bold">New here?</h1>
          <p class="text-balance text-muted-foreground">
            Create an account to get started.
          </p>
        </div>
        <form
          @submit="onSubmit"
          class="flex flex-col items-start justify-center gap-4"
        >
          <FormField v-slot="{ componentField }" name="email">
            <FormItem class="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="your@email.exemple"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem class="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem class="w-full">
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="w-full"> Submit </Button>
        </form>
        <div class="text-center text-sm mt-4">
          Already have an account?
          <Button variant="link" class="w-fit p-0 text-blue-500">
            <RouterLink to="/login"> Sign in </RouterLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { loginFormSchema } from "@/components/login/schemas";
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
import { type UserLoginForm } from "@/types/user";
import { useForm } from "vee-validate";

const form = useForm({
  validationSchema: loginFormSchema,
});

const onSubmit = form.handleSubmit((values: UserLoginForm) => {
  console.log(values);
});
</script>

<template>
  <section class="w-full max-w-sm">
    <Card class="w-full">
      <CardContent>
        <div class="flex flex-col items-center justify-center mb-8 gap-1">
          <h1 class="text-xl font-bold">Welcome back!</h1>
          <p class="text-balance text-muted-foreground">
            Please enter your credentials to continue.
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
          <Button type="submit" class="w-full"> Submit </Button>
        </form>
        <div
          class="my-5 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
        >
          <span class="relative z-10 bg-background px-2 text-muted-foreground">
            OR
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <Button variant="outline" class="w-full">
            <img src="@/assets/icons/google.svg" alt="Google" class="w-6 h-6" />
          </Button>
          <Button variant="outline" class="w-full">
            <img
              src="@/assets/icons/microsoft.svg"
              alt="Microsoft"
              class="w-6 h-6"
            />
          </Button>
        </div>
        <div class="text-center text-sm mt-4">
          Don't have an account?
          <Button variant="link" class="w-fit p-0 text-blue-500">
            <RouterLink to="/register"> Sign up </RouterLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  </section>
</template>

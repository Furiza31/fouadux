<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GoogleButtonComponent from "./GoogleButton.component.vue";
import MicrosoftButtonComponent from "./MicrosoftButton.component.vue";
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
        <div class="grid grid-cols-2 gap-2">
          <GoogleButtonComponent />
          <MicrosoftButtonComponent />
        </div>
        <div class="text-center text-sm mt-4">
          Don't have an account?
          <Button variant="link" class="w-fit h-fit p-0 text-blue-500">
            <RouterLink to="/register"> Sign up </RouterLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  </section>
</template>

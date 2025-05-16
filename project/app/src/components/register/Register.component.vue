<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <div class="grid grid-cols-2 gap-2">
          <Button variant="outline" class="w-full" asChild>
            <a href="https://accounts.google.com/signup" target="_blank">
              <img
                src="@/assets/icons/google.svg"
                alt="Google"
                class="w-6 h-6"
              />
            </a>
          </Button>
          <Button variant="outline" class="w-full" asChild>
            <a href="https://signup.live.com/signup" target="_blank">
              <img
                src="@/assets/icons/microsoft.svg"
                alt="Microsoft"
                class="w-6 h-6"
              />
            </a>
          </Button>
        </div>
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

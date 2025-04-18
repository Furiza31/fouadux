<script setup>
import BaseFooter from "@/components/BaseFooter.vue";
import BaseHeader from "@/components/BaseHeader.vue";
</script>

<template>
  <section>
    <BaseHeader />
    <slot />
    <BaseFooter />
  </section>
</template>

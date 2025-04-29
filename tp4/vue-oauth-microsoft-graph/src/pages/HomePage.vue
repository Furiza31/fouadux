<script setup>
import AsyncButton from "@/components/AsyncButton.vue";
import BaseButton from "@/components/BaseButton.vue";

const asyncButtonClick = async () => {
  console.log("Async button clicked");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Async button finished");
};

let clicked = 0;

const asyncButtonIncreaseClick = async () => {
  clicked++;
  console.log("Async button clicked", clicked);
  await new Promise((resolve) => setTimeout(resolve, 1000 * clicked));
  console.log("Async button finished");
};
</script>

<template>
  <section>
    <h1>Home page</h1>
    <BaseButton>
      <span>Click me</span>
    </BaseButton>
    <BaseButton color="warn">
      <span>Click me</span>
    </BaseButton>
    <BaseButton color="danger">
      <span>Click me</span>
    </BaseButton>
    <BaseButton disabled>
      <span>Click me</span>
    </BaseButton>
    <AsyncButton @click.stop.prevent="asyncButtonClick">
      <span>Async Button</span>
    </AsyncButton>
    <AsyncButton @click.stop.prevent="asyncButtonIncreaseClick" color="warn">
      <span>Async Button increase time by 1s</span>
    </AsyncButton>
  </section>
</template>

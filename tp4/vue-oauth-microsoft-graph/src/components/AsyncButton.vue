<script setup>
import { defineProps, ref } from "vue";
import BaseButton from "./BaseButton.vue";

const loading = ref(false);

const props = defineProps({
  onClick: {
    type: Function,
    required: true,
  },
});

const handleClick = async (event) => {
  loading.value = true;
  try {
    await props.onClick(event);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <BaseButton :disabled="loading" @click="handleClick">
    <span v-if="loading" style="margin-right: 5px">
      <div class="loader"></div>
    </span>
    <slot />
  </BaseButton>
</template>

<style scoped>
.loader {
  width: 10px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid;
  border-color: white transparent;
  animation: l1 1s infinite;
}
@keyframes l1 {
  to {
    transform: rotate(0.5turn);
  }
}
</style>

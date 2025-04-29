<script setup>
import { computed, defineEmits, defineProps } from "vue";

const emit = defineEmits(["click"]);

const props = defineProps({
  color: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "warn", "danger"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const buttonClass = computed(() => {
  return {
    btn: true,
    "btn-primary": props.color === "primary",
    "btn-warn": props.color === "warn",
    "btn-danger": props.color === "danger",
  };
});
</script>

<template>
  <button
    :class="buttonClass"
    v-bind="$attrs"
    @click="($event) => emit('click', $event)"
    :disabled="props.disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  appearance: none;
  font: inherit;
  padding: 0.6em 1.3em;
  border-radius: 0.375rem;
  cursor: pointer;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  border: 2px solid black;

  transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.18s ease;
}

.btn-primary {
  background-color: #2563eb;
  color: #fff;
}

.btn-warn {
  background-color: #f59e0b;
  color: #fff;
}

.btn-danger {
  background-color: #dc2626;
  color: #fff;
}

.btn:hover {
  transform: translateY(-2px) scale(1.025);
  box-shadow: 0 6px 14px -4px rgba(0, 0, 0, 0.25);
}

.btn:focus-visible {
  outline: none;
  animation: focusRing 0.4s ease-out forwards;
}

@keyframes focusRing {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  100% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.35);
  }
}

.btn:active {
  transform: translateY(0) scale(1);
  box-shadow: 0 3px 8px -2px rgba(0, 0, 0, 0.2);
}

/* État désactivé */
.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

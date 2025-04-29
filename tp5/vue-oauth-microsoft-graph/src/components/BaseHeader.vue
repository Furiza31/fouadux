<script setup>
import { useUserStore } from "@/store/user";
import BaseButton from "./BaseButton.vue";
import SigninButton from "./SigninButton.vue";

const userStore = useUserStore();
</script>

<template>
  <header class="base-header">
    <div class="container">
      <div class="header-content">
        <h1 class="app-title">OAuth app</h1>
        <nav class="nav-links">
          <BaseButton>
            <router-link to="/">Home</router-link>
          </BaseButton>
          <BaseButton>
            <span>About</span>
          </BaseButton>
          <BaseButton>
            <span>Services</span>
          </BaseButton>
          <BaseButton>
            <span>Contact</span>
          </BaseButton>
          <SigninButton />
          <BaseButton v-if="userStore.isAuthenticated">
            <router-link to="/conversations">Conversations</router-link>
          </BaseButton>
          <BaseButton v-if="userStore.user">
            <a href="#contact">{{
              userStore.user.name || userStore.user.username
            }}</a>
          </BaseButton>
        </nav>
        <div class="right-section">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.base-header {
  background-color: #0078d4;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.right-section {
  display: flex;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}
.nav-links a:hover {
  color: #e0e0e0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .nav-links {
    margin-top: 0.5rem;
    justify-content: center;
  }
}
</style>

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { initializeMsal } from './lib/microsoftGraph'
import { routes } from "./router/routes"
import { useUserStore } from './store/user'

const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(pinia)
app.use(router)

initializeMsal().then(() => {
  app.mount('#app')

  const userStore = useUserStore();
  userStore.checkAuthState();

  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.auth)) {
      if (!userStore.isAuthenticated) {
        next({ path: '/' });
      } else {
        next();
      }
    } else {
      next();
    }
  });
}).catch(err => {
  console.error('Failed to initialize MSAL:', err);
  app.mount('#app');
});


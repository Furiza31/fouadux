import App from "@/App.vue";
import { pinia } from "@/plugins/pinia";
import { router } from "@/plugins/router";
import "@/style.css";
import { createApp } from "vue";
import GoogleSignInPlugin from "vue3-google-signin";

createApp(App)
  .use(pinia)
  .use(router)
  .use(GoogleSignInPlugin, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  })
  .mount("#app");

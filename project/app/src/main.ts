import App from "@/App.vue";
import { pinia } from "@/plugins/pinia";
import { router } from "@/plugins/router";
import "@/style.css";
import { createApp } from "vue";

createApp(App).use(pinia).use(router).mount("#app");

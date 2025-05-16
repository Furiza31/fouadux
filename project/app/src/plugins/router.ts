import { titleMiddleware } from "@/router/middleware/title.middleware";
import { routes } from "@/router/routes";
import { createRouter, createWebHistory, type Router } from "vue-router";

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach(titleMiddleware);

export { router };

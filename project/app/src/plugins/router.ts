import { authMiddleware } from "@/router/middleware/auth.middleware";
import { titleMiddleware } from "@/router/middleware/title.middleware";
import { routes } from "@/router/routes";
import { createRouter, createWebHistory, type Router } from "vue-router";

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authMiddleware);

router.afterEach(titleMiddleware);

export { router };

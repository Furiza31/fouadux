import { useUserStore } from "@/stores/user.store";
import {
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from "vue-router";

export const authMiddleware = async (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUserStore();

  if (!to.meta.auth) {
    next();
    return;
  }

  if (userStore.user) {
    next();
    return;
  }

  next({
    name: "Login",
  });
};

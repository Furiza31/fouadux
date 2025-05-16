import { nextTick } from "vue";
import { type RouteLocationNormalized } from "vue-router";

export const titleMiddleware = async (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized
) => {
  nextTick(() => {
    document.title = (import.meta.env.VITE_APP_TITLE +
      " - " +
      to.name?.toString()) as string;
  });
};

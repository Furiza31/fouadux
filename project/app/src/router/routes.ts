import { type RouteRecordRaw } from "vue-router";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    redirect: "/login",
    meta: {
      auth: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login.page.vue"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/Register.page.vue"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/app",
    component: () => import("@/layouts/AppLayout.component.vue"),
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/pages/Dashboard.page.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "mails",
        name: "Mails",
        component: () => import("@/pages/Mails.page.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "mails/new",
        name: "New mail",
        component: () => import("@/pages/NewMail.page.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "mails/:id",
        name: "Mail",
        component: () => import("@/pages/ViewMail.page.vue"),
        meta: {
          auth: true,
        },
      },
      {
        path: "carbon-emissions",
        name: "Carbon emissions",
        component: () => import("@/pages/CarbonEmissions.page.vue"),
        meta: {
          auth: true,
        },
      },
    ],
  },
];

import Home from "@/pages/Home.vue";
import HomeView from "../views/HomeView.vue";

export default [
  {
    path: "/home",
    name: "home",
    meta: {
      auth: true,
    },
    component: Home,
  },
  {
    path: "/",
    name: "dashboard",
    meta: {
      auth: true,
    },
    component: () => import("../pages/Dashboard.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: {
      forwordauth: true,
      guest: true,
    },
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/me",
    name: "profile",
    meta: {
      auth: true,
    },
    component: () => import("../pages/Profile.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("../pages/Logout.vue"),
  },
  {
    path: "/daily/import",
    name: "dailyImport",
    meta: {
      auth: true,
    },
    component: () => import("../pages/import/daily_import.vue"),
  },
  {
    path: "/shop/import",
    name: "shopImport",
    meta: {
      auth: true,
    },
    component: () => import("../pages/import/shop_import.vue"),
  },

  {
    path: "/book/list",
    name: "bookList",
    meta: {
      auth: true,
    },
    component: () => import("../pages/book/book_list.vue"),
  },
  {
    path: "/book/create",
    name: "bookCreate",
    meta: {
      auth: true,
    },
    component: () => import("../pages/book/book_create.vue"),
  },
  {
    path: "/book/edit/:id",
    name: "bookEdit",
    meta: {
      auth: true,
    },
    component: () => import("../pages/book/book_edit.vue"),
  },
  {
    path: "/group/list",
    name: "groupList",
    meta: {
      auth: true,
    },
    component: () => import("../pages/group/group_list.vue"),
  },
  {
    path: "/group/create",
    name: "groupCreate",
    meta: {
      auth: true,
    },
    component: () => import("../pages/group/group_create.vue"),
  },
  {
    path: "/group/edit/:id",
    name: "groupEdit",
    meta: {
      auth: true,
    },
    component: () => import("../pages/group/group_edit.vue"),
  },
  {
    path: "/manual/import_chart",
    name: "manual_importchart",
    meta: {
      auth: true,
    },
    component: () => import("../pages/manual/import_chart.vue"),
  },
  {
    path: "/manual/photoanddoc",
    name: "photoanddoc",
    meta: {
      auth: true,
    },
    component: () => import("../pages/manual/photoanddoc.vue"),
  },
  {
    path: "/manual/import_daily",
    name: "manual_importdaily",
    meta: {
      auth: true,
    },
    component: () => import("../pages/manual/import_daily.vue"),
  },
  {
    path: "/health-check",
    name: "health-check",
    component: () => import("../pages/HealthCheck.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("../pages/NotFound.vue"),
  },
  {
    path: "/user/list",
    name: "user_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/user/user_list.vue"),
  },

  {
    path: "/shop/shoplist",
    name: "shoplist",
    meta: {
      auth: true,
    },
    component: () => import("../pages/shop/shoplist.vue"),
  },
  {
    path: "/user/create",
    name: "user_create",
    meta: {
      auth: true,
    },
    component: () => import("../pages/user/user_create.vue"),
  },
  {
    path: "/user/edit/:id",
    name: "user_edit",
    meta: {
      auth: true,
    },
    component: () => import("../pages/user/user_edit.vue"),
  },
  {
    path: "/account_period/list",
    name: "account_period",
    meta: {
      auth: true,
    },
    component: () => import("../pages/period/account_period_list.vue"),
  },
  {
    path: "/shop_all/list",
    name: "shop_all_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/shop_all/list.vue"),
  },
  {
    path: "/user_all/list",
    name: "user_all_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/user_all/list.vue"),
  },
];

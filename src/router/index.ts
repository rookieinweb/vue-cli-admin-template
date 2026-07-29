import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { pinia } from "@/stores";
import { useUserStore } from "@/stores/user";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/admin/dashboard",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { public: true, title: "登录" },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/RegisterView.vue"),
    meta: { public: true, title: "注册" },
  },
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true, title: "系统管理" },
    redirect: "/admin/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard/DashboardView.vue"),
        meta: { title: "控制台", icon: "HomeFilled" },
      },
      {
        path: "permission",
        name: "permission",
        component: () => import("@/views/system/PermissionView.vue"),
        meta: { title: "权限管理", icon: "Lock" },
      },
    ],
  },
  {
    path: "/customer",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true, title: "客户管理" },
    redirect: "/customer/index",
    children: [
      {
        path: "index",
        name: "index",
        component: () => import("@/views/customer/index.vue"),
        meta: { title: "用户管理", icon: "HomeFilled" },
      },
      {
        path: "list",
        name: "list",
        component: () => import("@/views/customer/list.vue"),
        meta: { title: "用户列表", icon: "Lock" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const userStore = useUserStore(pinia);
  const hasToken = Boolean(userStore.token);

  if (to.meta.requiresAuth && !hasToken) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.public && hasToken) {
    return "/admin/dashboard";
  }

  return true;
});

export default router;

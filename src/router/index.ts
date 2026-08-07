import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from "vue-router";
import { pinia } from "@/stores";
import { usePermissionStore } from "@/stores/permission";
import { useUserStore } from "@/stores/user";
import type { PermissionMenuNode } from "@/types/permission";

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
  // {
  //   path: "/admin",
  //   component: () => import("@/layouts/AdminLayout.vue"),
  //   meta: { requiresAuth: true, title: "系统管理" },
  //   redirect: "/admin/dashboard",
  //   children: [
  //     {
  //       path: "dashboard",
  //       name: "dashboard",
  //       component: () => import("@/views/dashboard/DashboardView.vue"),
  //       meta: { title: "控制台", icon: "HomeFilled" },
  //     },
  //     {
  //       path: "permission",
  //       name: "permission",
  //       component: () => import("@/views/system/PermissionView.vue"),
  //       meta: { title: "权限管理", icon: "Lock" },
  //     },
  //     {
  //       path: "menu-permission",
  //       name: "menu-permission",
  //       component: () => import("@/views/system/MenuPermissionView.vue"),
  //       meta: { title: "菜单权限管理", icon: "Menu" },
  //     },
  //   ],
  // },
  // {
  //   path: "/customer",
  //   component: () => import("@/layouts/AdminLayout.vue"),
  //   meta: { requiresAuth: true, title: "客户管理" },
  //   redirect: "/customer/index",
  //   children: [
  //     {
  //       path: "index",
  //       name: "index",
  //       component: () => import("@/views/customer/index.vue"),
  //       meta: { title: "用户管理", icon: "HomeFilled" },
  //     },
  //     {
  //       path: "list",
  //       name: "list",
  //       component: () => import("@/views/customer/list.vue"),
  //       meta: { title: "用户列表", icon: "Lock" },
  //     },
  //     {
  //       path: "detail/:id",
  //       name: "customer-detail",
  //       component: () => import("@/views/customer/detail.vue"),
  //       meta: { title: "客户详情", icon: "Document", hide: true },
  //     },
  //   ],
  // },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

function normalizeRoutePath(path: string) {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function flattenRouteRecords(list: RouteRecordRaw[]): RouteRecordRaw[] {
  return list.flatMap((item) => {
    const result = [item];

    if (item.children?.length) {
      result.push(...flattenRouteRecords(item.children));
    }

    return result;
  });
}

const staticRoutePathMap = new Map(
  flattenRouteRecords(routes).map((record) => [
    normalizeRoutePath(record.path),
    record,
  ]),
);

function resolveDynamicRouteComponent(component: string) {
  const normalizedComponent = component.replace(/\.vue$/i, "");
  return () => import(`@/${normalizedComponent}.vue`);
}

function buildRouteName(item: any, routePath: string) {
  return (
    item.code ||
    item.title ||
    routePath.split("/").filter(Boolean).join("-") ||
    "dynamic-menu"
  );
}

function resolveMenuComponent(item: PermissionMenuNode) {
  if (item.component) {
    return resolveDynamicRouteComponent(item.component);
  }

  if (item.children?.length) {
    return () => import("@/layouts/AdminLayout.vue");
  }

  return undefined;
}

function createRouteRecordFromMenuNode(item: PermissionMenuNode): any | null {
  const routePath = normalizeRoutePath(
    item.path || item.name || item.title || "/",
  );

  if (routePath === "/") {
    return null;
  }

  const routeName = buildRouteName(item, routePath);
  const component: any = resolveMenuComponent(item);

  if (!component) {
    return null;
  }

  return {
    path: routePath,
    name: routeName,
    component,
    ...(item.children?.length
      ? { children: buildChildRouteRecords(item.children) }
      : {}),
    meta: {
      requiresAuth: true,
      title: item.title || item.name || routeName,
      icon: item.icon,
    },
  };
}

function buildChildRouteRecords(
  children: PermissionMenuNode[],
): RouteRecordRaw[] {
  return children
    .map((child) => createRouteRecordFromMenuNode(child))
    .filter((record): record is RouteRecordRaw => record !== null);
}

function buildDynamicRouteRecords(
  menuList: PermissionMenuNode[],
): RouteRecordRaw[] {
  const records: RouteRecordRaw[] = [];

  const walk = (list: PermissionMenuNode[]) => {
    list.forEach((item) => {
      const routePath = normalizeRoutePath(
        item.path || item.name || item.title || "/",
      );

      if (routePath === "/") {
        return;
      }

      if (staticRoutePathMap.has(routePath)) {
        if (item.children?.length) {
          walk(item.children);
        }
        return;
      }

      const record = createRouteRecordFromMenuNode(item);
      if (record) {
        records.push(record);
      }

      if (item.children?.length) {
        walk(item.children);
      }
    });
  };

  walk(menuList);

  return records;
}

function ensureDynamicRoutes(menuList: PermissionMenuNode[]) {
  const routeRecords = buildDynamicRouteRecords(menuList);

  routeRecords.forEach((record) => {
    const routeName = String(record.name);

    if (!router.hasRoute(routeName)) {
      router.addRoute(record);
    }
  });
}

function isCatchAllRoute(route: {
  matched: RouteLocationNormalized["matched"];
}) {
  return route.matched.some((record) => record.path.includes("pathMatch"));
}

function getFirstMenuPath(menuList: PermissionMenuNode[]): string | null {
  for (const item of menuList) {
    const routePath = normalizeRoutePath(
      item.path || item.name || item.title || "/",
    );

    if (routePath !== "/" && item.component) {
      return routePath;
    }

    if (item.children?.length) {
      const childPath = getFirstMenuPath(item.children);
      if (childPath) {
        return childPath;
      }
    }
  }

  return null;
}

async function setupDynamicRoutes(
  permissionStore: ReturnType<typeof usePermissionStore>,
) {
  if (!permissionStore.permissionMenuLoaded && !permissionStore.menuLoading) {
    await permissionStore.loadUserMenu();
  }

  if (permissionStore.permissionMenu.length > 0) {
    ensureDynamicRoutes(permissionStore.permissionMenu);
  }
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _from, next: NavigationGuardNext) => {
  const userStore = useUserStore(pinia);
  const permissionStore = usePermissionStore(pinia);
  const hasToken = Boolean(userStore.token);

  if (to.meta.requiresAuth && !hasToken) {
    next({ path: "/login", query: { redirect: to.fullPath } });
    return;
  }

  if (!hasToken) {
    next();
    return;
  }

  await setupDynamicRoutes(permissionStore);

  const defaultPath =
    getFirstMenuPath(permissionStore.permissionMenu) || "/admin/dashboard";

  if (to.meta.public) {
    next({ path: defaultPath, replace: true });
    return;
  }

  if (isCatchAllRoute(to)) {
    const resolved = router.resolve(to.fullPath);

    if (!isCatchAllRoute(resolved)) {
      next({ ...to, replace: true });
      return;
    }

    next({ path: defaultPath, replace: true });
    return;
  }

  next();
});

export default router;

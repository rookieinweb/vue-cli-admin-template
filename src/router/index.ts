import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from "vue-router";
import { pinia } from "@/stores";
import { usePermissionStore } from "@/stores/permission";
import { useUserStore } from "@/stores/user";
import type { PermissionMenuNode } from "@/types/permission";

const LOGIN_PATH = "/login";
const REGISTER_PATH = "/register";
const DEFAULT_HOME_PATH = "/admin/dashboard";
const whiteList = new Set([LOGIN_PATH, REGISTER_PATH]);

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: DEFAULT_HOME_PATH,
  },
  {
    path: LOGIN_PATH,
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { public: true, title: "登录" },
  },
  {
    path: REGISTER_PATH,
    name: "register",
    component: () => import("@/views/auth/RegisterView.vue"),
    meta: { public: true, title: "注册" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/auth/LoginView.vue"),
  },
];

type MenuPage = {
  item: PermissionMenuNode;
  fullPath: string;
  component: string;
  groupPath: string;
  groupTitle: string;
  groupIcon?: string;
};

let dynamicRoutesReady = false;
let dynamicRoutesPromise: Promise<void> | null = null;
const removeDynamicRouteCallbacks: Array<() => void> = [];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

function normalizeRoutePath(path?: string) {
  if (!path) {
    return "/";
  }

  const normalized = path.trim().replace(/\/{2,}/g, "/");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function getRouteSegments(path: string) {
  return normalizeRoutePath(path).split("/").filter(Boolean);
}

function toChildRoutePath(groupPath: string, fullPath: string) {
  const groupSegments = getRouteSegments(groupPath);
  const pageSegments = getRouteSegments(fullPath);
  return pageSegments.slice(groupSegments.length).join("/");
}

function normalizeComponentPath(component: string) {
  return component
    .trim()
    .replace(/^@\//, "")
    .replace(/^src\//, "")
    .replace(/^views\//, "")
    .replace(/^\/+/, "")
    .replace(/\.vue$/i, "");
}

function isLayoutComponent(component?: string) {
  if (!component) {
    return false;
  }

  const normalized = normalizeComponentPath(component).toLowerCase();
  return normalized === "layout" || normalized.includes("layout");
}

function resolveDynamicRouteComponent(component: string) {
  if (isLayoutComponent(component)) {
    return () => import("@/layouts/AdminLayout.vue");
  }

  const normalizedComponent = normalizeComponentPath(component);
  if (normalizedComponent === "website/editor") {
    return () => import("@/views/website-editor/index.vue");
  }

  return () => import(`@/views/${normalizedComponent}.vue`);
}

function getMenuTitle(item: PermissionMenuNode, fallback: string) {
  return item.title || item.name || fallback;
}

function sanitizeRouteName(value: string) {
  return value
    .trim()
    .replace(/^\//, "")
    .replace(/[:/\\\s]+/g, "-")
    .replace(/[^\w-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildRouteName(
  item: PermissionMenuNode,
  routePath: string,
  usedNames: Set<string>,
) {
  const rawName =
    item.code ||
    item.name ||
    item.title ||
    getRouteSegments(routePath).join("-") ||
    "dynamic-menu";
  const baseName = sanitizeRouteName(rawName) || "dynamic-menu";
  let routeName = baseName;
  let index = 1;

  while (usedNames.has(routeName) || router.hasRoute(routeName)) {
    routeName = `${baseName}-${index}`;
    index += 1;
  }

  usedNames.add(routeName);
  return routeName;
}

function shouldUseMenuNode(item: PermissionMenuNode) {
  return item.type !== "button" && Boolean(item.path);
}

function isHiddenMenuNode(item: PermissionMenuNode) {
  return item.hide === true || item.is_hidden === true;
}

function getGroupPath(fullPath: string) {
  const firstSegment = getRouteSegments(fullPath)[0];
  return firstSegment ? `/${firstSegment}` : "/";
}

function collectMenuPages(
  menuList: PermissionMenuNode[],
  parent?: PermissionMenuNode,
): MenuPage[] {
  const pages: MenuPage[] = [];

  menuList.forEach((item) => {
    const fullPath = normalizeRoutePath(item.path);
    const component = item.component?.trim();
    const hasPageComponent = Boolean(component && !isLayoutComponent(component));

    if (shouldUseMenuNode(item) && hasPageComponent && fullPath !== "/") {
      const groupPath = getGroupPath(fullPath);
      const groupTitle = getMenuTitle(parent || item, groupPath.replace("/", ""));

      pages.push({
        item,
        fullPath,
        component: component as string,
        groupPath,
        groupTitle,
        groupIcon: parent?.icon || item.icon,
      });
    }

    if (item.children?.length) {
      pages.push(...collectMenuPages(item.children, item));
    }
  });

  return pages;
}

function createFallbackMenu(): PermissionMenuNode[] {
  return [
    {
      name: "系统管理",
      title: "系统管理",
      path: "/admin",
      component: "Layout",
      icon: "Setting",
      children: [
        {
          name: "dashboard",
          title: "控制台",
          path: DEFAULT_HOME_PATH,
          component: "dashboard/DashboardView.vue",
          icon: "HomeFilled",
        },
      ],
    },
    {
      name: "官网管理",
      title: "官网管理",
      path: "/website",
      component: "Layout",
      icon: "Document",
      children: [
        {
          name: "website-editor",
          title: "官网配置",
          path: "/website/editor",
          component: "website-editor/index.vue",
          icon: "Document",
        },
      ],
    },
  ];
}

function buildDynamicRouteRecords(
  menuList: PermissionMenuNode[],
): RouteRecordRaw[] {
  const sourceMenu = menuList.length ? menuList : createFallbackMenu();
  const pages = collectMenuPages(sourceMenu);
  const routePages = pages.length ? pages : collectMenuPages(createFallbackMenu());
  const usedNames = new Set<string>();
  const groupMap = new Map<string, RouteRecordRaw & { children: RouteRecordRaw[] }>();

  routePages.forEach((page) => {
    const groupName = `dynamic-group-${sanitizeRouteName(page.groupPath)}`;

    if (!groupMap.has(page.groupPath)) {
      groupMap.set(page.groupPath, {
        path: page.groupPath,
        name: groupName,
        component: () => import("@/layouts/AdminLayout.vue"),
        meta: {
          requiresAuth: true,
          title: page.groupTitle,
          icon: page.groupIcon,
        },
        children: [],
      });
    }

    const group = groupMap.get(page.groupPath);
    if (!group) {
      return;
    }

    group.children.push({
      path: toChildRoutePath(page.groupPath, page.fullPath),
      name: buildRouteName(page.item, page.fullPath, usedNames),
      component: resolveDynamicRouteComponent(page.component),
      meta: {
        requiresAuth: true,
        title: getMenuTitle(page.item, page.fullPath),
        icon: page.item.icon,
        hide: isHiddenMenuNode(page.item),
        keepAlive: page.item.keep_alive,
      },
    });
  });

  return Array.from(groupMap.values()).map((group) => ({
    ...group,
    redirect: group.children.some((child) => child.path === "")
      ? undefined
      : `${group.path}/${group.children[0]?.path || ""}`.replace(/\/$/, ""),
  }));
}

function ensureDynamicRoutes(menuList: PermissionMenuNode[]) {
  const routeRecords = buildDynamicRouteRecords(menuList);

  routeRecords.forEach((record) => {
    const routeName = String(record.name);

    if (!router.hasRoute(routeName)) {
      removeDynamicRouteCallbacks.push(router.addRoute(record));
    }
  });
}

export function resetDynamicRoutes() {
  removeDynamicRouteCallbacks.splice(0).forEach((removeRoute) => {
    removeRoute();
  });
  dynamicRoutesReady = false;
  dynamicRoutesPromise = null;
}

function isCatchAllRoute(route: Pick<RouteLocationNormalized, "matched">) {
  return route.matched.some((record) => record.path.includes("pathMatch"));
}

function getFirstMenuPath(menuList: PermissionMenuNode[]): string {
  for (const item of menuList) {
    if (
      shouldUseMenuNode(item) &&
      !isHiddenMenuNode(item) &&
      item.component &&
      !isLayoutComponent(item.component)
    ) {
      return normalizeRoutePath(item.path);
    }

    if (item.children?.length) {
      const childPath = getFirstMenuPath(item.children);
      if (childPath) {
        return childPath;
      }
    }
  }

  return DEFAULT_HOME_PATH;
}

async function setupDynamicRoutes(
  permissionStore: ReturnType<typeof usePermissionStore>,
) {
  if (dynamicRoutesReady) {
    return;
  }

  if (!dynamicRoutesPromise) {
    dynamicRoutesPromise = (async () => {
      const shouldForceFetch =
        permissionStore.menuFetched && permissionStore.permissionMenu.length === 0;

      await permissionStore.loadUserMenu(shouldForceFetch);
      ensureDynamicRoutes(permissionStore.permissionMenu);
      dynamicRoutesReady = true;
    })().finally(() => {
      dynamicRoutesPromise = null;
    });
  }

  await dynamicRoutesPromise;
}

router.beforeEach(async (to) => {
  const userStore = useUserStore(pinia);
  const permissionStore = usePermissionStore(pinia);
  const hasToken = Boolean(userStore.token);
  const isWhiteRoute = whiteList.has(to.path);

  if (!hasToken) {
    if (isWhiteRoute) {
      return true;
    }

    return {
      path: LOGIN_PATH,
      query: { redirect: to.fullPath },
      replace: true,
    };
  }

  await setupDynamicRoutes(permissionStore);

  const defaultPath = getFirstMenuPath(permissionStore.permissionMenu);

  if (isWhiteRoute || to.meta.public) {
    return to.path === defaultPath
      ? true
      : { path: defaultPath, replace: true };
  }

  if (isCatchAllRoute(to)) {
    const resolved = router.resolve(to.fullPath);

    if (!isCatchAllRoute(resolved)) {
      return {
        path: to.path,
        query: to.query,
        hash: to.hash,
        replace: true,
      };
    }

    return to.path === defaultPath
      ? true
      : { path: defaultPath, replace: true };
  }

  return true;
});

export default router;

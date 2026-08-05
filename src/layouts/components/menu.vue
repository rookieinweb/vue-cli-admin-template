<template>
  <div class="menu-shell">
    <el-menu
      ref="menuRef"
      class="admin-layout__menu"
      :default-active="route.path"
      :default-openeds="openedMenus"
      router
      unique-opened
      collapse-transition
    >
      <MenuTree
        :items="menuTree"
        :active-group-path="activeGroupPath"
        :current-path="route.path"
      />
    </el-menu>
  </div>
</template>

<script lang="ts">
export default {
  name: "LayoutMenu",
};
</script>

<script setup lang="ts">
import { computed, nextTick, ref, watch,onMounted } from "vue";
import type { Component } from "vue";
import { useRoute, useRouter, type RouteRecordRaw } from "vue-router";
import {
  Document,
  HomeFilled,
  Lock,
  Setting,
  User,
} from "@element-plus/icons-vue";
import { usePermissionStore } from "@/stores/permission";
import MenuTree from "./menu-tree.vue";

const route = useRoute();
const router = useRouter();
const permissionStore = usePermissionStore();
const menuRef = ref<{ open: (index: string) => void }>();

const iconMap: Record<string, Component> = {
  Document,
  HomeFilled,
  Lock,
  Setting,
  User,
};

onMounted(() => [
  console.log(222222222222)
])
function formatModuleTitle(path: string) {
  const name = path.replace(/^\//, "").split("/")[0] || "module";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function buildMenuPath(parentPath: string, childPath: string) {
  if (childPath.startsWith("/")) {
    return childPath;
  }

  const normalizedParent = parentPath.replace(/^\/+|\/+$/g, "");
  const normalizedChild = childPath.replace(/^\/+|\/+$/g, "");

  if (!normalizedParent) {
    return `/${normalizedChild}`;
  }

  if (!normalizedChild) {
    return `/${normalizedParent}`;
  }

  return `/${normalizedParent}/${normalizedChild}`;
}

function isVisibleRoute(routeRecord: RouteRecordRaw) {
  return routeRecord.meta?.hide !== true;
}

function isMenuLeaf(routeRecord: RouteRecordRaw) {
  return Boolean(
    isVisibleRoute(routeRecord) &&
      routeRecord.path &&
      routeRecord.path !== "" &&
      routeRecord.meta?.title,
  );
}

function toMenuTree() {
  return router.options.routes
    .filter(
      (item) =>
        isVisibleRoute(item) &&
        item.children?.length &&
        item.path !== "/" &&
        item.path !== "/:pathMatch(.*)*",
    )
    .filter((item) => (item.children ?? []).some(isMenuLeaf))
    .map((item) => ({
      path: item.path,
      title: (item.meta?.title as string) || formatModuleTitle(item.path),
      iconComponent: item.meta?.icon
        ? iconMap[item.meta.icon as string]
        : undefined,
      children: (item.children ?? []).filter(isMenuLeaf).map((child) => ({
        path: buildMenuPath(item.path, child.path),
        title: child.meta?.title as string,
        iconComponent: child.meta?.icon
          ? iconMap[child.meta.icon as string]
          : undefined,
        children: [],
      })),
    }));
}

function toPermissionMenuTree(items: Array<{ path?: string; title?: string; name?: string; children?: any[]; icon?: string }>) {
  return items
    .filter((item) => item.path || item.name || item.title)
    .map((item) => ({
      path: item.path || item.name || "/",
      title: item.title || item.name || formatModuleTitle(item.path || item.name || "/"),
      iconComponent: item.icon ? iconMap[item.icon as string] : undefined,
      children: item.children?.length
        ? toPermissionMenuTree(item.children)
        : [],
    }));
}

const menuTree = computed(() => {
  console.log('permissionStore.permissionMenuLoaded111111111111111',permissionStore.permissionMenuLoaded)
  if (permissionStore.permissionMenuLoaded && permissionStore.permissionMenu.length > 0) {
    return toPermissionMenuTree(permissionStore.permissionMenu);
  }

  return toMenuTree();
});

const activeGroupPath = computed(() => {
  const activeGroup = menuTree.value.find(
    (group) =>
      route.matched.some((record) => record.path === group.path) ||
      group.children.some((item) => item.path === route.path),
  );

  return activeGroup?.path ?? "";
});

const openedMenus = computed(() => {
  return activeGroupPath.value ? [activeGroupPath.value] : [];
});

watch(
  activeGroupPath,
  async (path) => {
    if (!path) return;

    await nextTick();
    menuRef.value?.open(path);
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.menu-shell {
  min-height: 0;
  padding: 4px;
}

.admin-layout__menu {
  border-right: 0;
  background: transparent;
  border-radius: 8px;
  overflow: hidden;

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 44px;
    margin: 3px 0;
    border-radius: 8px;
    color: var(--app-muted);
    line-height: 44px;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  :deep(.el-sub-menu__title:hover),
  :deep(.el-menu-item:hover) {
    background: #f1f5f9;
    color: var(--app-text);
    transform: translateX(2px);
  }

  :deep(.el-menu-item.is-active) {
    color: var(--app-primary);
    background: #eaf3ff;
    font-weight: 700;
    box-shadow: inset 3px 0 0 var(--app-primary);
  }

  :deep(.menu-group--active > .el-sub-menu__title),
  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: var(--app-primary);
    background: #eef6ff;
    font-weight: 700;
    box-shadow: inset 3px 0 0 var(--app-primary);
  }

  :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
    color: var(--app-primary);
    background: #f4f9ff;
  }
}
</style>

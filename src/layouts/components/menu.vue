<template>
  <div class="menu-shell">
    <el-menu
      class="admin-layout__menu"
      :default-active="route.path"
      :default-openeds="openedMenus"
      router
      unique-opened
      collapse-transition
    >
      <MenuTree :items="menuTree" :active-path="activeGroupPath" />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { HomeFilled, Lock, Setting, User } from "@element-plus/icons-vue";
import MenuTree from "./menu-tree.vue";

const route = useRoute();
const router = useRouter();

const iconMap: Record<string, any> = {
  HomeFilled,
  Lock,
  Setting,
  User,
};

function formatModuleTitle(path: string) {
  const name = path.replace(/^\//, "").split("/")[0] || "module";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function buildMenuPath(parentPath: string, childPath: string) {
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

function toMenuTree() {
  return router
    .getRoutes()
    .filter((item) => item.children?.length && item.path !== "/" && item.path !== "/:pathMatch(.*)*")
    .filter((item) =>
      (item.children ?? []).some((child) => child.path && child.path !== "" && child.meta?.title),
    )
    .map((item) => ({
      path: item.path,
      title: (item.meta?.title as string) || formatModuleTitle(item.path),
      iconComponent: item.meta?.icon ? iconMap[item.meta.icon as string] : undefined,
      children: (item.children ?? [])
        .filter((child) => child.path && child.path !== "" && child.meta?.title)
        .map((child) => ({
          path: buildMenuPath(item.path, child.path),
          title: child.meta?.title as string,
          iconComponent: child.meta?.icon ? iconMap[child.meta.icon as string] : undefined,
          children: [],
        })),
    }));
}

const menuTree = computed(() => toMenuTree());

const activeGroupPath = computed(() => {
  const activeGroup = menuTree.value.find((group) =>
    group.children.some((item) => item.path === route.path),
  );

  return activeGroup?.path ?? "";
});

const openedMenus = computed(() => {
  return activeGroupPath.value ? [activeGroupPath.value] : [];
});
</script>

<style lang="scss" scoped>
.menu-shell {
  padding: 6px;
}

.admin-layout__menu {
  border-right: 0;
  background: transparent;
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 44px;
    margin: 4px 0;
    border-radius: 10px;
    color: #475569;
    transition: all 0.2s ease;
  }

  :deep(.el-sub-menu__title:hover),
  :deep(.el-menu-item:hover) {
    background: linear-gradient(90deg, #f8fafc 0%, #eef2ff 100%);
    transform: translateX(2px);
  }

  :deep(.el-menu-item.is-active) {
    color: #2563eb;
    background: linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%);
    font-weight: 700;
    box-shadow: inset 2px 0 0 #2563eb;
  }

  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: #2563eb;
    background: linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%);
    font-weight: 700;
    box-shadow: inset 2px 0 0 #2563eb;
  }

  :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
    color: #2563eb;
    background: linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%);
  }
}
</style>

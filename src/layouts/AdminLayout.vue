<template>
  <el-container class="admin-layout">
    <el-aside class="admin-layout__aside" width="248px">
      <div class="admin-layout__brand">
        <div class="admin-layout__logo">S</div>
        <div>
          <h1>Smart CRM</h1>
          <p>Vue3 后台管理模板</p>
        </div>
      </div>
      <Menu />
    </el-aside>

    <el-container class="admin-layout__main">
      <el-header class="admin-layout__header">
        <div>
          <p class="admin-layout__subtitle">后台管理系统</p>
          <h2>{{ currentTitle }}</h2>
        </div>

        <div class="admin-layout__actions">
          <el-tag type="success" effect="light">在线</el-tag>
          <el-dropdown trigger="click" @command="handleCommand">
            <button class="admin-layout__user" type="button">
              <el-avatar :size="32">{{ avatarText }}</el-avatar>
              <span>
                <strong>{{ userStore.displayName }}</strong>
                <small>{{ userStore.userInfo?.account || "guest" }}</small>
              </span>
            </button>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="admin-layout__content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { resetDynamicRoutes } from "@/router";
import { usePermissionStore } from "@/stores/permission";
import { useUserStore } from "@/stores/user";
import Menu from "./components/menu.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const permissionStore = usePermissionStore();

const currentTitle = computed(() => {
  const matchedRoute = [...route.matched].reverse().find((record) => {
    const title = record.meta?.title;
    return typeof title === "string" && title.trim();
  });

  return matchedRoute?.meta?.title ?? "后台管理";
});
const avatarText = computed(() =>
  (userStore.displayName || "A").slice(0, 1).toUpperCase(),
);

function handleCommand(command: string) {
  if (command === "logout") {
    userStore.logout();
    permissionStore.resetUserMenu();
    resetDynamicRoutes();
    router.push("/login");
  }
}
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(235, 244, 255, 0.72), rgba(244, 247, 251, 0) 260px),
    var(--app-bg);

  &__aside {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-height: 100vh;
    padding: 18px 14px;
    border-right: 1px solid var(--app-border);
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 8px 0 24px rgba(15, 23, 42, 0.04);
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 56px;
    padding: 0 8px 14px;
    border-bottom: 1px solid var(--app-border);

    h1 {
      margin: 0;
      color: var(--app-heading);
      font-size: 18px;
      line-height: 1.2;
    }

    p {
      margin: 4px 0 0;
      color: var(--app-muted);
      font-size: 12px;
    }
  }

  &__logo {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    color: #ffffff;
    font-weight: 800;
    background: linear-gradient(135deg, var(--app-primary), #0f766e);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.22);
  }

  &__main {
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    padding: 0 28px;
    border-bottom: 1px solid var(--app-border);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(16px);

    h2 {
      margin: 4px 0 0;
      color: var(--app-heading);
      font-size: 22px;
      line-height: 1.25;
    }
  }

  &__subtitle {
    margin: 0;
    color: var(--app-muted);
    font-size: 12px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 148px;
    padding: 6px 8px;
    border: 1px solid var(--app-border);
    border-radius: 8px;
    background: var(--app-surface);
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      border-color: #b9c7d9;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
    }

    span {
      display: flex;
      min-width: 0;
      flex-direction: column;
    }

    strong {
      color: var(--app-heading);
      font-size: 14px;
      line-height: 1.2;
    }

    small {
      margin-top: 2px;
      color: var(--app-muted);
      font-size: 12px;
    }
  }

  &__content {
    padding: 24px;
    min-width: 0;
  }
}

@media (max-width: 960px) {
  .admin-layout {
    display: block;

    &__aside {
      width: 100% !important;
      min-height: auto;
      border-right: 0;
      border-bottom: 1px solid var(--app-border);
      box-shadow: none;
    }

    &__header {
      height: auto;
      align-items: flex-start;
      flex-direction: column;
      gap: 14px;
      padding: 18px;
    }

    &__actions {
      width: 100%;
      justify-content: space-between;
    }

    &__user {
      min-width: 0;
    }

    &__content {
      padding: 16px;
    }
  }
}
</style>

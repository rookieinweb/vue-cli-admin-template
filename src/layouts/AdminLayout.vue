<template>
  <el-container class="admin-layout">
    <el-aside class="admin-layout__aside" width="248px">
      <div class="admin-layout__brand">
        <div class="admin-layout__logo">A</div>
        <div>
          <h1>Admin Pro</h1>
          <p>Vue3 后台管理模板</p>
        </div>
      </div>

      <el-menu
        class="admin-layout__menu"
        :default-active="route.path"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <span>控制台</span>
        </el-menu-item>
        <el-menu-item index="/admin/permission">
          <el-icon><Lock /></el-icon>
          <span>权限管理</span>
        </el-menu-item>
      </el-menu>
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
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
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
import { HomeFilled, Lock } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const titleMap: Record<string, string> = {
  "/admin/dashboard": "控制台",
  "/admin/permission": "权限管理",
};

const currentTitle = computed(() => titleMap[route.path] ?? "后台管理");
const avatarText = computed(() =>
  (userStore.displayName || "A").slice(0, 1).toUpperCase(),
);

function handleCommand(command: string) {
  if (command === "logout") {
    userStore.logout();
    router.push("/login");
  }
}
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  background: #f4f7fb;

  &__aside {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px 16px;
    border-right: 1px solid #dbe3ef;
    background: #ffffff;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 56px;
    padding: 0 8px;

    h1 {
      margin: 0;
      color: #111827;
      font-size: 18px;
    }

    p {
      margin: 4px 0 0;
      color: #64748b;
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
    background: #2563eb;
  }

  &__menu {
    border-right: 0;

    :deep(.el-menu-item) {
      height: 44px;
      border-radius: 8px;
      color: #475569;
    }

    :deep(.el-menu-item.is-active) {
      color: #2563eb;
      background: #eff6ff;
      font-weight: 700;
    }
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
    border-bottom: 1px solid #dbe3ef;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(16px);

    h2 {
      margin: 4px 0 0;
      color: #111827;
      font-size: 22px;
    }
  }

  &__subtitle {
    margin: 0;
    color: #64748b;
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
    border: 1px solid #dbe3ef;
    border-radius: 8px;
    background: #ffffff;
    color: inherit;
    text-align: left;
    cursor: pointer;

    span {
      display: flex;
      min-width: 0;
      flex-direction: column;
    }

    strong {
      color: #111827;
      font-size: 14px;
      line-height: 1.2;
    }

    small {
      margin-top: 2px;
      color: #64748b;
      font-size: 12px;
    }
  }

  &__content {
    padding: 24px;
  }
}

@media (max-width: 960px) {
  .admin-layout {
    display: block;

    &__aside {
      width: 100% !important;
      border-right: 0;
      border-bottom: 1px solid #dbe3ef;
    }

    &__header {
      height: auto;
      align-items: flex-start;
      flex-direction: column;
      gap: 14px;
      padding: 18px;
    }

    &__content {
      padding: 16px;
    }
  }
}
</style>

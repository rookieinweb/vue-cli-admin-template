<template>
  <el-container class="admin-layout">
    <el-aside class="admin-layout__aside" width="260px">
      <div class="admin-layout__brand">
        <div class="admin-layout__logo">A</div>
        <div>
          <h1>Admin Pro</h1>
          <p>Vue3 后台管理框架</p>
        </div>
      </div>

      <el-menu
        class="admin-layout__menu"
        :default-active="route.path"
        router
        background-color="transparent"
        text-color="#cbd5e1"
        active-text-color="#ffffff"
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
          <el-tag effect="dark" type="success">在线</el-tag>
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="admin-layout__user">
              <el-avatar size="small">{{ avatarText }}</el-avatar>
              <div>
                <strong>{{ userStore.displayName }}</strong>
                <p>{{ userStore.userInfo?.account || 'guest' }}</p>
              </div>
            </div>

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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const titleMap: Record<string, string> = {
  '/admin/dashboard': '控制台',
  '/admin/permission': '权限管理',
}

const currentTitle = computed(() => titleMap[route.path] ?? '后台管理')
const avatarText = computed(() => (userStore.displayName || 'A').slice(0, 1).toUpperCase())

function handleCommand(command: string) {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(45, 212, 191, 0.18), transparent 28%),
    radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.14), transparent 24%),
    #0f172a;

  &__aside {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px 18px;
    border-right: 1px solid rgba(148, 163, 184, 0.16);
    backdrop-filter: blur(18px);
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 14px;

    h1 {
      margin: 0;
      font-size: 20px;
      color: #fff;
    }

    p {
      margin: 4px 0 0;
      color: #94a3b8;
      font-size: 12px;
    }
  }

  &__logo {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 16px;
    color: #0f172a;
    font-weight: 800;
    background: linear-gradient(135deg, #5eead4, #93c5fd);
    box-shadow: 0 12px 30px rgba(56, 189, 248, 0.3);
  }

  &__menu {
    border-right: 0;
  }

  &__main {
    background: transparent;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 84px;
    padding: 0 28px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.16);
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(18px);

    h2 {
      margin: 4px 0 0;
      color: #fff;
      font-size: 22px;
    }
  }

  &__subtitle {
    margin: 0;
    color: #94a3b8;
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;

    strong,
    p {
      display: block;
      margin: 0;
    }

    strong {
      color: #fff;
      font-size: 14px;
    }

    p {
      color: #94a3b8;
      font-size: 12px;
    }
  }

  &__content {
    padding: 28px;
  }
}

@media (max-width: 960px) {
  .admin-layout {
    &__aside {
      width: 100% !important;
    }

    &__header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      height: auto;
      padding: 20px 18px;
    }

    &__content {
      padding: 18px;
    }
  }
}
</style>
<template>
  <div class="dashboard">
    <section class="dashboard__summary">
      <div>
        <p class="dashboard__eyebrow">Dashboard</p>
        <h1>你好，{{ userStore.displayName }}</h1>
        <p>
          当前模板已接入路由、状态管理、请求封装和权限配置，可继续扩展业务模块。
        </p>
      </div>

      <el-button type="primary" @click="router.push('/admin/permission')">
        前往权限管理
      </el-button>
    </section>

    <el-row :gutter="16">
      <el-col
        v-for="item in stats"
        :key="item.label"
        :xs="24"
        :sm="12"
        :lg="6"
      >
        <el-card class="dashboard__card" shadow="never">
          <p>{{ item.label }}</p>
          <strong>{{ item.value }}</strong>
          <span>{{ item.tip }}</span>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="14">
        <el-card class="dashboard__panel" shadow="never">
          <template #header>
            <div class="dashboard__panel-header">
              <span>快速入口</span>
            </div>
          </template>

          <div class="dashboard__quick-grid">
            <button
              v-for="entry in quickEntries"
              :key="entry.title"
              class="dashboard__quick-item"
              type="button"
              @click="router.push(entry.path)"
            >
              <h3>{{ entry.title }}</h3>
              <p>{{ entry.description }}</p>
            </button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card class="dashboard__panel" shadow="never">
          <template #header>
            <div class="dashboard__panel-header">
              <span>当前登录信息</span>
            </div>
          </template>

          <el-descriptions :column="1" border>
            <el-descriptions-item label="账号">
              {{ userStore.userInfo?.account || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="姓名">
              {{ userStore.userInfo?.name || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="昵称">
              {{ userStore.userInfo?.nickname || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="角色">
              {{ userStore.userInfo?.role || "-" }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { usePermissionStore } from "@/stores/permission";

const router = useRouter();
const userStore = useUserStore();
const permissionStore = usePermissionStore();

onMounted(() => {
  if (!permissionStore.roles.length) {
    permissionStore.loadCatalog();
  }
});

const stats = computed(() => [
  {
    label: "角色数量",
    value: permissionStore.roles.length,
    tip: "管理员、运营、审核等角色",
  },
  {
    label: "当前角色",
    value: userStore.userInfo?.role ?? "未识别",
    tip: "根据登录用户资料展示",
  },
  {
    label: "账号状态",
    value: userStore.isLoggedIn ? "已登录" : "未登录",
    tip: "Pinia 与路由守卫控制",
  },
  {
    label: "请求层",
    value: "Axios",
    tip: "统一 token、错误与响应解析",
  },
]);

const quickEntries = [
  {
    title: "登录页",
    description: "支持重定向和登录态管理。",
    path: "/login",
  },
  {
    title: "注册页",
    description: "完整用户资料表单与校验。",
    path: "/register",
  },
  {
    title: "权限页",
    description: "通过角色和权限树配置后台权限。",
    path: "/admin/permission",
  },
];
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__summary {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    padding: 24px;
    border: 1px solid #dbe3ef;
    border-radius: 8px;
    background: #ffffff;

    h1 {
      margin: 0;
      color: #111827;
      font-size: 28px;
    }

    p:last-child {
      max-width: 58ch;
      margin: 10px 0 0;
      color: #64748b;
      line-height: 1.7;
    }
  }

  &__eyebrow {
    margin: 0 0 8px;
    color: #2563eb;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  &__card,
  &__panel {
    border: 1px solid #dbe3ef;
    border-radius: 8px;
  }

  &__card {
    min-height: 132px;
    margin-bottom: 16px;

    p {
      margin: 0 0 12px;
      color: #64748b;
      font-size: 13px;
    }

    strong {
      display: block;
      margin-bottom: 8px;
      color: #111827;
      font-size: 26px;
    }

    span {
      color: #64748b;
      font-size: 13px;
    }
  }

  &__panel-header {
    color: #111827;
    font-weight: 700;
  }

  &__quick-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  &__quick-item {
    min-height: 118px;
    padding: 16px;
    border: 1px solid #dbe3ef;
    border-radius: 8px;
    background: #f8fafc;
    text-align: left;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      border-color: #2563eb;
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12);
    }

    h3 {
      margin: 0 0 10px;
      color: #111827;
      font-size: 16px;
    }

    p {
      margin: 0;
      color: #64748b;
      line-height: 1.7;
    }
  }
}

@media (max-width: 960px) {
  .dashboard {
    &__summary {
      align-items: flex-start;
      flex-direction: column;
    }

    &__quick-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>

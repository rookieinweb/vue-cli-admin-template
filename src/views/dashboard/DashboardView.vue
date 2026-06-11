<template>
  <div class="dashboard">
    <section class="dashboard__hero">
      <div>
        <p class="dashboard__eyebrow">Dashboard</p>
        <h1>你好，{{ userStore.displayName }}</h1>
        <p class="dashboard__copy">
          当前后台框架已经接通路由、状态管理、请求封装和基础权限页面，可以直接继续扩展业务模块。
        </p>
      </div>

      <el-button type="primary" plain @click="router.push('/admin/permission')">前往权限管理</el-button>
    </section>

    <el-row :gutter="20" class="dashboard__cards">
      <el-col :xs="24" :sm="12" :lg="6" v-for="item in stats" :key="item.label">
        <el-card class="dashboard__card" shadow="never">
          <p>{{ item.label }}</p>
          <strong>{{ item.value }}</strong>
          <span>{{ item.tip }}</span>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :lg="14">
        <el-card class="dashboard__panel" shadow="never">
          <template #header>
            <div class="dashboard__panel-header">
              <span>快速入口</span>
            </div>
          </template>

          <div class="dashboard__quick-grid">
            <div class="dashboard__quick-item">
              <h3>登录页</h3>
              <p>支持路由跳转和登录态管理。</p>
            </div>
            <div class="dashboard__quick-item">
              <h3>注册页</h3>
              <p>包含姓名、昵称、性别、身份证号、电话号码等字段。</p>
            </div>
            <div class="dashboard__quick-item">
              <h3>权限页</h3>
              <p>通过角色与权限树快速配置后台权限结构。</p>
            </div>
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
            <el-descriptions-item label="账号">{{ userStore.userInfo?.account }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ userStore.userInfo?.name }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{ userStore.userInfo?.nickname }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{ userStore.userInfo?.role }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'

const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const stats = computed(() => [
  {
    label: '角色数量',
    value: permissionStore.roles.length,
    tip: '支持管理员、运营和审核角色',
  },
  {
    label: '当前角色',
    value: userStore.userInfo?.role ?? '未识别',
    tip: '登录后自动显示用户角色',
  },
  {
    label: '账户状态',
    value: userStore.isLoggedIn ? '已登录' : '未登录',
    tip: '由 Pinia 与路由守卫控制',
  },
  {
    label: '请求层',
    value: 'Axios',
    tip: '已封装统一请求与 mock 数据',
  },
])
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__hero {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    padding: 28px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 28px;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.84));
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.24);

    h1 {
      margin: 0;
      color: #fff;
      font-size: clamp(28px, 4vw, 44px);
    }
  }

  &__eyebrow {
    margin: 0 0 10px;
    color: #67e8f9;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  &__copy {
    max-width: 52ch;
    margin: 14px 0 0;
    color: #cbd5e1;
    line-height: 1.8;
  }

  &__cards {
    margin-top: 2px;
  }

  &__card,
  &__panel {
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 24px;
    background: rgba(15, 23, 42, 0.82);
    color: #e2e8f0;
  }

  &__card {
    min-height: 140px;

    p {
      margin: 0 0 14px;
      color: #94a3b8;
      font-size: 13px;
    }

    strong {
      display: block;
      font-size: 28px;
      color: #fff;
      margin-bottom: 8px;
    }

    span {
      color: #94a3b8;
    }
  }

  &__panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    font-weight: 700;
  }

  &__quick-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  &__quick-item {
    padding: 18px;
    border-radius: 18px;
    background: rgba(30, 41, 59, 0.8);

    h3 {
      margin: 0 0 10px;
      color: #fff;
      font-size: 16px;
    }

    p {
      margin: 0;
      color: #cbd5e1;
      line-height: 1.7;
    }
  }
}

@media (max-width: 960px) {
  .dashboard__hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .dashboard__quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>
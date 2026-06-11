<template>
  <div class="auth-page">
    <section class="auth-page__panel auth-page__panel--intro">
      <p class="auth-page__eyebrow">Admin Pro</p>
      <h1>用一套清晰的管理框架承载你的后台业务</h1>
      <p class="auth-page__copy">
        这是一个基于 Vue3、Pinia、Router、Axios 和 Element Plus
        的后台管理项目脚手架，已经内置登录、注册和权限管理页面。
      </p>

      <ul class="auth-page__points">
        <li>路由守卫 + 登录态控制</li>
        <li>Pinia 用户状态管理</li>
        <li>Axios 统一请求封装</li>
        <li>Element Plus 业务表单</li>
      </ul>
    </section>

    <section class="auth-page__panel auth-page__panel--form">
      <div class="auth-card">
        <div class="auth-card__header">
          <p>欢迎回来</p>
          <h2>登录系统</h2>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          size="large"
          label-position="top"
          @keyup.enter="handleLogin"
        >
          <el-form-item label="账号" prop="account">
            <el-input
              v-model="form.account"
              placeholder="请输入账号，默认 admin"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              show-password
              placeholder="请输入密码，默认 123456"
            />
          </el-form-item>

          <div class="auth-card__footer">
            <el-checkbox v-model="remember">记住登录状态</el-checkbox>
            <el-link type="primary" @click="router.push('/register')"
              >没有账号？去注册</el-link
            >
          </div>

          <el-button
            class="auth-card__submit"
            type="primary"
            :loading="loading"
            @click="handleLogin"
          >
            立即登录
          </el-button>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/user";
import type { LoginForm } from "@/types/auth";
import { getUsersApi } from "@/api/auth";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const loading = ref(false);
const remember = ref(true);
const formRef = ref<FormInstance>();

const form = reactive<LoginForm>({
  account: String(route.query.account ?? "admin"),
  password: String(route.query.password ?? "123456"),
});

const rules: FormRules<LoginForm> = {
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
onMounted(async () => {
  console.log(111111111111111111, 222222222);
  const users = await getUsersApi({ id: 1 });
  console.log("22222222222222333333333333", users);
});
async function handleLogin() {
  await formRef.value?.validate(async (valid) => {
    if (!valid) {
      return;
    }

    loading.value = true;

    try {
      await userStore.login(form);
      const redirect =
        typeof route.query.redirect === "string"
          ? route.query.redirect
          : "/admin/dashboard";
      router.replace(redirect);
    } finally {
      loading.value = false;
    }
  });
}
</script>

<style scoped lang="scss">
.auth-page {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  min-height: 100vh;
  color: #fff;
  background: radial-gradient(
      circle at top left,
      rgba(45, 212, 191, 0.3),
      transparent 28%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(59, 130, 246, 0.28),
      transparent 24%
    ),
    linear-gradient(135deg, #0f172a 0%, #111827 42%, #0f172a 100%);

  &__panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(32px, 6vw, 72px);
  }

  &__eyebrow {
    margin: 0 0 16px;
    color: #67e8f9;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: clamp(34px, 5vw, 58px);
    line-height: 1.08;
    max-width: 14ch;
  }

  &__copy {
    margin: 20px 0 0;
    max-width: 52ch;
    color: rgba(226, 232, 240, 0.86);
    line-height: 1.8;
    font-size: 15px;
  }

  &__points {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin: 32px 0 0;
    padding: 0;
    list-style: none;

    li {
      padding: 16px 18px;
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 18px;
      background: rgba(15, 23, 42, 0.42);
      backdrop-filter: blur(18px);
      color: #e2e8f0;
    }
  }

  &__panel--form {
    align-items: center;
  }
}

.auth-card {
  width: min(480px, 100%);
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.35);

  &__header {
    margin-bottom: 24px;

    p {
      margin: 0 0 8px;
      color: #94a3b8;
    }

    h2 {
      margin: 0;
      font-size: 28px;
      color: #fff;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }

  &__submit {
    width: 100%;
  }
}

:deep(.el-form-item__label) {
  color: rgba(226, 232, 240, 0.9);
}

@media (max-width: 960px) {
  .auth-page {
    grid-template-columns: 1fr;

    &__panel--intro {
      min-height: auto;
      padding-bottom: 0;
    }

    &__points {
      grid-template-columns: 1fr;
    }
  }
}
</style>

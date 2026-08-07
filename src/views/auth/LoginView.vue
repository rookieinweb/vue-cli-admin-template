<template>
  <div class="auth-page">
    <section class="auth-page__intro">
      <p class="auth-page__eyebrow">Admin Pro</p>
      <h1>清晰、稳定的后台管理起点</h1>
      <p class="auth-page__copy">
        内置登录、注册、权限管理、路由守卫和统一请求封装，适合继续扩展业务模块。
      </p>

      <ul class="auth-page__points">
        <li>路由守卫与登录态管理</li>
        <li>Pinia 用户状态持久化</li>
        <li>Axios 统一请求封装</li>
        <li>Element Plus 表单体验</li>
      </ul>
    </section>

    <section class="auth-page__form-wrap">
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
            <el-link type="primary" @click="router.push('/register')">
              没有账号？去注册
            </el-link>
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
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { resetDynamicRoutes } from "@/router";
import { usePermissionStore } from "@/stores/permission";
import { useUserStore } from "@/stores/user";
import type { LoginForm } from "@/types/auth";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const permissionStore = usePermissionStore();

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

async function handleLogin() {
  const valid = await formRef.value?.validate();

  if (!valid) {
    return;
  }

  loading.value = true;

  try {
    await userStore.login(form);
    permissionStore.resetUserMenu();
    resetDynamicRoutes();
    const redirect =
      typeof route.query.redirect === "string"
        ? route.query.redirect
        : "/admin/dashboard";
    await router.replace(redirect);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 520px;
  min-height: 100vh;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.92), rgba(20, 184, 166, 0.78)),
    url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80")
      center / cover;
  color: #ffffff;

  &__intro,
  &__form-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(28px, 6vw, 72px);
  }

  &__eyebrow {
    margin: 0 0 16px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
  }

  h1 {
    max-width: 12ch;
    margin: 0;
    font-size: clamp(34px, 5vw, 58px);
    line-height: 1.08;
  }

  &__copy {
    max-width: 46ch;
    margin: 20px 0 0;
    color: rgba(255, 255, 255, 0.86);
    line-height: 1.8;
  }

  &__points {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    max-width: 620px;
    margin: 32px 0 0;
    padding: 0;
    list-style: none;

    li {
      padding: 14px 16px;
      border: 1px solid rgba(255, 255, 255, 0.24);
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.2);
      backdrop-filter: blur(14px);
    }
  }

  &__form-wrap {
    background: rgba(255, 255, 255, 0.94);
    color: #1f2937;
  }
}

.auth-card {
  width: min(420px, 100%);
  margin: 0 auto;

  &__header {
    margin-bottom: 24px;

    p {
      margin: 0 0 8px;
      color: #64748b;
    }

    h2 {
      margin: 0;
      color: #111827;
      font-size: 28px;
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

@media (max-width: 960px) {
  .auth-page {
    grid-template-columns: 1fr;

    &__points {
      grid-template-columns: 1fr;
    }

    &__form-wrap {
      justify-content: flex-start;
    }
  }
}

@media (max-width: 520px) {
  .auth-card__footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

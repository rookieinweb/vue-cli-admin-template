<template>
  <div class="register-page">
    <section class="register-page__form-wrap">
      <div class="register-card">
        <div class="register-card__header">
          <p>创建账号</p>
          <h2>注册新用户</h2>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          size="large"
          label-position="top"
        >
          <el-row :gutter="16">
            <el-col :xs="24" :sm="12">
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="form.username"
                  placeholder="请输入登录用户名"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="form.nickname" placeholder="请输入昵称" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :xs="24" :sm="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :xs="24" :sm="12">
              <el-form-item label="身份证号" prop="id_card">
                <el-input v-model="form.id_card" placeholder="请输入身份证号" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="出生日期" prop="birth_date">
                <el-date-picker
                  v-model="form.birth_date"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择出生日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :xs="24" :sm="12">
              <el-form-item label="性别" prop="gender">
                <el-select
                  v-model="form.gender"
                  placeholder="请选择性别"
                  style="width: 100%"
                >
                  <el-option label="男" :value="1" />
                  <el-option label="女" :value="2" />
                  <el-option label="未知" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="头像" prop="avatar">
                <el-input v-model="form.avatar" placeholder="请输入头像 URL" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :xs="24" :sm="12">
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="form.password"
                  type="password"
                  show-password
                  placeholder="请输入密码"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  show-password
                  placeholder="请再次输入密码"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :xs="24" :sm="12">
              <el-form-item label="角色类型" prop="role_id">
                <el-select
                  v-model="form.role_id"
                  placeholder="请选择角色"
                  style="width: 100%"
                >
                  <el-option label="管理员" :value="1" />
                  <el-option label="销售" :value="2" />
                  <el-option label="客服" :value="3" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="其他信息" prop="other">
            <el-input
              v-model="form.other"
              type="textarea"
              :rows="3"
              placeholder="请输入其他备注信息"
            />
          </el-form-item>
          

          <div class="register-card__footer">
            <el-link type="primary" @click="router.push('/login')">
              已有账号？去登录
            </el-link>
            <el-button type="primary" :loading="loading" @click="handleRegister">
              提交注册
            </el-button>
          </div>
        </el-form>
      </div>
    </section>

    <section class="register-page__intro">
      <p class="register-page__eyebrow">用户中心</p>
      <h1>完整用户资料，直接对接后端注册接口</h1>
      <p class="register-page__copy">
        表单字段覆盖用户名、密码、手机号、邮箱、头像、昵称、出生日期、身份证号和性别，提交后调用
        /user/register。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import type { RegisterForm } from "@/types/auth";

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const formRef = ref<FormInstance>();

const form = reactive<RegisterForm>({
  username: "",
  password: "",
  confirmPassword: "",
  phone: "",
  email: "",
  avatar: "",
  nickname: "",
  birth_date: "",
  id_card: "",
  gender: 0,
  other: "",
  role_id: 1,
});

const idCardPattern = /^(?:\d{15}|\d{17}[\dXx])$/;
const phonePattern = /^1[3-9]\d{9}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rules: FormRules<RegisterForm> = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码至少 6 位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (_, value, callback) => {
        if (value !== form.password) {
          callback(new Error("两次输入的密码不一致"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  id_card: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    {
      validator: (_, value, callback) => {
        if (!idCardPattern.test(value)) {
          callback(new Error("身份证号格式不正确"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      validator: (_, value, callback) => {
        if (!phonePattern.test(value)) {
          callback(new Error("手机号格式不正确"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      validator: (_, value, callback) => {
        if (!emailPattern.test(value)) {
          callback(new Error("邮箱格式不正确"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
};

async function handleRegister() {
  const valid = await formRef.value?.validate();

  if (!valid) {
    return;
  }

  loading.value = true;

  try {
    form.role_id = 1;
    await userStore.register(form);
    ElMessage.success("注册成功，请使用新账号登录");
    router.push({ path: "/login", query: { account: form.username } });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.register-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 460px;
  min-height: 100vh;
  background: #f4f7fb;

  &__form-wrap,
  &__intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(24px, 5vw, 56px);
  }

  &__intro {
    color: #ffffff;
    background:
      linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(37, 99, 235, 0.78)),
      url("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80")
        center / cover;
  }

  &__eyebrow {
    margin: 0 0 16px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 700;
  }

  h1 {
    max-width: 12ch;
    margin: 0;
    font-size: clamp(32px, 4vw, 52px);
    line-height: 1.1;
  }

  &__copy {
    max-width: 44ch;
    margin: 20px 0 0;
    color: rgba(255, 255, 255, 0.86);
    line-height: 1.8;
  }
}

.register-card {
  width: min(760px, 100%);
  margin: 0 auto;
  padding: 28px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);

  &__header {
    margin-bottom: 22px;

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
    margin-top: 8px;
  }
}

@media (max-width: 1080px) {
  .register-page {
    grid-template-columns: 1fr;

    &__intro {
      min-height: 320px;
      order: -1;
    }
  }
}

@media (max-width: 520px) {
  .register-card {
    padding: 20px;

    &__footer {
      align-items: stretch;
      flex-direction: column;
    }
  }
}
</style>

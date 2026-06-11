<template>
  <div class="register-page">
    <section class="register-page__panel register-page__panel--form">
      <div class="register-card">
        <div class="register-card__header">
          <p>创建账号</p>
          <h2>注册新用户</h2>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" size="large" label-position="top">
          <el-row :gutter="16">
            <el-col :xs="24" :sm="12">
              <el-form-item label="账号" prop="account">
                <el-input v-model="form.account" placeholder="请输入登录账号" />
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
              <el-form-item label="用户姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入真实姓名" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                  <el-option label="未知" value="未知" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :xs="24" :sm="12">
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="form.idCard" placeholder="请输入身份证号" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="电话号码" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入电话号码" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :xs="24" :sm="12">
              <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入密码" />
              </el-form-item>
            </el-col>
          </el-row>

          <div class="register-card__footer">
            <el-link type="primary" @click="router.push('/login')">已有账号？去登录</el-link>
            <el-button type="primary" :loading="loading" @click="handleRegister">提交注册</el-button>
          </div>
        </el-form>
      </div>
    </section>

    <section class="register-page__panel register-page__panel--intro">
      <p class="register-page__eyebrow">用户中心</p>
      <h1>完整的注册信息结构，直接对接权限体系</h1>
      <p class="register-page__copy">
        注册页已经包含用户姓名、昵称、性别、身份证号、电话号码等字段，也预留了账号和密码，方便直接接入登录和权限模块。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { RegisterForm } from '@/types/auth'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive<RegisterForm>({
  account: '',
  password: '',
  confirmPassword: '',
  name: '',
  nickname: '',
  gender: '未知',
  idCard: '',
  phone: '',
})

const idCardPattern = /^(?:\d{15}|\d{17}[\dXx])$/
const phonePattern = /^1[3-9]\d{9}$/

const rules: FormRules<RegisterForm> = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (!idCardPattern.test(value)) {
          callback(new Error('身份证号格式不正确'))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (!phonePattern.test(value)) {
          callback(new Error('电话号码格式不正确'))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
}

async function handleRegister() {
  await formRef.value?.validate(async (valid) => {
    if (!valid) {
      return
    }

    loading.value = true

    try {
      await userStore.register(form)
      ElMessage.success('注册成功，请使用新账号登录')
      router.push({ path: '/login', query: { account: form.account } })
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.register-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(250, 204, 21, 0.18), transparent 24%),
    radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.2), transparent 28%),
    linear-gradient(135deg, #0f172a 0%, #111827 46%, #0f172a 100%);
}

.register-page__panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(28px, 5vw, 64px);
}

.register-page__eyebrow {
  margin: 0 0 16px;
  color: #fde68a;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.register-page h1 {
  margin: 0;
  max-width: 14ch;
  color: #fff;
  font-size: clamp(34px, 4.5vw, 56px);
  line-height: 1.08;
}

.register-page__copy {
  max-width: 48ch;
  margin: 20px 0 0;
  color: rgba(226, 232, 240, 0.86);
  line-height: 1.8;
}

.register-card {
  width: min(720px, 100%);
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
      color: #fff;
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

:deep(.el-form-item__label) {
  color: rgba(226, 232, 240, 0.9);
}

@media (max-width: 960px) {
  .register-page {
    grid-template-columns: 1fr;

    &__panel--intro {
      padding-top: 0;
    }
  }

  .register-card__footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
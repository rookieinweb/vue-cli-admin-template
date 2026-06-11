<template>
  <div class="home-placeholder">
    <el-card class="home-placeholder__card" shadow="never">
      <p class="home-placeholder__eyebrow">Vue3 后台管理框架</p>
      <h1>欢迎使用管理后台模板</h1>
      <p>
        这里已经完成 router、Pinia、axios、Element Plus 以及登录、注册、权限管理页面的基础搭建。
      </p>
      <el-button type="primary" @click="$router.push('/login')">进入登录页</el-button>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.home-placeholder {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;

  &__card {
    width: min(720px, 100%);
    border: 0;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(18px);
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
  }

  &__eyebrow {
    margin: 0 0 12px;
    color: #0f766e;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0 0 12px;
    font-size: clamp(28px, 4vw, 42px);
    color: #0f172a;
  }

  p {
    margin: 0 0 24px;
    line-height: 1.8;
    color: #475569;
  }
}
</style>

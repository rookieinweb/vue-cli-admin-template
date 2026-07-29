<template>
  <div class="password-strength">
    <el-input
      v-model="password"
      type="password"
      show-password
      placeholder="请输入密码"
      @input="checkPassword"
    />

    <!-- 强度条 -->
    <div class="strength-bar">
      <div
        class="strength-inner"
        :style="{
          width: width,
          background: color,
        }"
      ></div>
    </div>

    <div class="strength-text">
      密码强度：
      <span :style="{ color }">
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const password = ref("");

const width = ref("0%");
const color = ref("#ddd");
const text = ref("");

function checkPassword() {
  const pwd = password.value;

  let score = 0;

  if (pwd.length >= 8) {
    score++;
  }

  if (/[A-Z]/.test(pwd)) {
    score++;
  }

  if (/[a-z]/.test(pwd)) {
    score++;
  }

  if (/\d/.test(pwd)) {
    score++;
  }

  if (/[^A-Za-z0-9]/.test(pwd)) {
    score++;
  }

  if (score <= 2) {
    width.value = "30%";
    color.value = "#f56c6c";
    text.value = "弱";
  } else if (score <= 4) {
    width.value = "60%";
    color.value = "#e6a23c";
    text.value = "中";
  } else {
    width.value = "100%";
    color.value = "#67c23a";
    text.value = "强";
  }
}
</script>

<style scoped>
.strength-bar {
  height: 10px;
  background: #ebeef5;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 15px;
}

.strength-inner {
  height: 100%;
  transition: all 0.3s;
  border-radius: 10px;
}

.strength-text {
  margin-top: 10px;
  font-size: 14px;
}
</style>

import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { loginApi, registerApi } from "@/api/auth";
import type { LoginForm, RegisterForm, UserProfile } from "@/types/auth";
import {
  readJson,
  readString,
  removeValue,
  writeJson,
  writeString,
} from "@/utils/storage";

const TOKEN_KEY = "vue-admin-token";
const USER_KEY = "vue-admin-current-user";

export const useUserStore = defineStore("user", () => {
  const token = ref(readString(TOKEN_KEY, ""));
  const userInfo = ref<UserProfile | null>(
    readJson<UserProfile | null>(USER_KEY, null),
  );

  const isLoggedIn = computed(() => Boolean(token.value));
  const displayName = computed(
    () => userInfo.value?.nickname || userInfo.value?.name || "未登录",
  );

  async function login(form: LoginForm) {
    const result = await loginApi(form);
    token.value = result.token;
    userInfo.value = result.user;
    writeString(TOKEN_KEY, result.token);
    writeJson(USER_KEY, result.user);
  }

  async function register(form: RegisterForm) {
    await registerApi(form);
  }

  function logout() {
    token.value = "";
    userInfo.value = null;
    removeValue(TOKEN_KEY);
    removeValue(USER_KEY);
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    displayName,
    login,
    register,
    logout,
  };
});

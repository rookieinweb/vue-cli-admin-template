import request from "@/utils/request";
import type { LoginForm, RegisterForm, UserProfile } from "@/types/auth";

interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginResponse {
  token: string;
  user: UserProfile;
}

function unwrap<T>(response: ApiResult<T>) {
  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function loginApi(form: LoginForm) {
  const { data } = await request.post<ApiResult<LoginResponse>>(
    "/auth/login",
    form,
  );
  return unwrap(data);
}

export async function registerApi(form: RegisterForm) {
  const { data } = await request.post<ApiResult<null>>("/auth/register", form);
  return unwrap(data);
}

/**
 * 获取用户列表
 */
export async function getUsersApi(params: { id?: number }) {
  const { data } = await request.get<unknown>("/user", { params });
  return unwrap(data);
}

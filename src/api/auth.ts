import request from "@/utils/request";
import type { LoginForm, RegisterForm, UserProfile } from "@/types/auth";

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export async function loginApi(form: LoginForm) {
  return request.post<LoginResponse>("/auth/login", form);
}

export async function registerApi(form: RegisterForm) {
  const {
    username,
    password,
    phone,
    email,
    avatar,
    nickname,
    birth_date,
    id_card,
    gender,
    other,
  } = form;
  const payload = {
    username,
    password,
    phone,
    email,
    avatar,
    nickname,
    birth_date,
    id_card,
    gender,
    other,
  };

  return request.post<null>("/user/register", payload);
}

export async function getUsersApi(params: { id?: number; role_id?: number }) {
  return request.get<UserProfile[]>("/user", params);
}

export interface LoginForm {
  account: string;
  password: string;
}

export interface RegisterForm {
  account: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  gender: "男" | "女" | "未知";
  idCard: string;
  phone: string;
}

export interface UserProfile {
  account: string;
  name: string;
  nickname: string;
  gender: "男" | "女" | "未知";
  idCard: string;
  phone: string;
  role: string;
}

export interface AuthUserRecord {
  account: string;
  password: string;
  profile: UserProfile;
}
export interface LoginForm {
  account: string;
  password: string;
}

export interface RegisterForm {
  account: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  gender: "男" | "女" | "未知";
  idCard: string;
  phone: string;
}

export interface UserProfile {
  account: string;
  name: string;
  nickname: string;
  gender: "男" | "女" | "未知";
  idCard: string;
  phone: string;
  role: string;
}

export interface AuthUserRecord {
  account: string;
  password: string;
  profile: UserProfile;
}

export interface LoginForm {
  account: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
  email: string;
  avatar: string;
  nickname: string;
  birth_date: string;
  id_card: string;
  gender: number;
  other: string;
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

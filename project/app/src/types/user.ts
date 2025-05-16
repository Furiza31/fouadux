export interface User {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLoginForm {
  email: string;
  password: string;
}

export interface UserRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

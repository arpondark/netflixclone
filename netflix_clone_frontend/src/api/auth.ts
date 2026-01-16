import axios from '../utils/axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  email: string
  fullName: string
  role: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  role?: string
  active?: boolean
}

export interface EmailRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface MessageResponse {
  message: string
}

export const authApi = {
  login: (data: LoginRequest) =>
    axios.post<LoginResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    axios.post<MessageResponse>('/auth/register', data),

  forgotPassword: (data: EmailRequest) =>
    axios.post<MessageResponse>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    axios.post<MessageResponse>('/auth/reset-password', data),

  changePassword: (data: ChangePasswordRequest) =>
    axios.post<MessageResponse>('/auth/change-password', data),
}

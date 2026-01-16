import axios from '../utils/axios'

export interface UserResponse {
  id: number
  email: string
  fullName: string
  role: string
  active: boolean
  emailVerified: boolean
  favoriteCategories: string[]
  createdAt: string
}

export interface SuspendUserRequest {
  userId: number
  active: boolean
  reason: string
}

export interface MessageResponse {
  message: string
}

export const adminApi = {
  getAllUsers: () =>
    axios.get<UserResponse[]>('/admin/users'),

  getUserById: (userId: number) =>
    axios.get<UserResponse>(`/admin/users/${userId}`),

  suspendUser: (data: SuspendUserRequest) =>
    axios.put<MessageResponse>('/admin/users/suspend', data),

  deleteUser: (userId: number) =>
    axios.delete<MessageResponse>(`/admin/users/${userId}`),

  updateUserRole: (userId: number, role: string) =>
    axios.put<MessageResponse>(`/admin/users/${userId}/role`, null, {
      params: { role },
    }),
}

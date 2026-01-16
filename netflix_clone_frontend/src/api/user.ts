
import axios from '../utils/axios'
import { type Video } from './video'

export interface User {
  id: number
  email: string
  fullName: string
  role: string
  active: boolean
  emailVerified: boolean
  favoriteCategories: string[]
  avatar?: string
  createdAt?: string 
  age?: number
}

export interface MessageResponse {
  message: string
}

export const userApi = {
  getProfile: () => axios.get<User>('/user/profile'),

  updateProfile: (data: Partial<User>) => axios.put('/user/profile', data),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteAccount: () => axios.delete('/user/account'),

  updateFavoriteCategories: (categories: string[]) =>
    axios.put<MessageResponse>('/user/favorite-categories', {
      favoriteCategories: categories,
    }),

  addToWatchlist: (videoId: number) =>
    axios.post<MessageResponse>(`/user/watchlist/${videoId}`),

  removeFromWatchlist: (videoId: number) =>
    axios.delete<MessageResponse>(`/user/watchlist/${videoId}`),

  getWatchlist: () => axios.get<Video[]>('/user/watchlist'),
}

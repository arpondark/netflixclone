import axios from '../utils/axios'
import { type Video } from './video'

export interface User {
  email: string
  fullName: string
  role: string
  emailVerified: boolean
  active: boolean
  favoriteCategories: string[]
}

export interface MessageResponse {
  message: string
}

export const userApi = {
  getProfile: () => axios.get<User>('/user/profile'),

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

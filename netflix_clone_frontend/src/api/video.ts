import axios from '../utils/axios'

export interface Video {
  id?: number
  video_id?: number
  title: string
  description: string
  categories?: string[]
  srcUuid?: string
  posterUuid?: string
  src?: string      // The full URL provided by backend
  poster?: string   // The full URL provided by backend
  duration?: number
  year?: number
  rating?: string
  published?: boolean
  createdAt?: string
  isInWatchList?: boolean
}

export interface VideoRequest {
  title: string
  description: string
  categories: string[]
  duration?: number
  year?: number
  rating?: string
  published?: boolean
}

export const videoApi = {
  getAll: () => axios.get<Video[]>('/videos'),

  // We can now just use the 'src' property from the video object if available
  // But keeping this as utility if needed, pointing to the new controller
  stream: (uuid: string) => `http://localhost:8080/api/files/video/${uuid}`,

  getPoster: (uuid: string) => `http://localhost:8080/api/files/image/${uuid}`,

  recordView: (videoId: number) =>
    axios.post(`/user/videos/${videoId}/view`),

  getViewCount: (videoId: number) =>
    axios.get<{ views: number }>(`/user/videos/${videoId}/views`),

  upload: (formData: FormData) =>
    axios.post<Video>('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  update: (id: number, formData: FormData) =>
    axios.put<Video>(`/videos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  delete: (id: number) => axios.delete<void>(`/videos/${id}`),

  rateVideo: (videoId: number, rating: number) =>
    axios.post('/ratings', { videoId, rating }),

  getRatingStats: (videoId: number) =>
    axios.get<{ average: number; count: number }>(`/ratings/video/${videoId}/stats`),

  getUserRating: (videoId: number) =>
    axios.get<number>(`/ratings/video/${videoId}/user`),
}

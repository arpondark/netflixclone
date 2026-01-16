import axios from '../utils/axios'

export interface Video {
  id: number
  title: string
  description: string
  category: string
  srcUuid: string
  posterUuid: string
  duration: number
  createdAt: string
}

export const videoApi = {
  getAll: () => axios.get<Video[]>('/videos'),

  stream: (id: number) => `http://localhost:8080/api/videos/stream/${id}`,

  getPoster: (uuid: string) => `http://localhost:8080/uploads/images/${uuid}`,

  recordView: (videoId: number) =>
    axios.post(`/user/videos/${videoId}/view`),

  getViewCount: (videoId: number) =>
    axios.get<{ views: number }>(`/user/videos/${videoId}/views`),
}

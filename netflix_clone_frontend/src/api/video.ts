import axios from '../utils/axios'

/**
 * Interface representing the Video data structure from the backend.
 */
export interface Video {
  id?: number
  video_id?: number // Alternative ID field if backend uses this naming
  title: string
  description: string
  categories?: string[] // List of category names
  srcUuid?: string // UUID for video streaming URL
  posterUuid?: string // UUID for poster image URL
  src?: string      // Full URL provided by backend (optional)
  poster?: string   // Full URL provided by backend (optional)
  duration?: number
  year?: number
  rating?: string // Content rating (e.g., PG-13)
  published?: boolean
  createdAt?: string
  isInWatchList?: boolean
}

/**
 * Interface for the payload when creating/uploading a video.
 */
export interface VideoRequest {
  title: string
  description: string
  categories: string[]
  duration?: number
  year?: number
  rating?: string
  published?: boolean
}

/**
 * Object containing Methods involved in Video API calls.
 */
export const videoApi = {
  // Fetches all available videos
  getAll: () => axios.get<Video[]>('/videos'),

  // Generates the streaming URL for a video given its UUID
  stream: (uuid: string) => `http://localhost:8080/api/files/video/${uuid}`,

  // Generates the poster image URL for a video given its UUID
  getPoster: (uuid: string) => `http://localhost:8080/api/files/image/${uuid}`,

  // Records a view for a video (tracks user history)
  recordView: (videoId: number) =>
    axios.post(`/user/videos/${videoId}/view`),

  // Fetches the total view count for a specific video
  getViewCount: (videoId: number) =>
    axios.get<{ views: number }>(`/user/videos/${videoId}/views`),

  // Uploads a new video with multipart form data (Admin only)
  upload: (formData: FormData) =>
    axios.post<Video>('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Essential for file uploads
      },
    }),

  // Updates an existing video (Admin only)
  update: (id: number, formData: FormData) =>
    axios.put<Video>(`/videos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Deletes a video by ID (Admin only)
  delete: (id: number) => axios.delete<void>(`/videos/${id}`),

  // Submits a user rating for a video
  rateVideo: (videoId: number, rating: number) =>
    axios.post('/ratings', { videoId, rating }),

  // Fetches average, total count statistics for a video's ratings
  getRatingStats: (videoId: number) =>
    axios.get<{ average: number; count: number }>(`/ratings/video/${videoId}/stats`),

  // Fetches the current user's rating for a specific video
  getUserRating: (videoId: number) =>
    axios.get<number>(`/ratings/video/${videoId}/user`),
}

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { videoApi, type Video } from '../api/video'
import { userApi } from '../api/user'
import { useAuth } from '../context/AuthContext'

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>()
  const [video, setVideo] = useState<Video | null>(null)
  const [viewCount, setViewCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchVideo()
      fetchViewCount()
      if (isAuthenticated) {
        recordView()
      }
    }
  }, [id, isAuthenticated])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const videosResponse = await videoApi.getAll()
      const foundVideo = videosResponse.data.find((v) => v.id === Number(id))
      setVideo(foundVideo || null)
    } catch (error) {
      console.error('Error fetching video:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchViewCount = async () => {
    try {
      const response = await videoApi.getViewCount(Number(id))
      setViewCount(response.data.views)
    } catch (error) {
      console.error('Error fetching view count:', error)
    }
  }

  const recordView = async () => {
    try {
      await userApi.addToWatchlist(Number(id))
    } catch (error) {
      console.error('Error recording view:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <h1 className="text-3xl font-bold mb-4">Video Not Found</h1>
        <p className="text-text-secondary mb-6">The video you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 hover:bg-red-hover text-white px-6 py-3 rounded"
        >
          Go Back Home
        </button>
      </div>
    )
  }

  const streamUrl = video.src || (video.srcUuid ? videoApi.stream(video.srcUuid) : '')
  const posterUrl = video.poster || (video.posterUuid ? videoApi.getPoster(video.posterUuid) : '')

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-text-secondary hover:text-white mb-6 inline-flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-8">
          <video
            src={streamUrl}
            poster={posterUrl}
            controls
            autoPlay
            className="w-full h-full"
            onError={(e) => {
              console.error('Video error:', e)
            }}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{video.title}</h1>
            <p className="text-lg text-text-secondary mb-6">{video.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              <span className="bg-secondary px-3 py-1 rounded">
                {video.categories && video.categories.length > 0 ? video.categories[0] : 'Movie'}
              </span>
              <span>Views: {viewCount}</span>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-6 h-fit">
            <h3 className="font-semibold mb-4">Video Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-text-secondary">Duration:</span>
                <span className="ml-2">
                  {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Added:</span>
                <span className="ml-2">
                  {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

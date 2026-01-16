import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../api/user'
import { type Video } from '../api/video'
import VideoCard from '../components/VideoCard'

export default function Watchlist() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      setLoading(true)
      const response = await userApi.getWatchlist()
      setVideos(response.data)
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoClick = (videoId: number) => {
    navigate(`/video/${videoId}`)
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">My List</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center text-text-secondary py-16">
          <h2 className="text-2xl mb-4">Your list is empty</h2>
          <p className="mb-6">Add videos to your watchlist to see them here</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-hover text-white px-6 py-3 rounded"
          >
            Browse Videos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => handleVideoClick(video.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

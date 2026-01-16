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
    navigate(`/browse/video/${videoId}`)
  }

  return (
    <div className="px-4 md:px-12 py-24 min-h-screen bg-[#141414]">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-medium text-white mb-2">My List</h1>
        {videos.length > 0 && (
            <p className="text-gray-400">Your curated list of favorites</p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#1f1f1f]/30 rounded-lg border border-white/5">
          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">Your list is empty</h2>
          <p className="text-gray-400 mb-6">Add movies and shows to your list to watch them later.</p>
          <button 
            onClick={() => navigate('/browse')}
            className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition-colors"
          >
            Browse Content
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-10">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => handleVideoClick(video.id!)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

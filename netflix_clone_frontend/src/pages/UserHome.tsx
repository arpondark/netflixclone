import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { videoApi, type Video } from '../api/video'
import { categoryApi, type Category } from '../api/category'
import VideoCard from '../components/VideoCard'

export default function UserHome() {
  const [videos, setVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [selectedCategory])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [videosResponse, categoriesResponse] = await Promise.all([
        videoApi.getAll(),
        categoryApi.getAll(),
      ])

      let filteredVideos = videosResponse.data
      if (selectedCategory) {
        filteredVideos = filteredVideos.filter(
          (v) => v.category === selectedCategory
        )
      }

      setVideos(filteredVideos)
      setCategories(categoriesResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoClick = (videoId: number) => {
    navigate(`/browse/video/${videoId}`)
  }

  return (
    <div className="px-4 md:px-12 py-24 min-h-screen bg-[#141414]">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Browse</h1>
        
        <div className="flex gap-4 flex-wrap items-center">
          <span className="text-[#808080] text-sm uppercase tracking-widest font-bold mr-2">Filter by:</span>
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all border ${
              selectedCategory === ''
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white border-white/20 hover:border-white/50'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all border ${
                selectedCategory === category.name
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/20 hover:border-white/50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center text-[#808080] py-20 bg-secondary/30 rounded-xl border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-2">No videos available</h2>
          <p>We couldn't find any videos in this category. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-10">
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

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { videoApi, type Video } from '../api/video'
import { categoryApi, type Category } from '../api/category'
import VideoCard from '../components/VideoCard'

export default function Home() {
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
    navigate(`/video/${videoId}`)
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Browse</h1>
        
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded transition-colors ${
              selectedCategory === ''
                ? 'bg-white text-black'
                : 'bg-secondary text-text-secondary hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded transition-colors ${
                selectedCategory === category.name
                  ? 'bg-white text-black'
                  : 'bg-secondary text-text-secondary hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center text-text-secondary py-16">
          <h2 className="text-2xl mb-4">No videos available</h2>
          <p>Check back later for new content</p>
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

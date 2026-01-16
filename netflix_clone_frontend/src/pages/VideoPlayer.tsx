import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { videoApi, type Video } from '../api/video'
import { userApi } from '../api/user'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'

/**
 * VideoPlayer Page Component.
 * Displays the video player, video details, and handles user interactions like viewing and rating.
 */
export default function VideoPlayer() {
  // Get video ID from URL parameters
  const { id } = useParams<{ id: string }>()
  
  // State for storing the video details
  const [video, setVideo] = useState<Video | null>(null)
  
  // State for total view count
  const [viewCount, setViewCount] = useState<number>(0)
  
  // State for the current user's rating (1-5)
  const [userRating, setUserRating] = useState<number>(0)
  
  // State for aggregate rating statistics (average and count)
  const [ratingStats, setRatingStats] = useState<{ average: number; count: number }>({ average: 0, count: 0 })
  
  // State for loading status
  const [loading, setLoading] = useState(true)
  
  // Auth context to check if user is logged in
  const { isAuthenticated } = useAuth()
  
  // Hook for programmatic navigation
  const navigate = useNavigate()

  // Effect hook to load data when component mounts or ID/Auth state changes
  useEffect(() => {
    if (id) {
      fetchVideo()      // Fetch video metadata
      fetchViewCount()  // Fetch view count
      fetchRatingStats() // Fetch rating stats
      if (isAuthenticated) {
        recordView()      // Record a new view if user is logged in
        fetchUserRating() // Fetch user's personal rating if logged in
      }
    }
  }, [id, isAuthenticated])

  // Fetches video details from the API
  const fetchVideo = async () => {
    try {
      setLoading(true) // Start loading
      // Currently fetches all videos and filters by ID (Optimization: Should ideally fetch by ID directly)
      const videosResponse = await videoApi.getAll()
      const foundVideo = videosResponse.data.find((v) => v.id === Number(id))
      setVideo(foundVideo || null)
    } catch (error) {
      console.error('Error fetching video:', error)
    } finally {
      setLoading(false) // Stop loading
    }
  }

  // Fetches total view count for the video
  const fetchViewCount = async () => {
    try {
      const response = await videoApi.getViewCount(Number(id))
      setViewCount(response.data.views)
    } catch (error) {
      console.error('Error fetching view count:', error)
    }
  }

  // Helper to record that the user is viewing this video
  const recordView = async () => {
    try {
      await userApi.addToWatchlist(Number(id)) // Note: The method name addToWatchlist might be reused logic or misnamed, checking context implies view recording logic in API
    } catch (error) {
      console.error('Error recording view:', error)
    }
  }

  // Fetches statistics (average rating, total ratings)
  const fetchRatingStats = async () => {
    try {
      const response = await videoApi.getRatingStats(Number(id))
      setRatingStats(response.data)
    } catch (error) {
      console.error('Error fetching rating stats:', error)
    }
  }

  // Fetches the specific rating given by the logged-in user
  const fetchUserRating = async () => {
    try {
      const response = await videoApi.getUserRating(Number(id))
      setUserRating(response.data)
    } catch (error) {
      console.error('Error fetching user rating:', error)
    }
  }

  // Handler for when a user clicks a star to rate the video
  const handleRate = async (rating: number) => {
    if (!isAuthenticated) {
      alert('Please login to rate videos') // Prompt login if guest
      return
    }
    try {
      // Call API to submit rating
      await videoApi.rateVideo(Number(id), rating)
      // Update local state to reflect new rating
      setUserRating(rating)
      // Refresh stats to show updated average
      fetchRatingStats() 
    } catch (error) {
      console.error('Error rating video:', error)
    }
  }

  // Render Loading Spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  // Render "Not Found" state
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

  // Determine stream and poster URLs
  const streamUrl = video.src || (video.srcUuid ? videoApi.stream(video.srcUuid) : '')
  const posterUrl = video.poster || (video.posterUuid ? videoApi.getPoster(video.posterUuid) : '')

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
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

        {/* Video Player Container */}
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

        {/* Video Details Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content: Title, Description, Categories */}
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

          {/* Sidebar: Metadata and Rating */}
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
              
              {/* Rating Section UI */}
              <div className="pt-4 border-t border-gray-700">
                <span className="text-text-secondary block mb-2">Rating:</span>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating 
                    rating={userRating} 
                    onRate={handleRate} 
                    readonly={!isAuthenticated} 
                  />
                  <span className="text-xs text-text-secondary">
                    {isAuthenticated ? '(Click to rate)' : '(Login to rate)'}
                  </span>
                </div>
                <div className="text-xs text-text-secondary">
                  Average: {ratingStats.average.toFixed(1)} ({ratingStats.count} ratings)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

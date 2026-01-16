import { useState } from 'react'
import { type Video } from '../api/video'
import { videoApi } from '../api/video'
import { userApi } from '../api/user'

interface VideoCardProps {
  video: Video
  onClick: () => void
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const posterUrl = video.poster || videoApi.getPoster(video.posterUuid || '')
  const [isInWatchlist, setIsInWatchlist] = useState(video.isInWatchList || false)

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (isInWatchlist) {
        await userApi.removeFromWatchlist(video.id!)
      } else {
        await userApi.addToWatchlist(video.id!)
      }
      setIsInWatchlist(!isInWatchlist)
    } catch (error) {
      console.error('Error toggling watchlist:', error)
    }
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transition-transform duration-300 hover:scale-105 relative"
    >
      <div className="relative rounded overflow-hidden bg-secondary aspect-[2/3]">
        <img
          src={posterUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png'
          }}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleWatchlistToggle}
            className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 border-2 border-white/50 hover:border-white transition-all transform hover:scale-110"
            title={isInWatchlist ? "Remove from My List" : "Add to My List"}
          >
            {isInWatchlist ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between mb-1">
             <div className="flex gap-2 text-xs font-semibold text-green-400">
                <span>98% Match</span>
             </div>
             <div className="text-xs text-white/80 border border-white/40 px-1 rounded">HD</div>
          </div>
          <h3 className="text-white font-bold text-sm line-clamp-1 mb-1 shadow-black drop-shadow-md">
            {video.title}
          </h3>
          <div className="flex flex-wrap gap-2 text-[10px] text-gray-300">
             {video.categories?.slice(0, 3).map((cat, idx) => (
               <span key={idx} className="relative before:content-['•'] before:mr-1 before:text-gray-500 first:before:hidden">{cat}</span>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}

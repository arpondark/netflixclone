import { type Video } from '../api/video'
import { videoApi } from '../api/video'

interface VideoCardProps {
  video: Video
  onClick: () => void
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const posterUrl = videoApi.getPoster(video.posterUuid)

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <div className="relative rounded overflow-hidden bg-secondary">
        <img
          src={posterUrl}
          alt={video.title}
          className="w-full aspect-[2/3] object-cover group-hover:opacity-80 transition-opacity"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-semibold text-sm line-clamp-2">
              {video.title}
            </h3>
            <p className="text-text-secondary text-xs mt-1 line-clamp-2">
              {video.description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-white font-medium text-sm line-clamp-1">
          {video.title}
        </h3>
        <p className="text-text-secondary text-xs mt-1">{video.category}</p>
      </div>
    </div>
  )
}

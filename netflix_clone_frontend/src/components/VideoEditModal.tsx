import { useState, useEffect } from 'react'
import { videoApi, type Video } from '../api/video'

interface VideoEditModalProps {
  isOpen: boolean
  onClose: () => void
  video: Video | null
  onSuccess: () => void
}

export default function VideoEditModal({ isOpen, onClose, video, onSuccess }: VideoEditModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [poster, setPoster] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (video) {
      setTitle(video.title)
      setDescription(video.description)
      setPoster(null)
      setError('')
    }
  }, [video, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!video?.video_id) return

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('data', new Blob([JSON.stringify({
        title,
        description
      })], { type: 'application/json' }))
      
      if (poster) {
        formData.append('poster', poster)
      }

      await videoApi.update(video.video_id, formData)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error updating video:', err)
      setError('Failed to update video')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !video) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#181818] rounded-lg max-w-lg w-full p-6 text-white relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Video</h2>

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2 text-white h-32 focus:outline-none focus:border-white resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">New Poster (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPoster(e.target.files?.[0] || null)}
              className="w-full bg-[#333] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

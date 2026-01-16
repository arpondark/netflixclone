import { useState, type FormEvent } from 'react'
import { videoApi, type VideoRequest } from '../api/video'
import { categoryApi, type Category } from '../api/category'
import { useEffect } from 'react'

interface VideoUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function VideoUploadModal({ isOpen, onClose, onSuccess }: VideoUploadModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<VideoRequest>({
    title: '',
    description: '',
    categories: [],
    duration: undefined,
    year: new Date().getFullYear(),
    rating: 'PG',
    published: false,
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll()
      setCategories(response.data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || undefined : value,
    }))
  }


  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0])
    }
  }

  const handlePosterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPosterFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }
    if (formData.description.length > 4000) {
      setError('Description cannot be more than 4000 characters')
      return
    }
    if (formData.categories.length === 0) {
      setError('At least one category must be selected')
      return
    }
    if (!videoFile) {
      setError('Video file is required')
      return
    }
    if (!posterFile) {
      setError('Poster image is required')
      return
    }

    try {
      setLoading(true)

      // Create FormData
      const form = new FormData()
      form.append(
        'data',
        new Blob([JSON.stringify(formData)], { type: 'application/json' }),
        'data.json'
      )
      form.append('video', videoFile)
      form.append('poster', posterFile)

      await videoApi.upload(form)
      setSuccess('Video uploaded successfully!')

      // Reset form
      setFormData({
        title: '',
        description: '',
        categories: [],
        duration: undefined,
        year: new Date().getFullYear(),
        rating: 'PG',
        published: false,
      })
      setVideoFile(null)
      setPosterFile(null)

      // Close modal after success
      setTimeout(() => {
        onClose()
        onSuccess()
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload video. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Upload Video</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-text-secondary hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-600 text-white p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter video title"
              required
              className="w-full px-4 py-2 bg-tertiary text-white rounded focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description * ({formData.description.length}/4000)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter video description"
              required
              rows={4}
              className="w-full px-4 py-2 bg-tertiary text-white rounded focus:ring-2 focus:ring-red-600 outline-none resize-none"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">Categories *</label>
            <div className="relative">
              <select
                multiple
                value={formData.categories}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({ ...prev, categories: selectedOptions }));
                }}
                className="w-full px-4 py-2 bg-neutral-800 text-white rounded focus:ring-2 focus:ring-red-600 outline-none h-32"
              >
                 {categories.map((category) => (
                    <option key={category.id} value={category.name} className="py-1 px-2 hover:bg-neutral-700">
                      {category.name}
                    </option>
                 ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Hold Ctrl (Cmd) to select multiple</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Year */}
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year || ''}
                onChange={handleInputChange}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 bg-neutral-800 text-white rounded focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-neutral-800 text-white rounded focus:ring-2 focus:ring-red-600 outline-none"
              >
                <option value="G" className="bg-neutral-800 text-white">G</option>
                <option value="PG" className="bg-neutral-800 text-white">PG</option>
                <option value="PG-13" className="bg-neutral-800 text-white">PG-13</option>
                <option value="R" className="bg-neutral-800 text-white">R</option>
                <option value="NC-17" className="bg-neutral-800 text-white">NC-17</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration || ''}
              onChange={handleInputChange}
              placeholder="120"
              min="1"
              className="w-full px-4 py-2 bg-tertiary text-white rounded focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          {/* Video File */}
          <div>
            <label className="block text-sm font-medium mb-2">Video File *</label>
            <div className="border-2 border-dashed border-tertiary rounded p-4 text-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                required
                className="w-full"
              />
              {videoFile && (
                <p className="text-sm text-green-400 mt-2">
                  ✓ Selected: {videoFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Poster File */}
          <div>
            <label className="block text-sm font-medium mb-2">Poster Image *</label>
            <div className="border-2 border-dashed border-tertiary rounded p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterFileChange}
                required
                className="w-full"
              />
              {posterFile && (
                <p className="text-sm text-green-400 mt-2">
                  ✓ Selected: {posterFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Published Checkbox */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Publish immediately</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 rounded transition-colors font-medium"
            >
              {loading ? 'Uploading...' : 'Upload Video'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-tertiary hover:bg-white hover:text-black disabled:opacity-50 text-white py-2 rounded transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { adminApi, type UserResponse } from '../api/admin'
import { videoApi, type Video } from '../api/video'
import VideoUploadModal from '../components/VideoUploadModal'
import VideoEditModal from '../components/VideoEditModal'

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'videos'>('users')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else {
      fetchVideos()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAllUsers()
      if (Array.isArray(response.data)) {
        setUsers(response.data)
      } else {
        console.warn('Expected array of users but got:', response.data)
        setUsers([])
      }
      setError('')
    } catch (err: any) {
      setError('Failed to fetch users')
      console.error('Error fetching users:', err)
      if (err.response) {
        console.error('Error response:', err.response.status, err.response.data)
      } else if (err.request) {
        console.error('Error request:', err.request)
      } else {
        console.error('Error message:', err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await videoApi.getAll()
      setVideos(response.data)
      setError('')
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Failed to fetch videos')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await adminApi.suspendUser({
        userId,
        active: !currentStatus,
        reason: currentStatus ? 'Suspended by admin' : 'Activated by admin',
      })
      fetchUsers()
    } catch (err) {
      console.error('Error updating user status:', err)
      alert('Failed to update user status')
    }
  }

  const handleDeleteUser = async (userId: number, userEmail: string) => {
    if (userEmail === 'admin@netflixclone.com') {
      alert('Cannot delete the main admin account')
      return
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(userId)
        fetchUsers()
      } catch (err) {
        console.error('Error deleting user:', err)
        alert('Failed to delete user')
      }
    }
  }

  const handleUpdateRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
    if (window.confirm(`Change user role from ${currentRole} to ${newRole}?`)) {
      try {
        await adminApi.updateUserRole(userId, newRole)
        fetchUsers()
      } catch (err) {
        console.error('Error updating user role:', err)
        alert('Failed to update user role')
      }
    }
  }

  const handleDeleteVideo = async (video: Video) => {
    if (window.confirm(`Are you sure you want to delete "${video.title}"?`)) {
      try {
        await videoApi.delete(video.video_id!)
        fetchVideos()
      } catch (err) {
        console.error('Error deleting video:', err)
        alert('Failed to delete video')
      }
    }
  }

  const handleUploadSuccess = () => {
    fetchVideos()
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-text-secondary">Manage users and videos</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-red-600 text-white'
              : 'border-transparent text-text-secondary hover:text-white'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'videos'
              ? 'border-red-600 text-white'
              : 'border-transparent text-text-secondary hover:text-white'
          }`}
        >
          Video Management
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-secondary p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">{users.length}</h3>
              <p className="text-text-secondary">Total Users</p>
            </div>
            <div className="bg-secondary p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">
                {users.filter((u) => u.active).length}
              </h3>
              <p className="text-text-secondary">Active Users</p>
            </div>
            <div className="bg-secondary p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">
                {users.filter((u) => u.role === 'ADMIN').length}
              </h3>
              <p className="text-text-secondary">Admins</p>
            </div>
          </div>

          <div className="bg-secondary rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">User Management</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : users.length === 0 ? (
              <div className="p-6 text-center text-text-secondary">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/30">
                    <tr>
                      <th className="text-left p-4">ID</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Full Name</th>
                      <th className="text-left p-4">Role</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Verified</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-black/20">
                        <td className="p-4">{user.id}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{user.fullName}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === 'ADMIN'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                            }`}
                          >
                            {user.active ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.emailVerified ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                            }`}
                          >
                            {user.emailVerified ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleUserStatus(user.id, user.active)}
                              className={`px-3 py-1 rounded text-xs font-medium ${
                                user.active
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                              }`}
                              disabled={user.email === 'admin@netflixclone.com'}
                            >
                              {user.active ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleUpdateRole(user.id, user.role)}
                              className="px-3 py-1 rounded text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
                              disabled={user.email === 'admin@netflixclone.com'}
                            >
                              Change Role
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              className="px-3 py-1 rounded text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white"
                              disabled={user.email === 'admin@netflixclone.com'}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="bg-secondary rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold">Video Management</h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors font-medium"
            >
              + Upload Video
            </button>
          </div>

          {loading && videos.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/30">
                  <tr>
                    <th className="text-left p-4">Poster</th>
                    <th className="text-left p-4">Title</th>
                    <th className="text-left p-4">Description</th>
                    <th className="text-left p-4">Year</th>
                    <th className="text-left p-4">Rating</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video.video_id} className="border-b border-border hover:bg-black/20">
                      <td className="p-4">
                        <img 
                          src={video.poster || videoApi.getPoster(video.posterUuid!)} 
                          alt={video.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 font-medium">{video.title}</td>
                      <td className="p-4 max-w-xs truncate text-text-secondary">{video.description}</td>
                      <td className="p-4">{video.year}</td>
                      <td className="p-4">{video.rating}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingVideo(video)}
                            className="px-3 py-1 rounded text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video)}
                            className="px-3 py-1 rounded text-xs font-medium bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {videos.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-text-secondary">
                        No videos found. Upload one to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Edit Modal */}
      <VideoEditModal
        isOpen={!!editingVideo}
        video={editingVideo}
        onClose={() => setEditingVideo(null)}
        onSuccess={() => {
          fetchVideos()
        }}
      />
    </div>
  )
}


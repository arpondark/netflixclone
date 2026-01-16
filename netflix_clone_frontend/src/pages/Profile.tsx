import { useState, useEffect, type FormEvent } from 'react'

import { userApi, type User } from '../api/user'
import { categoryApi, type Category } from '../api/category'
import { authApi } from '../api/auth'

export default function Profile() {

  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingCategories, setUpdatingCategories] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    fetchProfile()
    fetchCategories()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await userApi.getProfile()
      setUserProfile(response.data)
      setSelectedCategories(response.data.favoriteCategories || [])
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll()
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((c) => c !== categoryName)
      } else if (prev.length < 3) {
        return [...prev, categoryName]
      }
      return prev
    })
  }

  const handleUpdateCategories = async () => {
    try {
      setUpdatingCategories(true)
      await userApi.updateFavoriteCategories(selectedCategories)
      await fetchProfile()
    } catch (error) {
      console.error('Error updating categories:', error)
    } finally {
      setUpdatingCategories(false)
    }
  }

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      })
      setPasswordSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => setShowPasswordModal(false), 2000)
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>

      {userProfile && (
        <div className="space-y-8">
          <div className="bg-secondary rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-text-secondary">Name:</span>
                <span className="ml-2 font-medium">{userProfile.fullName}</span>
              </div>
              <div>
                <span className="text-text-secondary">Email:</span>
                <span className="ml-2 font-medium">{userProfile.email}</span>
              </div>
              <div>
                <span className="text-text-secondary">Role:</span>
                <span className="ml-2 font-medium capitalize">{userProfile.role.toLowerCase()}</span>
              </div>
              <div>
                <span className="text-text-secondary">Email Verified:</span>
                <span className="ml-2 font-medium">
                  {userProfile.emailVerified ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Account Status:</span>
                <span className={`ml-2 font-medium ${userProfile.active ? 'text-success' : 'text-error'}`}>
                  {userProfile.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Favorite Categories</h2>
            <p className="text-text-secondary mb-4">Select up to 3 categories</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.name)}
                  disabled={!selectedCategories.includes(category.name) && selectedCategories.length >= 3}
                  className={`px-4 py-3 rounded transition-colors ${
                    selectedCategories.includes(category.name)
                      ? 'bg-red-600 text-white'
                      : 'bg-tertiary text-text-secondary hover:text-white disabled:opacity-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleUpdateCategories}
              disabled={updatingCategories}
              className="bg-red-600 hover:bg-red-hover text-white px-6 py-2 rounded transition-colors disabled:opacity-50"
            >
              {updatingCategories ? 'Updating...' : 'Update Categories'}
            </button>
          </div>

          <div className="bg-secondary rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Security</h2>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-tertiary hover:bg-white hover:text-black text-white px-6 py-2 rounded transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
            
            {passwordError && (
              <div className="bg-error text-white p-3 rounded mb-4 text-center">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-success text-white p-3 rounded mb-4 text-center">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  required
                  className="w-full px-4 py-3 bg-tertiary text-white rounded focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (min 6 characters)"
                  required
                  className="w-full px-4 py-3 bg-tertiary text-white rounded focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-hover text-white py-3 rounded transition-colors"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordError('')
                    setPasswordSuccess('')
                    setCurrentPassword('')
                    setNewPassword('')
                  }}
                  className="flex-1 bg-tertiary hover:bg-white hover:text-black text-white py-3 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

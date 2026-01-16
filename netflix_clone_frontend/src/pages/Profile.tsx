import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi, type User } from '../api/user'
import { categoryApi, type Category } from '../api/category'
import { authApi } from '../api/auth'

export default function Profile() {
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'security'>('account')
  const [updatingCategories, setUpdatingCategories] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [formData, setFormData] = useState<{
    fullName: string
    email: string
    age: string | number
  }>({
    fullName: '',
    email: '',
    age: '',
  })
  const [message, setMessage] = useState('')

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
      setFormData({
        fullName: response.data.fullName,
        email: response.data.email,
        age: response.data.age ?? '',
      })
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
      setMessage('Favorite categories updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating categories:', error)
      setMessage('Failed to update categories')
    } finally {
      setUpdatingCategories(false)
    }
  }

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setMessage('')
      const updateData: any = { ...formData }
      if (updateData.age !== '') {
         updateData.age = Number(updateData.age)
      } else {
         delete updateData.age
      }

      await userApi.updateProfile(updateData)
      setMessage('Profile updated successfully!')
      setEditMode(false)
      await fetchProfile()
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update profile')
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

  const handleDeleteAccount = async (e: FormEvent) => {
    e.preventDefault()
    setDeleteError('')

    if (deleteConfirm.toLowerCase() !== 'delete') {
      setDeleteError('Please type "delete" to confirm')
      return
    }

    try {
      await userApi.deleteAccount()
      await authApi.logout()
      navigate('/login')
    } catch (error: any) {
      setDeleteError(error.response?.data?.message || 'Failed to delete account')
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage('Image size must be less than 5MB')
      return
    }

    try {
      await userApi.uploadAvatar(file)
      // Refresh profile to show new avatar
      userApi.getProfile().then(response => {
        setUserProfile(response.data)
      })
      setMessage('Avatar uploaded successfully')
    } catch (err: any) {
      console.error('Failed to upload avatar', err)
      setMessage(err.response?.data?.message || 'Failed to upload avatar')
    }
  }

  // Generate avatar initials and background color
  const getAvatarInfo = (name: string) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
    
    // Simple hash for color
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash % 360)
    const color = `hsla(${hue}, 70%, 50%, 0.8)`
    
    return { initials, color }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const { initials, color: avatarColor } = userProfile ? getAvatarInfo(userProfile.fullName) : { initials: '', color: '' }

  return (
    <div className="min-h-screen bg-black pt-20 pb-20">
      <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
        {/* Header with Avatar */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-gray-800 pb-8">
          <div className="relative group">
            <div 
              className="w-24 h-24 rounded-lg flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden relative cursor-pointer"
              style={{ backgroundColor: !userProfile?.avatar ? avatarColor : undefined }}
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              {userProfile?.avatar ? (
                <img 
                  src={`http://localhost:8080/api/files/image/${userProfile.avatar}`} 
                  alt={userProfile.fullName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2001/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <input 
              type="file" 
              id="avatar-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{userProfile?.fullName}</h1>
            <p className="text-text-secondary text-lg">{userProfile?.email}</p>
            <div className="flex gap-2 justify-center md:justify-start mt-3">
               <span className={`px-3 py-1 rounded text-xs font-bold tracking-wider ${userProfile?.role === 'ADMIN' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/50' : 'bg-red-600/20 text-red-400 border border-red-600/50'}`}>
                 {userProfile?.role}
               </span>
               <span className="px-3 py-1 rounded text-xs font-bold tracking-wider bg-gray-800 text-gray-400 border border-gray-700">
                 MEMBER
               </span>
            </div>
          </div>
          <div className="md:ml-auto">
            <button
               onClick={() => setEditMode(!editMode)}
               className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded font-bold transition-colors"
             >
               {editMode ? 'Cancel Edit' : 'Edit Profile'}
             </button>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${message.includes('successfully') ? 'bg-green-600/10 text-green-400 border-green-600/20' : 'bg-red-600/10 text-red-400 border-red-600/20'}`}>
             <span className="text-xl">{message.includes('successfully') ? '✓' : '⚠'}</span>
            {message}
          </div>
        )}

        {userProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 sticky top-24">
                <nav className="flex lg:flex-col">
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`flex-1 lg:flex-none px-6 py-4 text-left transition-all border-b lg:border-b-0 lg:border-l-4 ${
                      activeTab === 'account'
                        ? 'bg-white/10 text-white border-red-600'
                        : 'text-text-secondary hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-medium">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Account Details
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`flex-1 lg:flex-none px-6 py-4 text-left transition-all border-b lg:border-b-0 lg:border-l-4 ${
                      activeTab === 'preferences'
                        ? 'bg-white/10 text-white border-red-600'
                        : 'text-text-secondary hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-medium">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L18 21l-6-3-6 3 2.714-5.786L3 12l5.714-3.214L12 3z" />
                      </svg>
                      My Interests
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex-1 lg:flex-none px-6 py-4 text-left transition-all lg:border-l-4 ${
                      activeTab === 'security'
                        ? 'bg-white/10 text-white border-red-600'
                        : 'text-text-secondary hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-medium">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Security
                    </div>
                  </button>
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="text-red-600">|</span> 
                    Personal Information
                  </h2>
                  
                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-4 py-3 bg-black/50 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-red-600 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-black/50 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-red-600 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-2">Age</label>
                          <input
                            type="number"
                            min="13"
                            max="120"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            className="w-full px-4 py-3 bg-black/50 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-red-600 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-8 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
                       <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1 font-semibold">Full Name</p>
                        <p className="text-xl font-medium">{userProfile.fullName}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1 font-semibold">Email Address</p>
                        <p className="text-xl font-medium">{userProfile.email}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1 font-semibold">Age</p>
                        <p className="text-xl font-medium text-white/90">{userProfile.age || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1 font-semibold">Role</p>
                        <p className="text-lg text-white/90">{userProfile.role}</p>
                      </div>
                       <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1 font-semibold">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                           <div className={`w-2 h-2 rounded-full ${userProfile.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                           <span className="text-lg text-white/90">{userProfile.active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>

                   <div className="flex justify-start">
                     <button
                        onClick={() => setShowPasswordModal(true)}
                        className="text-text-secondary hover:text-white flex items-center gap-2 transition-colors text-sm"
                      >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                         </svg>
                         Change Password
                      </button>
                   </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                     <span className="text-red-600">|</span>
                     Favorite Categories
                  </h2>
                  <p className="text-text-secondary mb-8">Select up to 3 categories to personalize your feed.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.name)}
                        disabled={!selectedCategories.includes(category.name) && selectedCategories.length >= 3}
                        className={`px-4 py-3 rounded-lg transition-all font-medium text-sm border ${
                          selectedCategories.includes(category.name)
                            ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20'
                            : 'bg-black/40 border-white/10 text-text-secondary hover:border-white/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <p className="text-text-secondary text-sm">
                      Selected: <span className="text-white font-bold">{selectedCategories.length}/3</span>
                    </p>
                    <button
                      onClick={handleUpdateCategories}
                      disabled={updatingCategories}
                      className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 px-8 py-2.5 rounded font-bold transition-colors"
                    >
                      {updatingCategories ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Change Password Section */}
                  <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                       <span className="text-red-600">|</span>
                       Password & Security
                    </h2>
                    <div className="flex items-center justify-between">
                       <div>
                          <h3 className="text-lg font-medium mb-1">Login Password</h3>
                          <p className="text-text-secondary text-sm">Regularly updating your password improves security.</p>
                       </div>
                       <button
                        onClick={() => setShowPasswordModal(true)}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded font-medium transition-colors border border-white/10"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-8">
                    <h2 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                       </svg>
                       Danger Zone
                    </h2>
                    <p className="text-text-secondary mb-6 text-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="border border-red-900/50 text-red-500 hover:bg-red-950/30 px-6 py-2 rounded font-medium transition-colors text-sm"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-8 w-full max-w-md shadow-2xl relative">
             <button 
               onClick={() => setShowPasswordModal(false)}
               className="absolute top-4 right-4 text-gray-500 hover:text-white"
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>

            {passwordError && (
              <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-3 rounded mb-4 text-sm">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-900/20 border border-green-900/50 text-green-400 p-3 rounded mb-4 text-sm">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] border border-red-900/30 rounded-xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
               onClick={() => setShowDeleteModal(false)}
               className="absolute top-4 right-4 text-gray-500 hover:text-white"
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
            <h2 className="text-2xl font-bold mb-2 text-red-500">Delete Account</h2>
            <p className="text-text-secondary mb-6 text-sm">This action cannot be undone. To confirm, please type <span className="font-mono bg-white/10 px-1 rounded text-white">delete</span> below.</p>

            {deleteError && (
              <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-3 rounded mb-4 text-sm">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="Type 'delete'"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={deleteConfirm.toLowerCase() !== 'delete'}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white py-3 rounded font-bold transition-colors"
                >
                  Confirm Deletion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

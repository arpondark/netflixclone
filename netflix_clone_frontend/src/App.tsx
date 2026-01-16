import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import HomePage from './components/HomePage'
import UserHome from './pages/UserHome'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import VideoPlayer from './pages/VideoPlayer'
import Watchlist from './pages/Watchlist'
import Profile from './pages/Profile'
import LandingPage from './pages/LandingPage'

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

function PublicRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/browse" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/browse" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<HomePage />} />
              <Route path="user-home" element={<UserHome />} />
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="video/:id" element={<VideoPlayer />} />
              <Route path="watchlist" element={<Watchlist />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Redirect root to browse if authenticated handled inside individual route or via Navigate */}
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

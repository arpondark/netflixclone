import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname)
  const isLandingPage = location.pathname === '/'
  
  if (isLandingPage && !isAuthenticated) return null

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between ${
      isScrolled || isAuthPage ? 'bg-black shadow-xl' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="flex items-center gap-4 md:gap-10">
        <Link to="/browse" className="text-3xl md:text-4xl font-black text-red-600 tracking-tighter hover:scale-105 transition-transform">
          NETFLIX
        </Link>
        
        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/browse" className={`text-sm tracking-wide transition-colors ${location.pathname === '/browse' ? 'text-white font-bold' : 'text-[#e5e5e5] hover:text-[#b3b3b3]'}`}>Home</Link>
            {!isAdmin() && <Link to="/browse/watchlist" className={`text-sm tracking-wide transition-colors ${location.pathname === '/browse/watchlist' ? 'text-white font-bold' : 'text-[#e5e5e5] hover:text-[#b3b3b3]'}`}>My List</Link>}
            {isAdmin() && <Link to="/browse/admin-dashboard" className={`text-sm tracking-wide transition-colors ${location.pathname === '/browse/admin-dashboard' ? 'text-white font-bold' : 'text-[#e5e5e5] hover:text-[#b3b3b3]'}`}>Admin</Link>}
            <Link to="/browse/profile" className={`text-sm tracking-wide transition-colors ${location.pathname === '/browse/profile' ? 'text-white font-bold' : 'text-[#e5e5e5] hover:text-[#b3b3b3]'}`}>Account</Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <div className="relative group">
            <button className="flex items-center gap-2 cursor-pointer focus:outline-none">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded overflow-hidden">
                <img src="/placeholder.png" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <svg className={`w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-180`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
            <div className="absolute top-full right-0 mt-3 w-48 bg-black/95 border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl rounded-sm">
               <div className="py-2">
                 <Link to="/browse/profile" className="block px-4 py-2 text-sm text-white hover:underline">Account</Link>
                 <Link to="/browse/watchlist" className="block px-4 py-2 text-sm text-white hover:underline">My List</Link>
                 <div className="h-[1px] bg-white/10 my-2"></div>
                 <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-white hover:underline font-bold">Sign out of Netflix</button>
               </div>
            </div>
          </div>
        ) : (
          !isAuthPage && (
            <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 md:px-5 md:py-2 rounded font-bold transition-all active:scale-95 text-sm md:text-base">
              Sign In
            </Link>
          )
        )}
      </div>
    </nav>
  )
}

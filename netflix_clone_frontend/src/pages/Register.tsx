import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      await register({
        fullName,
        email,
        password,
        role: 'USER',
        active: true,
      })
      navigate('/login?registered=true')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-x-0 inset-y-0 bg-cover bg-center z-0 opacity-50 md:opacity-100"
        style={{ backgroundImage: 'url("/netflix-bg.png")' }}
      />
      <div className="absolute inset-x-0 inset-y-0 z-10 netflix-bg-overlay bg-black/40 md:bg-black/40" />

      {/* Header / Logo */}
      <header className="relative z-20 flex justify-between items-center px-4 md:px-12 py-6 max-w-7xl mx-auto w-full">
        <Link to="/" className="w-24 md:w-40 text-red-600">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">NETFLIX</h1>
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="relative z-20 flex flex-col items-center justify-center pt-8 pb-32 px-4 shrink-0">
        <div className="w-full max-w-[450px] bg-black/75 p-8 md:p-16 rounded shadow-2xl">
          <h2 className="text-3xl font-bold mb-7">Sign Up</h2>
          
          {error && (
            <div className="bg-[#e87c03] text-white p-3 rounded text-[14px] mb-4 flex items-start gap-2">
               <span className="mt-1 shrink-0">
                <svg width="16" height="16" fill="white" viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12zM8 4a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 4zm0 7a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1z"/></svg>
              </span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name Field */}
            <div className="relative h-14 w-full">
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder=" "
                className="peer h-full w-full rounded bg-[#333] px-5 pt-5 text-base text-white outline-none transition-all focus:bg-[#454545]"
                required
              />
              <label 
                htmlFor="fullName"
                className="pointer-events-none absolute left-5 top-4 text-[#8c8c8c] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[7px] peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-[7px] peer-[:not(:placeholder-shown)]:text-[11px]"
              >
                Full Name
              </label>
            </div>

            {/* Email Field */}
            <div className="relative h-14 w-full">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer h-full w-full rounded bg-[#333] px-5 pt-5 text-base text-white outline-none transition-all focus:bg-[#454545]"
                required
              />
              <label 
                htmlFor="email"
                className="pointer-events-none absolute left-5 top-4 text-[#8c8c8c] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[7px] peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-[7px] peer-[:not(:placeholder-shown)]:text-[11px]"
              >
                Email address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative h-14 w-full">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer h-full w-full rounded bg-[#333] px-5 pt-5 pr-16 text-base text-white outline-none transition-all focus:bg-[#454545]"
                required
              />
              <label 
                htmlFor="password"
                className="pointer-events-none absolute left-5 top-4 text-[#8c8c8c] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[7px] peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-[7px] peer-[:not(:placeholder-shown)]:text-[11px]"
              >
                Password
              </label>
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#b3b3b3] hover:text-white transition-colors"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative h-14 w-full">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                className="peer h-full w-full rounded bg-[#333] px-5 pt-5 pr-16 text-base text-white outline-none transition-all focus:bg-[#454545]"
                required
              />
              <label 
                htmlFor="confirmPassword"
                className="pointer-events-none absolute left-5 top-4 text-[#8c8c8c] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[7px] peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-[7px] peer-[:not(:placeholder-shown)]:text-[11px]"
              >
                Confirm password
              </label>
              {confirmPassword && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#b3b3b3] hover:text-white transition-colors"
                >
                  {showConfirmPassword ? 'HIDE' : 'SHOW'}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex h-12 w-full items-center justify-center rounded bg-red-600 text-base font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-12 text-[#8c8c8c]">
             Already have an account? <Link to="/login" className="font-bold text-white hover:underline">Sign in now.</Link>
          </div>
        </div>
      </main>

      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-12 py-10 border-t border-white/10 mt-auto">
        <p className="text-[#8c8c8c] text-sm">Questions? Contact us.</p>
      </footer>
    </div>
  )
}

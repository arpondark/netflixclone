import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setToast(null)
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate('/browse')
    } catch (err: any) {
      setToast({ 
        message: err.response?.data?.message || 'Login failed. Please try again.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
      <main className="relative z-20 flex flex-col items-center justify-center pt-8 pb-32 px-4">
        <div className="w-full max-w-[450px] bg-black/75 md:bg-black/75 p-8 md:p-16 rounded shadow-2xl">
          <h2 className="text-3xl font-bold mb-7">Sign In</h2>
          


          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field with Manual Floating Label */}
            <div className="relative h-14 w-full">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer h-full w-full rounded bg-[#333] px-5 pt-5 text-base text-white outline-none transition-all placeholder:mt-0 focus:bg-[#454545]"
                required
              />
              <label 
                htmlFor="email"
                className="pointer-events-none absolute left-5 top-4 text-[#8c8c8c] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[7px] peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-[7px] peer-[:not(:placeholder-shown)]:text-[11px]"
              >
                Email or phone number
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

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex h-12 w-full items-center justify-center rounded bg-red-600 text-base font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs text-[#b3b3b3]">
            <div className="flex items-center gap-1">
              <input type="checkbox" id="remember" className="h-4 w-4 bg-[#333] border-none" defaultChecked />
              <label htmlFor="remember" className="cursor-pointer">Remember me</label>
            </div>
            <Link to="/forgot-password" title="Need help?" className="hover:underline">Need help?</Link>
          </div>

          <div className="mt-16 space-y-4">
            <p className="text-[#8c8c8c]">
              New to Netflix? <Link to="/register" className="font-bold text-white hover:underline">Sign up now.</Link>
            </p>
            <p className="text-[13px] leading-tight text-[#8c8c8c]">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
              <button className="text-[#0071eb] hover:underline">Learn more.</button>
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer minimal */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-12 py-10 border-t border-white/10 mt-auto">
        <p className="text-[#8c8c8c] text-sm">Questions? Contact us.</p>
      </footer>
    </div>
  )
}

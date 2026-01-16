import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await authApi.forgotPassword({ email })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-600 mb-4">NETFLIX</h1>
          <h2 className="text-3xl font-semibold">Forgot Password</h2>
        </div>

        {success ? (
          <div className="bg-success text-white p-4 rounded mb-4 text-center">
            Password reset email sent! Check your inbox for further instructions.
          </div>
        ) : error && (
          <div className="bg-error text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-5 py-3 bg-secondary text-white rounded focus:ring-2 focus:ring-red-600"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-hover text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-red-600 hover:bg-red-hover text-white font-bold py-3 rounded transition-colors"
          >
            Back to Login
          </button>
        )}

        <div className="mt-6 text-center text-sm text-text-secondary">
          <Link to="/login" className="text-white hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

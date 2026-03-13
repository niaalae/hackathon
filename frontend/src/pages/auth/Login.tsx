import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'

interface LoginData {
  email: string
  password: string
}

export default function Login() {
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function formLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

    const newErrors = { email: '', password: '' }
    let hasError = false

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required"
      hasError = true
    }
    if (!loginData.password) {
      newErrors.password = "Password is required"
      hasError = true
    }

    setErrors(newErrors)
    if (hasError) return

    try {
      setLoading(true)
      await login(loginData)
      navigate('/admin/users')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex items-center justify-center w-full min-h-screen px-4 bg-white pt-16">
        <form className="flex w-full flex-col max-w-96" onSubmit={formLogin}>
          <Link to="/" className="flex items-center gap-2 mb-8 group" title="Go to Home">
            <span className="text-orange-500 transition-transform duration-200 group-hover:scale-110">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 12L21 4L17 12L21 20L3 12Z" />
              </svg>
            </span>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Trippple
            </span>
          </Link>

          <h2 className="text-4xl font-medium text-gray-900">Sign in</h2>

          <p className="mt-4 text-base text-gray-500/90">
            Please enter email and password to access.
          </p>

          <div className="mt-10">
            <label className="font-medium text-gray-900">Email</label>
            <input
              placeholder="Please enter your email"
              className={`mt-2 rounded-md ring text-gray-900 focus:ring-2 outline-none px-3 py-3 w-full bg-white ${errors.email ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-200 focus:ring-orange-500'}`}
              type="email"
              name="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="font-medium text-gray-900">Password</label>
            <input
              placeholder="Please enter your password"
              className={`mt-2 rounded-md ring text-gray-900 focus:ring-2 outline-none px-3 py-3 w-full bg-white ${errors.password ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-200 focus:ring-orange-500'}`}
              type="password"
              name="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 py-3 w-full flex justify-center items-center gap-2 cursor-pointer rounded-md bg-orange-500 text-white font-semibold transition hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin size-5" /> : 'Login'}
          </button>
          <p className='text-center text-gray-600 py-8'>
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('/register')} className="text-orange-500 font-medium hover:underline">
              Sign up
            </button>
          </p>
        </form>
      </main>
    </div>
  )
}
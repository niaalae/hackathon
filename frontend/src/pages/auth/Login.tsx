import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

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
    <main className="flex items-center justify-center w-full min-h-screen px-4 bg-white">
      <form className="flex w-full flex-col max-w-96" onSubmit={formLogin}>

        <Link to="/" className="mb-8" title="Go to Home">
          <svg className="size-10" width="30" height="33" viewBox="0 0 30 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m8 4.55 6.75 3.884 6.75-3.885M8 27.83v-7.755L1.25 16.19m27 0-6.75 3.885v7.754M1.655 8.658l13.095 7.546 13.095-7.546M14.75 31.25V16.189m13.5 5.976V10.212a2.98 2.98 0 0 0-1.5-2.585L16.25 1.65a3.01 3.01 0 0 0-3 0L2.75 7.627a3 3 0 0 0-1.5 2.585v11.953a2.98 2.98 0 0 0 1.5 2.585l10.5 5.977a3.01 3.01 0 0 0 3 0l10.5-5.977a3 3 0 0 0 1.5-2.585"
              stroke="#1d293d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <h2 className="text-4xl font-medium text-gray-900">Sign in</h2>

        <p className="mt-4 text-base text-gray-500/90">
          Please enter email and password to access.
        </p>

        <div className="mt-10">
          <label className="font-medium text-gray-900">Email</label>
          <input
            placeholder="Please enter your email"
            className={`mt-2 rounded-md ring text-gray-900 focus:ring-2 outline-none px-3 py-3 w-full bg-white ${errors.email ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-200 focus:ring-indigo-600'}`}
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
            className={`mt-2 rounded-md ring text-gray-900 focus:ring-2 outline-none px-3 py-3 w-full bg-white ${errors.password ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-200 focus:ring-indigo-600'}`}
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
          className="mt-8 py-3 w-full flex justify-center items-center gap-2 cursor-pointer rounded-md bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin size-5" /> : 'Login'}
        </button>
        <p className='text-center text-gray-600 py-8'>
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('/register')} className="text-indigo-600 font-medium hover:underline">
            Sign up
          </button>
        </p>
      </form>
    </main>
  )
}
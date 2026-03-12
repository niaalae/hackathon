import { useAuthStore } from '@/stores/authStore'
import { ArrowLeft, Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="relative min-h-screen w-full bg-[#FAFAFA] flex justify-center items-center p-4 sm:p-6 overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />

      {/* Glass Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-white/80 transition-all duration-300 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" /> 
        <span className="hidden sm:block">Return</span>
      </button>

      {/* Premium Glass Card */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] rounded-[2rem] p-8 sm:p-10">
          
          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-neutral-500 font-medium">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-5" onSubmit={formLogin}>
            
            {/* Email Input */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className={`transition-colors duration-300 ${errors.email ? 'text-red-400' : 'text-neutral-400 group-focus-within:text-primary'}`} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className={`block w-full rounded-2xl border-0 py-3.5 pl-11 pr-4 text-neutral-900 shadow-sm ring-1 ring-inset transition-all duration-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white/50 hover:bg-white focus:bg-white
                    ${errors.email 
                      ? 'ring-red-300 focus:ring-red-500' 
                      : 'ring-neutral-200/80 focus:ring-primary'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs font-medium text-red-500 pl-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className={`transition-colors duration-300 ${errors.password ? 'text-red-400' : 'text-neutral-400 group-focus-within:text-primary'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className={`block w-full rounded-2xl border-0 py-3.5 pl-11 pr-12 text-neutral-900 shadow-sm ring-1 ring-inset transition-all duration-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white/50 hover:bg-white focus:bg-white
                    ${errors.password 
                      ? 'ring-red-300 focus:ring-red-500' 
                      : 'ring-neutral-200/80 focus:ring-primary'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs font-medium text-red-500 pl-1">{errors.password}</p>
              )}
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex justify-center items-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-white shadow-[0_8px_20px_-6px_var(--color-primary)] hover:shadow-[0_12px_25px_-8px_var(--color-primary)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-neutral-500">
              New to the platform?{' '}
              <button 
                type="button" 
                onClick={() => navigate('/register', { replace: true })}
                className="font-bold text-primary hover:text-primary/80 transition-colors focus:outline-none"
              >
                Create an account
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  )
}
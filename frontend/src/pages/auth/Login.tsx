import { useAuthStore } from '@/stores/authStore'
import { ArrowLeft } from 'lucide-react'
import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginData {
  email: string
  password: string
}

export default function Login() {
  const { login } = useAuthStore()
  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function formLogin(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      setErrors({ email: '', password: '' })
      if (!loginData.email) {
        setErrors({ ...errors, email: "email shouldn't be empty" })
        return
      }
      if (!loginData.password) {
        setErrors({ ...errors, password: "password shouldn't be empty" })
        return
      }

      login(loginData)
      navigate('/admin/users')
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative w-screen h-screen overflow-hidden bg-linear-to-tr from-primary to-accent flex justify-center items-center'>
      <button className='absolute top-4 left-4 rounded-lg bg-white shadow-xl px-4 py-2 hover:shadow-lg cursor-pointer flex gap-2 items-center' onClick={() => navigate('/')}>
        <ArrowLeft /> Back
      </button>
      <form className='max-w-sm rounded-lg shadow-xl p-8 bg-white' onSubmit={formLogin}>
        <div className='mb-5'>
          <label htmlFor='email-alternative' className='block mb-2.5 text-sm font-medium text-heading'>
            Your email
          </label>
          <input onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} value={loginData.email} type='email' id='email-alternative' className='bg-neutral-secondary-medium border border-muted text-heading text-sm rounded-md focus:ring-primary focus:border-primary block w-full px-3 py-2.5 shadow placeholder:text-body' placeholder='john.doe@email.com' />
          {errors.email && <small className='text-red-600 pl-3'>{errors.email}</small>}
        </div>
        <div className='mb-5'>
          <label htmlFor='password-alternative' className='block mb-2.5 text-sm font-medium text-heading'>
            Your password
          </label>
          <input onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} value={loginData.password} type='password' id='password-alternative' className='bg-neutral-secondary-medium border border-muted text-heading text-sm rounded-md focus:ring-primary focus:border-primary block w-full px-3 py-2.5 shadow placeholder:text-body' placeholder='••••••••' />
          {errors.password && <small className='text-red-600 pl-3'>{errors.password}</small>}
        </div>
        <div className='mb-5'>
          <label htmlFor='remember-alternative' className='flex items-center h-5'>
            <p className='ms-2 text-sm font-medium text-heading select-none'>
              You don't have an account ?{' '}
              <button type='button' onClick={() => navigate('/register', { replace: true })} className='text-primary hover:underline cursor-pointer'>
                Register now
              </button>
              .
            </p>
          </label>
        </div>
        <button type='submit' className='text-white bg-primary box-border border border-transparent cursor-pointer hover:bg-primary-strong focus:ring-4 focus:ring-primary-medium shadow-xs font-medium leading-5 rounded-md text-sm px-4 py-2.5 focus:outline-none'>
          Login
        </button>
      </form>
    </div>
  )
}

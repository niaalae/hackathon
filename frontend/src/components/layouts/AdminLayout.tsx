import { useAuthStore } from '@/stores/authStore'
import { Activity, ArrowLeft, LayoutDashboard, LogOut, MapPinned, Settings, Users } from 'lucide-react'
import { useMemo } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const LINKS = [
  { to: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: 'users', label: 'Users', icon: Users },
  { to: 'trips', label: 'Trips', icon: MapPinned },
  { to: 'analytics', label: 'Analytics', icon: Activity },
  { to: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const activePath = useMemo(() => location.pathname.replace(/\/+$/, ''), [location.pathname])

  return (
    <main className='min-h-screen bg-[#f4f6f9] text-zinc-900'>
      <div className='mx-auto max-w-[1400px] px-4 py-6 sm:px-6'>
        <div className='grid gap-6 lg:grid-cols-[92px,1fr]'>
          <aside className='flex flex-col items-center rounded-[18px] border border-zinc-200 bg-white py-4 shadow-sm'>
            <div className='text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400'>Admin</div>
            <div className='mt-2 flex flex-col items-center gap-3'>
              {LINKS.map((link) => {
                const isActive = activePath === '/admin' ? link.to === 'dashboard' : activePath.startsWith('/admin/' + link.to)
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-active={isActive}
                    className='group flex flex-col items-center gap-1 text-[10px] font-semibold text-zinc-400'
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                        isActive ? 'border-orange-500 bg-orange-500 text-white' : 'border-zinc-200 bg-white text-zinc-500'
                      }`}
                    >
                      <link.icon className='h-4 w-4' />
                    </span>
                    <span className='opacity-0 transition group-hover:opacity-100'>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className='mt-auto flex flex-col items-center gap-3 pt-4'>
              <button
                onClick={() => navigate('/')}
                className='flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500'
                title='Back to site'
              >
                <ArrowLeft className='h-4 w-4' />
              </button>
              <button
                onClick={() => logout().then(() => navigate('/'))}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white'
                title='Sign out'
              >
                <LogOut className='h-4 w-4' />
              </button>
            </div>
          </aside>

          <section className='rounded-[22px] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]'>
            <div className='bg-[#fbfaf7] px-6 py-6 sm:px-8'>
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

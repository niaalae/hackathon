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
  const activeLabel = useMemo(() => {
    if (activePath === '/admin') return 'Dashboard'
    const match = LINKS.find((l) => activePath.startsWith('/admin/' + l.to))
    return match?.label ?? 'Admin'
  }, [activePath])

  return (
    <main className='min-h-screen bg-[#f4f6f9] text-zinc-900'>
      <div className='mx-auto max-w-[1400px] px-4 py-6 sm:px-6'>
        <div className='grid gap-6 lg:grid-cols-[200px,1fr]'>
          <aside className='flex flex-col rounded-[18px] border border-zinc-200 bg-white p-4 shadow-sm'>
            <div className='text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400'>Admin</div>
            <div className='mt-1 text-sm font-semibold text-zinc-900'>{user?.name ?? 'Guest'}</div>

            <nav className='mt-4 space-y-1'>
              {LINKS.map((link) => {
                const isActive = activePath === '/admin' ? link.to === 'dashboard' : activePath.startsWith('/admin/' + link.to)
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-active={isActive}
                    className='flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 data-[active=true]:bg-orange-500/10 data-[active=true]:text-orange-600'
                  >
                    <link.icon className='h-4 w-4' />
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className='mt-auto space-y-2 pt-6'>
              <button
                onClick={() => navigate('/')}
                className='flex w-full items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600'
              >
                <ArrowLeft className='h-4 w-4' />
                Back to site
              </button>
              <button
                onClick={() => logout().then(() => navigate('/'))}
                className='flex w-full items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white'
              >
                <LogOut className='h-4 w-4' />
                Sign out
              </button>
            </div>
          </aside>

          <section className='rounded-[22px] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]'>
            <header className='flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 px-6 py-4 sm:px-8'>
              <div>
                <div className='text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400'>Admin</div>
                <h1 className='text-2xl font-semibold text-zinc-900 sm:text-3xl'>{activeLabel}</h1>
                <p className='text-xs text-zinc-500'>Route: {activePath}</p>
              </div>
              <div className='rounded-full border border-orange-200 bg-orange-500/10 px-4 py-2 text-xs font-semibold text-orange-600'>
                Status: {user?.admin ? 'Admin' : 'Viewer'}
              </div>
            </header>

            <div className='bg-[#fbfaf7] px-6 py-6 sm:px-8'>
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

import { useAuthStore } from '@/stores/authStore'
import { ArrowLeft, LayoutDashboard, LogOut, Map, Plane, Sparkles, Users } from 'lucide-react'
import { useMemo } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const LINKS = [
  { to: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: 'maps', label: 'Maps', icon: Map },
  { to: 'trips', label: 'Trip Hub', icon: Plane },
  { to: 'groups', label: 'Groups', icon: Users },
  { to: 'ai', label: 'AI Agent', icon: Sparkles },
]

export default function UserLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const activePath = useMemo(() => location.pathname.replace(/\/+$/, ''), [location.pathname])
  const activeLabel = useMemo(() => {
    if (activePath === '/user' || activePath === '/user/dashboard') return 'Dashboard'
    const match = LINKS.find((l) => activePath.startsWith('/user/' + l.to))
    return match?.label ?? 'User space'
  }, [activePath])

  return (
    <main className='min-h-screen bg-[#f4f6f9] text-zinc-900'>
      <div className='mx-auto max-w-[1400px] px-4 py-6 sm:px-6'>
        <div className='grid gap-6 lg:grid-cols-[280px,1fr]'>
          <aside className='rounded-[26px] border border-[#eceff3] bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]'>
            <div className='rounded-[22px] border border-[#efe9df] bg-[#f7f2ea] p-4'>
              <div className='flex items-center gap-3'>
                <div className='h-12 w-12 overflow-hidden rounded-2xl bg-white'>
                  <img src='/logo.png' alt='logo' className='h-full w-full object-cover' />
                </div>
                <div>
                  <div className='text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400'>Trippple</div>
                  <div className='text-sm font-semibold text-zinc-900'>User panel</div>
                </div>
              </div>
              <div className='mt-3 text-xs text-zinc-500'>
                Welcome, <span className='font-semibold text-zinc-700'>{user?.name ?? 'Guest'}</span>
              </div>
            </div>

            <div className='mt-5 space-y-2'>
              {LINKS.map((link) => {
                const isActive = activePath === '/user' ? link.to === 'dashboard' : activePath.startsWith('/user/' + link.to)
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-active={isActive}
                    className='flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold text-zinc-700 transition duration-150 hover:border-[#eadfcf] hover:bg-[#f7f2ea] data-[active=true]:border-[#eadfcf] data-[active=true]:bg-[#f7f2ea]'
                  >
                    <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-900 shadow-sm'>
                      <link.icon className='h-4 w-4' />
                    </span>
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div className='mt-6 space-y-2'>
              <button
                onClick={() => navigate('/')}
                className='flex w-full items-center gap-3 rounded-2xl border border-[#eceff3] bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5'
              >
                <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white'>
                  <ArrowLeft className='h-4 w-4' />
                </span>
                Back to site
              </button>
              <button
                onClick={() => logout().then(() => navigate('/'))}
                className='flex w-full items-center gap-3 rounded-2xl border border-transparent bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(24,24,27,0.2)] transition hover:-translate-y-0.5 hover:bg-zinc-800'
              >
                <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-white/10'>
                  <LogOut className='h-4 w-4' />
                </span>
                Sign out
              </button>
            </div>
          </aside>

          <section className='rounded-[28px] border border-[#eceff3] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
            <header className='flex flex-wrap items-center justify-between gap-4 border-b border-[#f0ebe2] px-6 py-5 sm:px-8'>
              <div>
                <div className='text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400'>User</div>
                <h1 className='text-2xl font-semibold text-zinc-900 sm:text-3xl'>{activeLabel}</h1>
                <p className='text-xs text-zinc-500'>Route: {activePath}</p>
              </div>
              <div className='rounded-2xl border border-[#f0ebe2] bg-[#f7f2ea] px-4 py-2 text-xs font-semibold text-zinc-600'>
                Plan with confidence
              </div>
            </header>

            <div className='bg-[#fbfaf7] px-6 py-8 sm:px-8'>
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

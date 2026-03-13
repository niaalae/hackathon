import { useAuthStore } from '@/stores/authStore'
import { Activity, ArrowLeft, LayoutDashboard, LogOut, MapPinned, Settings, Users } from 'lucide-react'
import { useMemo } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function AdminLayout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const isRtl = i18n.language === 'ar'

  const LINKS = [
    { to: 'dashboard', label: t('admin.sidebar.dashboard'), icon: LayoutDashboard },
    { to: 'users', label: t('admin.sidebar.users'), icon: Users },
    { to: 'trips', label: t('admin.sidebar.trips'), icon: MapPinned },
    { to: 'analytics', label: t('admin.sidebar.analytics'), icon: Activity },
    { to: 'settings', label: t('admin.sidebar.settings'), icon: Settings },
  ]

  const activePath = useMemo(() => location.pathname.replace(/\/+$/, ''), [location.pathname])

  return (
    <main className='min-h-screen bg-[#f8f9fa] text-zinc-900' dir={isRtl ? 'rtl' : 'ltr'}>
      <div className='mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <aside className='w-full lg:w-64 flex-shrink-0'>
            <div className='sticky top-8 flex flex-col items-center lg:items-stretch rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)]'>
              <div className={`flex items-center gap-3 px-3 mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className='h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20'>
                  <Activity className='h-4 w-4' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-bold text-zinc-900 leading-tight'>{t('admin.header.title')}</span>
                  <span className='text-[10px] font-medium text-zinc-400 tracking-wider uppercase'>{t('user.header.user')}</span>
                </div>
              </div>

              <nav className='flex flex-col gap-2'>
                {LINKS.map((link) => {
                  const isActive = activePath === '/admin' ? link.to === 'dashboard' : activePath.startsWith('/admin/' + link.to)
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 whitespace-nowrap'
                        }`}
                    >
                      <link.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                      <span className='text-sm font-semibold'>{link.label}</span>
                      {isActive && (
                        <div className={`ml-auto h-1.5 w-1.5 rounded-full bg-white opacity-60 ${isRtl ? 'mr-auto ml-0' : 'ml-auto'}`} />
                      )}
                    </Link>
                  )
                })}
              </nav>

              <div className='mt-12 pt-6 border-t border-zinc-100 flex flex-col gap-2'>
                <button
                  onClick={() => navigate('/')}
                  className='flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-200 group'
                >
                  <ArrowLeft className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''} group-hover:-translate-x-1 transition-transform`} />
                  <span className='text-sm font-semibold'>{t('user.header.back')}</span>
                </button>
                <button
                  onClick={() => logout().then(() => navigate('/'))}
                  className='flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-200 group'
                >
                  <LogOut className='h-5 w-5 group-hover:translate-x-1 transition-transform' />
                  <span className='text-sm font-semibold'>{t('user.header.signout')}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className='flex-1 min-w-0'>
            <div className='rounded-3xl border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.03)] min-h-[calc(100vh-120px)]'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

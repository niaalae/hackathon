import { Bell, Search, Menu, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useWindowSize } from '@/hooks/useWindowSize'
import { Link, useLocation } from 'react-router-dom'

interface TopBarProps {
  onMenuClick?: () => void
}

export const TopBar = ({ onMenuClick }: TopBarProps) => {
  const { user } = useAuthStore()
  const { isMobile } = useWindowSize()
  const location = useLocation()

  const getBreadcrumb = () => {
    const path = location.pathname.split('/').filter(Boolean)
    return path.map((p, i) => (
      <span key={p} className="flex items-center capitalize">
        {i > 0 && <span className="mx-2 text-gray-400">/</span>}
        <span className={i === path.length - 1 ? 'text-text font-semibold' : 'text-text-muted'}>
          {p}
        </span>
      </span>
    ))
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-bg px-4 md:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger / Tablet Drawer Trigger */}
        {!isMobile && (
          <div className="hidden lg:block">
            <div className="flex items-center text-sm">
              {getBreadcrumb()}
            </div>
          </div>
        )}

        {isMobile && (
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-orange-500 transition-transform duration-200 group-hover:scale-110 flex shrink-0 items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 12L21 4L17 12L21 20L3 12Z" />
              </svg>
            </span>
            <span className="text-[17px] font-semibold text-gray-900 tracking-tight">Trippple</span>
          </Link>
        )}

        {!isMobile && (
          <div className="lg:hidden flex items-center">
            <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-400 hover:text-gray-600">
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-[17px] ml-2 font-semibold text-gray-900 tracking-tight">Trippple</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center px-4 max-w-md hidden lg:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips, places..."
            className="h-9 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm outline-none transition-all focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
          </span>
        </button>

        <div className="flex items-center gap-3 ml-2">
          {!isMobile && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text leading-none">{user?.name || 'Guest'}</p>
              <p className="text-xs text-text-muted mt-1 leading-none">{user?.role || 'User'}</p>
            </div>
          )}
          <div className="h-9 w-9 overflow-hidden rounded-full border border-border bg-surface ring-2 ring-white">
            <div className="flex h-full w-full items-center justify-center bg-brand/10 text-brand">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

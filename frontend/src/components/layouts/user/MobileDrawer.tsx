import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Users,
  Plane,
  UsersRound,
  Sparkles,
  X,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const MENU_ITEMS = [
  { path: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/user/maps', label: 'Maps', icon: Map },
  { path: '/user/match', label: 'Match', icon: Users },
  { path: '/user/trips', label: 'Trips', icon: Plane },
  { path: '/user/groups', label: 'Groups', icon: UsersRound },
  { path: '/user/ai', label: 'AI Planner', icon: Sparkles },
]

export const MobileDrawer = ({ isOpen, onClose }: MobileDrawerProps) => {
  const { logout } = useAuthStore()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-[280px] bg-bg shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 12L21 4L17 12L21 20L3 12Z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-text">Trippple</span>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4 pt-6">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex h-12 items-center rounded-xl px-4 transition-all ${
                  isActive
                    ? 'bg-active-bg text-brand'
                    : 'text-text-muted hover:bg-surface hover:text-text'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="ml-3 font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={() => {
              logout()
              onClose()
            }}
            className="flex h-12 w-full items-center rounded-xl px-4 text-text-muted transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="ml-3 font-medium">Log out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

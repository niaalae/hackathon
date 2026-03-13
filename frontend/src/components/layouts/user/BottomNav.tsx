import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Users,
  Plane,
  UsersRound,
  Sparkles
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/user/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/user/maps', label: 'Maps', icon: Map },
  { path: '/user/match', label: 'Match', icon: Users },
  { path: '/user/trips', label: 'Trips', icon: Plane },
  { path: '/user/groups', label: 'Groups', icon: UsersRound },
]

export const BottomNav = () => {
  return (
    <>
      {/* AI Floating Button */}
      <NavLink
        to="/user/ai"
        className={({ isActive }) =>
          `fixed bottom-[84px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40 transition-transform active:scale-92 ${
            isActive ? 'ring-4 ring-brand/20' : ''
          }`
        }
      >
        <Sparkles className="h-6 w-6" />
      </NavLink>

      {/* Bottom Bar */}
      <nav className="fixed bottom-0 left-0 z-50 h-[72px] w-full border-t border-border bg-bg pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex h-full items-center justify-around px-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center justify-center gap-1 transition-all active:scale-92 ${
                  isActive ? 'text-brand' : 'text-text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Underline Indicator (Top of icon per spec) */}
                  {isActive && (
                    <div className="absolute top-[-10px] h-0.5 w-6 rounded-full bg-brand" />
                  )}
                  <item.icon className={`h-6 w-6 ${isActive ? 'text-brand' : ''}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}

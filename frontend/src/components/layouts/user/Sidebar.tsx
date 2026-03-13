import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Users,
  Plane,
  UsersRound,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  User
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const MENU_ITEMS = [
  { path: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/user/maps', label: 'Maps', icon: Map },
  { path: '/user/match', label: 'Match', icon: Users },
  { path: '/user/trips', label: 'Trips', icon: Plane },
  { path: '/user/groups', label: 'Groups', icon: UsersRound },
  { path: '/user/ai', label: 'AI Planner', icon: Sparkles },
]

export const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const { logout, user } = useAuthStore()

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-bg transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 12L21 4L17 12L21 20L3 12Z" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight text-text">Trippple</span>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-3 pt-6">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex h-11 items-center rounded-xl transition-all duration-200 hover:bg-active-bg ${
                isActive
                  ? 'bg-active-bg text-brand'
                  : 'text-text-muted hover:text-text'
              } ${isCollapsed ? 'justify-center' : 'px-3'}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-brand' : 'group-hover:text-brand'}`} />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium transition-opacity duration-300">
                    {item.label}
                  </span>
                )}

                {/* Active Indicator */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-full ml-2 rounded-md bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-[100] whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-border p-3 space-y-1">
        <button
          onClick={() => logout()}
          className={`group relative flex h-11 w-full items-center rounded-xl text-text-muted transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${
            isCollapsed ? 'justify-center' : 'px-3'
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-colors group-hover:text-red-600" />
          {!isCollapsed && <span className="ml-3 text-sm font-medium">Log out</span>}
          {isCollapsed && (
            <div className="pointer-events-none absolute left-full ml-2 rounded-md bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
              Log out
            </div>
          )}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`group relative flex h-11 w-full items-center rounded-xl text-text-muted transition-all duration-200 hover:bg-active-bg hover:text-brand ${
            isCollapsed ? 'justify-center' : 'px-3'
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
          {!isCollapsed && <span className="ml-3 text-sm font-medium">Collapse</span>}
        </button>
      </div>
    </aside>
  )
}

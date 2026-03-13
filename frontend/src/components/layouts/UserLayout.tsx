import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from '@/hooks/useWindowSize'
import { TopBar, Sidebar, BottomNav, MobileDrawer } from './user'

export default function UserLayout() {
  const { i18n } = useTranslation()
  const { isMobile, isTablet, isDesktop } = useWindowSize()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  
  const isRtl = i18n.language === 'ar'

  return (
    <div
      className="min-h-screen bg-bg text-text"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Desktop Sidebar */}
      {isDesktop && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}

      {/* Tablet Drawer */}
      {!isDesktop && (
        <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      )}

      {/* Main Layout Area */}
      <div
        className={`flex flex-col transition-all duration-300 ease-in-out ${
          isDesktop
            ? isCollapsed
              ? 'pl-[72px]'
              : 'pl-[240px]'
            : ''
        } ${isMobile ? 'pb-[72px]' : ''}`}
      >
        <TopBar onMenuClick={() => setIsDrawerOpen(true)} />

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <div
            key={location.pathname}
            className="animate-fade-in"
          >
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && <BottomNav />}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 200ms ease-out both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 767px) {
          /* Smooth scale animation on tap */
          .active-press:active {
            transform: scale(0.92);
          }
        }
      `}</style>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { motion, AnimatePresence } from 'framer-motion'

interface NavLink {
  label: string
  href: string
  active?: boolean
  dropdown?: boolean
  items?: string[]
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDropdown = (label: string): void => {
    setOpenDropdown((prev) => (prev === label ? null : label))
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setLangDropdownOpen(false)
  }

  const dropdownRoutes: Record<string, string> = {
    [t('nav.tripPlanner')]: '/planning/trip-planner',
    [t('nav.itineraries')]: '/planning/itineraries',
    [t('nav.travelGuides')]: '/planning/travel-guides',
    [t('nav.beachEvents')]: '/summer-parties/beach-events',
    [t('nav.rooftopParties')]: '/summer-parties/rooftop-parties',
    [t('nav.festivalGuide')]: '/summer-parties/festival-guide',
  }

  const navLinks: NavLink[] = [
    { label: t('nav.home'), href: '/', active: true, dropdown: false },
    {
      label: t('nav.planning'),
      href: '/planning/trip-planner',
      dropdown: true,
      items: [t('nav.tripPlanner'), t('nav.itineraries'), t('nav.travelGuides')],
    },
    {
      label: t('nav.summerParties'),
      href: '/summer-parties/beach-events',
      dropdown: true,
      items: [t('nav.beachEvents'), t('nav.rooftopParties'), t('nav.festivalGuide')],
    },
    { label: t('nav.pricing'), href: '/pricing', dropdown: false },
    { label: t('nav.maps'), href: '/maps', dropdown: false },
    { label: t('nav.faqs'), href: '/faqs', dropdown: false },
  ]

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'AR' },
  ]

  const isRtl = i18n.language === 'ar'

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="h-16 w-full bg-white border-b border-gray-100" />
      </header>
    )
  }

  return (
    <header
      className={`fixed z-50 w-full transition-all duration-300 ${scrolled ? 'top-4 px-4 md:px-6' : 'top-0 px-0'
        }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className={`${scrolled ? 'mx-auto max-w-6xl' : 'w-full'}`}>
        <motion.div
          layout
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={`transition-all duration-300 ${scrolled
            ? 'rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.08)]'
            : 'rounded-none border-b border-gray-100 bg-white'
            }`}
        >
          <div className={`${scrolled ? 'px-4 md:px-6' : 'max-w-7xl mx-auto px-6'}`}>
            <div className="flex items-center justify-between h-16 gap-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 flex-shrink-0 group" onClick={() => setMobileOpen(false)}>
                <span className="text-orange-500 transition-transform duration-200 group-hover:scale-110">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3 12L21 4L17 12L21 20L3 12Z" />
                  </svg>
                </span>
                <span className="text-[17px] font-semibold text-gray-900 tracking-tight">
                  Trippple
                </span>
              </Link>

              {/* Desktop Nav */}
              <ul className="hidden md:flex items-center gap-1 flex-1 justify-center list-none m-0 p-0">
                {navLinks.map((link) => (
                  <li key={link.label} className="relative">
                    {link.dropdown ? (
                      <div
                        onMouseEnter={() => setOpenDropdown(link.label)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <button
                          type="button"
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13.5px] font-medium transition-all duration-150 border ${openDropdown === link.label
                            ? 'text-gray-900 bg-gray-50 border-gray-200'
                            : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50 hover:border-gray-200'
                            }`}
                        >
                          {link.label}
                          <ChevronDown
                            size={13}
                            className={`text-gray-400 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''
                              }`}
                          />
                        </button>

                        <div
                          className={`absolute top-full ${isRtl ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'
                            } pt-2 transition-all duration-150 ${openDropdown === link.label
                              ? 'opacity-100 translate-y-0 pointer-events-auto'
                              : 'opacity-0 -translate-y-1 pointer-events-none'
                            }`}
                        >
                          <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/80 p-1.5 min-w-[168px]">
                            {link.items?.map((item) => (
                              <Link
                                key={item}
                                to={dropdownRoutes[item] || '#'}
                                className="flex items-center px-3.5 py-2.5 text-[13px] font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100 whitespace-nowrap"
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={link.href}
                        className={`flex items-center px-4 py-2 rounded-full text-[13.5px] font-medium transition-all duration-150 border ${link.active
                          ? 'text-gray-900 border-gray-200 bg-white shadow-sm'
                          : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50 hover:border-gray-200'
                          }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Right Section */}
              <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                {/* Language Switcher */}
                <div className="relative" onMouseLeave={() => setLangDropdownOpen(false)}>
                  <button
                    type="button"
                    onMouseEnter={() => setLangDropdownOpen(true)}
                    className="flex items-center gap-1.5 px-2 py-2 text-gray-600 hover:text-gray-900 font-medium text-[13.5px] transition-colors"
                    aria-label="Change language"
                  >
                    <Globe size={16} />
                    <span className="uppercase">{i18n.language?.split('-')[0] || 'EN'}</span>
                    <ChevronDown size={13} />
                  </button>

                  <div
                    className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} pt-2 transition-all duration-150 ${langDropdownOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-1 pointer-events-none'
                      }`}
                  >
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/80 p-1.5 min-w-[100px]">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full flex items-center px-3.5 py-2 text-[13px] font-medium rounded-xl transition-colors duration-100 ${i18n.language === lang.code
                            ? 'bg-gray-50 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {user ? (
                  <>
                    <Link
                      to="/admin"
                      className="text-[13.5px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        navigate('/')
                      }}
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-[13.5px] font-semibold rounded-full transition-all duration-150"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[13.5px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {t('nav.login')}
                    </Link>

                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[13.5px] font-semibold rounded-full transition-all duration-150 hover:-translate-y-px hover:shadow-lg hover:shadow-gray-900/10 active:translate-y-0"
                    >
                      {t('nav.register')}
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="md:hidden relative h-10 w-10 -mr-2 inline-flex items-center justify-center rounded-xl hover:bg-black/5 transition"
              >
                <span className="relative block h-5 w-5">
                  <motion.span
                    className="absolute left-0 top-1/2 h-0.5 w-5 bg-black -translate-y-1/2 rounded"
                    animate={mobileOpen ? { rotate: 45 } : { rotate: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  />
                  <motion.span
                    className="absolute left-0 top-1/2 h-0.5 w-5 bg-black -translate-y-1/2 rounded"
                    animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="absolute left-0 top-1/2 h-0.5 w-5 bg-black -translate-y-1/2 rounded"
                    animate={mobileOpen ? { rotate: -45 } : { rotate: 0, y: 6 }}
                    transition={{ duration: 0.25 }}
                  />
                </span>
              </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence initial={false}>
              {mobileOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.21, 1, 0.21, 1] }}
                  className="overflow-hidden md:hidden"
                >
                  <div className="flex flex-col gap-1 border-t border-gray-100 px-0 pb-3 pt-3">
                    {navLinks.map((link) => (
                      <div key={link.label}>
                        {link.dropdown ? (
                          <>
                            <button
                              type="button"
                              onClick={() => toggleDropdown(link.label)}
                              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[14px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100"
                            >
                              {link.label}
                              <ChevronDown
                                size={14}
                                className={`text-gray-400 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''
                                  }`}
                              />
                            </button>

                            <AnimatePresence initial={false}>
                              {openDropdown === link.label && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.22 }}
                                  className="overflow-hidden"
                                >
                                  <div className={`mt-1 flex flex-col gap-0.5 ${isRtl ? 'mr-4' : 'ml-4'}`}>
                                    {link.items?.map((item) => (
                                      <Link
                                        key={item}
                                        to={dropdownRoutes[item] || '#'}
                                        className="px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-100"
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        {item}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            to={link.href}
                            className={`flex items-center px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-100 ${link.active
                              ? 'bg-gray-50 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {link.label}
                          </Link>
                        )}
                      </div>
                    ))}

                    {/* Mobile Language + Auth */}
                    <div className="flex flex-col border-t border-gray-100 mt-2 pt-2 gap-2">
                      <div className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-[14px] font-medium text-gray-600 inline-flex items-center gap-2">
                          <Globe size={16} /> {t('nav.language')}
                        </span>
                        <div className="flex items-center gap-2">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => changeLanguage(lang.code)}
                              className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors duration-100 ${i18n.language === lang.code
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                              {lang.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="px-2 pb-1 pt-1 flex flex-col gap-2">
                        {user ? (
                          <>
                            <Link
                              to="/admin"
                              className="w-full py-3 text-center border border-gray-200 text-gray-900 text-[14px] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              Dashboard
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                logout()
                                setMobileOpen(false)
                                navigate('/')
                              }}
                              className="w-full py-3 bg-gray-100 text-gray-900 text-[14px] font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-150"
                            >
                              Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/login"
                              className="w-full py-3 text-center border border-gray-200 text-gray-900 text-[14px] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {t('nav.login')}
                            </Link>

                            <button
                              type="button"
                              onClick={() => {
                                navigate('/register')
                                setMobileOpen(false)
                              }}
                              className="w-full py-3 bg-gray-900 text-white text-[14px] font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-150"
                            >
                              {t('nav.register')}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
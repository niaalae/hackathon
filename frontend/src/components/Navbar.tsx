'use client'

import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

interface NavLink {
  label: string
  href: string
  active?: boolean
  dropdown?: boolean
  items?: string[]
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '#', active: true, dropdown: false },
  {
    label: 'Planning',
    href: '#',
    dropdown: true,
    items: ['Trip Planner', 'Itineraries', 'Travel Guides'],
  },
  {
    label: 'Summer-Parties',
    href: '#',
    dropdown: true,
    items: ['Beach Events', 'Rooftop Parties', 'Festival Guide'],
  },
  { label: 'Pricing', href: '#', dropdown: false },
  { label: 'FAQs', href: '#', dropdown: false },
]

export default function Navbar(): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (label: string): void => {
    setOpenDropdown((prev) => (prev === label ? null : label))
  }

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-8">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-orange-500 transition-transform duration-200 group-hover:scale-110">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 12L21 4L17 12L21 20L3 12Z" />
              </svg>
            </span>
            <span className="text-[17px] font-semibold text-gray-900 tracking-tight">
              Trippple
            </span>
          </a>

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
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13.5px] font-medium transition-all duration-150 border ${
                        openDropdown === link.label
                          ? 'text-gray-900 bg-gray-50 border-gray-200'
                          : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={13}
                        className={`text-gray-400 transition-transform duration-200 ${
                          openDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-150 ${
                        openDropdown === link.label
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 -translate-y-1 pointer-events-none'
                      }`}
                    >
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/80 p-1.5 min-w-[168px]">
                        {link.items?.map((item) => (
                          <a
                            key={item}
                            href="#"
                            className="flex items-center px-3.5 py-2.5 text-[13px] font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100 whitespace-nowrap"
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <a
                    href={link.href}
                    className={`flex items-center px-4 py-2 rounded-full text-[13.5px] font-medium transition-all duration-150 border ${
                      link.active
                        ? 'text-gray-900 border-gray-200 bg-white shadow-sm'
                        : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Register */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <button
              type="button"
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[13.5px] font-semibold rounded-full transition-all duration-150 hover:-translate-y-px hover:shadow-lg hover:shadow-gray-900/10 active:translate-y-0"
            >
              Register
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-gray-100 bg-white overflow-hidden transition-all duration-200 ease-in-out ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
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
                      className={`text-gray-400 transition-transform duration-200 ${
                        openDropdown === link.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openDropdown === link.label && (
                    <div className="ml-4 mt-1 flex flex-col gap-0.5">
                      {link.items?.map((item) => (
                        <a
                          key={item}
                          href="#"
                          className="px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-100"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={link.href}
                  className={`flex items-center px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-100 ${
                    link.active
                      ? 'bg-gray-50 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}

          <div className="pt-2 pb-1">
            <button
              type="button"
              className="w-full py-3 bg-gray-900 text-white text-[14px] font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-150"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
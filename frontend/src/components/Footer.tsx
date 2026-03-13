import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Facebook, Twitter, Instagram, Mail, ArrowRight } from 'lucide-react'

function ZellijLineBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.25]"
        viewBox="0 0 1600 1000"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="zellijFooterPattern" width="220" height="220" patternUnits="userSpaceOnUse">
            <g
              stroke="rgba(37,99,235,0.26)"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="110,22 124,60 110,72 96,60" />
              <polygon points="178,42 162,74 150,68 154,34" />
              <polygon points="198,110 160,124 148,110 160,96" />
              <polygon points="178,178 150,152 154,140 166,146" />
              <polygon points="110,198 96,160 110,148 124,160" />
              <polygon points="42,178 70,152 66,140 54,146" />
              <polygon points="22,110 60,96 72,110 60,124" />
              <polygon points="42,42 70,68 66,80 54,74" />
              <polygon points="110,72 138,80 148,110 138,140 110,148 82,140 72,110 82,80" />
              <line x1="28" y1="22" x2="42" y2="42" />
              <line x1="192" y1="22" x2="178" y2="42" />
              <line x1="28" y1="198" x2="42" y2="178" />
              <line x1="192" y1="198" x2="178" y2="178" />
              <line x1="68" y1="10" x2="54" y2="34" />
              <line x1="152" y1="10" x2="166" y2="34" />
              <line x1="68" y1="210" x2="54" y2="186" />
              <line x1="152" y1="210" x2="166" y2="186" />
            </g>
          </pattern>

          <radialGradient
            id="leftGlowFooter"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(300 260) rotate(90) scale(360 420)"
          >
            <stop offset="0%" stopColor="rgba(59,130,246,0.10)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </radialGradient>

          <radialGradient
            id="rightGlowFooter"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1280 240) rotate(90) scale(340 420)"
          >
            <stop offset="0%" stopColor="rgba(249,115,22,0.08)" />
            <stop offset="100%" stopColor="rgba(249,115,22,0)" />
          </radialGradient>
        </defs>

        <rect width="1600" height="1000" fill="url(#zellijFooterPattern)" />
        <rect width="1600" height="1000" fill="url(#leftGlowFooter)" />
        <rect width="1600" height="1000" fill="url(#rightGlowFooter)" />
      </svg>
    </div>
  )
}

export default function Footer() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  return (
    <footer
      className="relative w-full overflow-hidden border-t border-gray-100 bg-white pt-20 pb-10"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <ZellijLineBackground />

      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-orange-50/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 border-b border-gray-100 pb-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link to="/" className="group mb-6 flex items-center gap-2">
              <span className="text-orange-500 transition-transform duration-200 group-hover:scale-110">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 12L21 4L17 12L21 20L3 12Z" />
                </svg>
              </span>
              <span className="text-xl font-bold tracking-tight text-gray-900">Trippple</span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-gray-500 transition-colors hover:text-gray-700">
              {t('footer.tagline')}
            </p>

            <div className="mt-8 flex items-center gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="rounded-xl bg-gray-50 p-2 text-gray-400 transition-all duration-200 hover:bg-orange-50 hover:text-orange-500"
                  aria-label={`Social link ${i + 1}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-6 text-[13px] font-bold uppercase tracking-widest text-gray-900">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-4">
              {[
                { label: t('nav.home'), to: '/' },
                { label: t('nav.planning'), to: '/planning/trip-planner' },
                { label: t('nav.pricing'), to: '/pricing' },
                { label: t('nav.faqs'), to: '/faqs' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-500 transition-colors hover:text-orange-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-6 text-[13px] font-bold uppercase tracking-widest text-gray-900">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="#" className="text-sm text-gray-500 transition-colors hover:text-orange-500">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 transition-colors hover:text-orange-500">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="mb-6 text-[13px] font-bold uppercase tracking-widest text-gray-900">
              {t('footer.newsletter')}
            </h4>
            <p className="mb-6 text-sm tracking-tight text-gray-500">
              {t('footer.newsletterDesc')}
            </p>

            <form className="group relative">
              <input
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-4 pr-12 text-base transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 sm:text-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 flex w-10 items-center justify-center rounded-xl bg-gray-900 text-white transition-colors duration-200 hover:bg-orange-500"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 pt-10 md:flex-row">
          <p className="text-xs font-medium tracking-tight text-gray-400">
            {t('footer.rights')}
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Mail size={14} className="text-orange-500/60" />
              <span>hello@trippple.com</span>
            </div>

            <div className="hidden h-4 w-px bg-gray-100 md:block"></div>

            <p className="text-xs font-medium text-gray-400">
              {t('footer.bottomTagline')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
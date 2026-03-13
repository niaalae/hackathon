import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const pricingPlans = [
  {
    id: 1,
    name: 'Starter',
    description: 'Perfect for solo travelers exploring Morocco for the first time.',
    price: 0,
    buttonText: 'Start for free',
    buttonStyle: 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50',
    subtext: 'Free forever. No credit card required.',
    isDark: false,
    isPopular: false,
    features: [
      'Interactive map with 10 pins',
      'Basic route planning',
      'Flight & hotel search',
      'Offline access (limited)',
      'Community recommendations',
    ],
  },
  {
    id: 2,
    name: 'Explorer',
    description: 'Best for frequent travelers and groups planning real trips.',
    price: 19,
    period: '/mo',
    buttonText: 'Unlock full access',
    buttonStyle: 'bg-linear-to-r from-orange-500 to-orange-400 text-white',
    subtext: 'Cancel anytime. Full access to all features.',
    isDark: true,
    isPopular: true,
    features: [
      'All-in-one booking hub (flights, hotels, activities)',
      'Email import for bookings',
      'Full offline access',
      'Group collaboration (shared dates, budgets, photos)',
      'AI travel agent assistant',
      'Personalized local recommendations',
      'Cost estimates (tolls, fuel, tickets)',
    ],
  },
  {
    id: 3,
    name: 'Premium',
    description: 'Built for agencies and large groups shipping trips together.',
    price: 49,
    period: '/mo',
    buttonText: 'Get premium access',
    buttonStyle: 'bg-linear-to-r from-orange-500 to-orange-400 text-white',
    subtext: 'Priority support and dedicated concierge.',
    isDark: false,
    isPopular: false,
    features: [
      'Everything in Explorer',
      'Dedicated travel concierge',
      'Private transport booking',
      'Travel theft insurance',
      'Team accounts & management',
      'Verified security escorts',
      'Exclusive villa & riad access',
    ],
  },
]

function ZellijLineBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.25]"
        viewBox="0 0 1600 1000"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="zellijPricingPattern" width="220" height="220" patternUnits="userSpaceOnUse">
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
            id="leftGlowPricing"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(300 260) rotate(90) scale(360 420)"
          >
            <stop stopColor="rgba(59,130,246,0.10)" />
            <stop offset="1" stopColor="rgba(59,130,246,0)" />
          </radialGradient>

          <radialGradient
            id="rightGlowPricing"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1280 240) rotate(90) scale(340 420)"
          >
            <stop stopColor="rgba(249,115,22,0.08)" />
            <stop offset="1" stopColor="rgba(249,115,22,0)" />
          </radialGradient>
        </defs>

        <rect width="1600" height="1000" fill="url(#zellijPricingPattern)" />
        <rect width="1600" height="1000" fill="url(#leftGlowPricing)" />
        <rect width="1600" height="1000" fill="url(#rightGlowPricing)" />
      </svg>
    </div>
  )
}

function PricingCard({
  plan,
  isMobile = false,
}: {
  plan: (typeof pricingPlans)[number]
  isMobile?: boolean
}) {
  return (
    <div
      className={`relative rounded-[20px] px-4 py-5 sm:px-5 sm:py-6 ${
        plan.isDark
          ? 'border border-black bg-black shadow-[0_8px_18px_rgba(0,0,0,0.10)]'
          : 'border border-slate-200 bg-white/90 backdrop-blur-[2px] shadow-[0_6px_14px_rgba(15,23,42,0.04)]'
      } ${isMobile ? 'min-h-full' : ''}`}
    >
      {plan.isPopular && (
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
          <span className="rounded-full border-[3px] border-black bg-orange-500 px-3 py-1 text-[10px] font-semibold text-white shadow-[0_6px_14px_rgba(249,115,22,0.22)] sm:text-[11px]">
            Popular
          </span>
        </div>
      )}

      <div className={`mb-4 flex items-center justify-between ${plan.isPopular ? 'pt-3' : 'pt-0'}`}>
        <h3 className={`text-sm font-medium ${plan.isDark ? 'text-white' : 'text-slate-900'}`}>
          {plan.name}
        </h3>
      </div>

      <p className={`mb-5 text-sm leading-6 ${plan.isDark ? 'text-white/82' : 'text-slate-700'}`}>
        {plan.description}
      </p>

      <div className="mb-5">
        <div className="flex items-start gap-2">
          <div className="flex items-baseline gap-1">
            <span className={`text-xl ${plan.isDark ? 'text-white' : 'text-slate-900'}`}>$</span>
            <span
              className={`text-[40px] font-semibold leading-none ${
                plan.isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {plan.price}
            </span>
          </div>

          {plan.price > 0 && (
            <p className="pt-1 text-xs leading-4 sm:text-sm sm:leading-5">
              <span className={plan.isDark ? 'text-white' : 'text-black'}>{plan.period}</span>
              <br />
              <span className={plan.isDark ? 'text-white/50' : 'text-black/45'}>
                plus local taxes
              </span>
            </p>
          )}
        </div>
      </div>

      <button
        className={`mb-2.5 w-full rounded-xl py-2.5 text-sm font-semibold transition cursor-pointer ${plan.buttonStyle}`}
      >
        {plan.buttonText}
      </button>

      <p className={`mb-4 text-xs leading-5 sm:text-sm ${plan.isDark ? 'text-white/75' : 'text-black/50'}`}>
        {plan.subtext}
      </p>

      <div className={`mb-4 border-t ${plan.isDark ? 'border-white/10' : 'border-slate-200'}`} />

      <div className="space-y-2.5">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 shrink-0"
            >
              <path
                d="M7.75 14.75a7 7 0 1 0 0-14 7 7 0 0 0 0 14"
                stroke={plan.isDark ? '#F8FAFC' : '#62748e'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m5.65 7.752 1.4 1.4 2.8-2.8"
                stroke={plan.isDark ? '#F8FAFC' : '#62748e'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className={`text-sm leading-6 ${plan.isDark ? 'text-slate-50' : 'text-slate-600'}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PricingSection() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(1)

  const mobilePlans = useMemo(() => {
    const popular = pricingPlans.find((plan) => plan.isPopular)
    const others = pricingPlans.filter((plan) => !plan.isPopular)
    return popular ? [others[0], popular, others[1]].filter(Boolean) : pricingPlans
  }, [])

  useEffect(() => {
    const container = mobileScrollerRef.current
    if (!container) return

    const updateActive = () => {
      const cards = Array.from(container.querySelectorAll<HTMLElement>('[data-pricing-card]'))
      if (!cards.length) return

      const center = container.scrollLeft + container.clientWidth / 2
      let closestIndex = 0
      let closestDistance = Infinity

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2
        const distance = Math.abs(center - cardCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveIndex(closestIndex)
    }

    const centerCard = () => {
      const cards = container.querySelectorAll<HTMLElement>('[data-pricing-card]')
      if (cards.length < 2) return
      const target = cards[1]
      const left = target.offsetLeft - (container.clientWidth - target.clientWidth) / 2
      container.scrollTo({ left, behavior: 'auto' })
      setActiveIndex(1)
    }

    const id = requestAnimationFrame(centerCard)
    container.addEventListener('scroll', updateActive, { passive: true })

    return () => {
      cancelAnimationFrame(id)
      container.removeEventListener('scroll', updateActive)
    }
  }, [])

  const scrollToIndex = (index: number) => {
    const container = mobileScrollerRef.current
    if (!container) return
    const cards = container.querySelectorAll<HTMLElement>('[data-pricing-card]')
    const target = cards[index]
    if (!target) return

    const left = target.offsetLeft - (container.clientWidth - target.clientWidth) / 2
    container.scrollTo({ left, behavior: 'smooth' })
    setActiveIndex(index)
  }

  return (
    <section className="relative overflow-hidden bg-white px-4 py-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <ZellijLineBackground />
      <div className="absolute left-1/2 top-0 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-orange-50/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500 sm:text-xs">
            Trippple Pricing
          </div>

          <h1 className="mb-3 mt-4 text-[34px] font-semibold text-slate-900 sm:text-[40px]">
            {t('pricing.title')}
          </h1>

          <p className="mx-auto max-w-md text-sm text-slate-600 md:text-base/7">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="mx-auto hidden max-w-5xl items-start gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="relative md:hidden">
          <div className="mb-4 flex items-center justify-center gap-2">
            {mobilePlans.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to pricing card ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === index ? 'w-6 bg-orange-500' : 'w-2.5 bg-zinc-300'
                }`}
              />
            ))}
          </div>

          <div
            ref={mobileScrollerRef}
            className="flex gap-4 overflow-x-auto px-[7vw] pt-4 pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {mobilePlans.map((plan) => (
              <div
                key={plan.id}
                data-pricing-card
                className="w-[84vw] max-w-[320px] shrink-0 snap-center"
              >
                <PricingCard plan={plan} isMobile />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
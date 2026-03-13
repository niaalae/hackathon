import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users,
  Calendar,
  DollarSign,
  Camera,
  CheckCircle2,
  Bot,
  MapPinned,
  ShieldCheck,
  UserRoundSearch,
  Sparkles,
  BadgeInfo,
} from 'lucide-react'

type FeatureTab = 'collaboration' | 'booking' | 'information' | 'guide'

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
          <pattern id="zellijRealPatternServices" width="220" height="220" patternUnits="userSpaceOnUse">
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
              <polygon points="124,60 150,68 154,34 138,46" />
              <polygon points="162,74 160,96 190,88 188,70" />
              <polygon points="160,124 150,152 166,146 172,128" />
              <polygon points="96,160 70,152 66,140 82,140" />
              <polygon points="60,124 60,96 30,100 28,120" />
              <polygon points="60,96 66,80 46,60 42,84" />
              <polygon points="96,60 82,80 70,68 84,46" />
              <polygon points="0,0 22,12 28,22 12,28 0,0" />
              <polygon points="0,0 38,0 28,22 22,12" />
              <polygon points="0,0 0,38 22,28 12,22" />
              <polygon points="220,0 198,12 192,22 208,28 220,0" />
              <polygon points="220,0 182,0 192,22 198,12" />
              <polygon points="220,0 220,38 198,28 208,22" />
              <polygon points="0,220 22,208 28,198 12,192 0,220" />
              <polygon points="0,220 38,220 28,198 22,208" />
              <polygon points="0,220 0,182 22,192 12,198" />
              <polygon points="220,220 198,208 192,198 208,192 220,220" />
              <polygon points="220,220 182,220 192,198 198,208" />
              <polygon points="220,220 220,182 198,192 208,198" />
              <polygon points="110,0 124,14 110,22 96,14" />
              <polygon points="84,0 96,14 82,30 68,10" />
              <polygon points="136,0 124,14 138,30 152,10" />
              <polygon points="110,220 124,206 110,198 96,206" />
              <polygon points="84,220 96,206 82,190 68,210" />
              <polygon points="136,220 124,206 138,190 152,210" />
              <polygon points="0,110 14,96 22,110 14,124" />
              <polygon points="0,84 14,96 30,82 10,68" />
              <polygon points="0,136 14,124 30,138 10,152" />
              <polygon points="220,110 206,96 198,110 206,124" />
              <polygon points="220,84 206,96 190,82 210,68" />
              <polygon points="220,136 206,124 190,138 210,152" />
              <line x1="28" y1="22" x2="42" y2="42" />
              <line x1="192" y1="22" x2="178" y2="42" />
              <line x1="28" y1="198" x2="42" y2="178" />
              <line x1="192" y1="198" x2="178" y2="178" />
              <line x1="68" y1="10" x2="54" y2="34" />
              <line x1="152" y1="10" x2="166" y2="34" />
              <line x1="68" y1="210" x2="54" y2="186" />
              <line x1="152" y1="210" x2="166" y2="186" />
              <line x1="10" y1="68" x2="34" y2="54" />
              <line x1="10" y1="152" x2="34" y2="166" />
              <line x1="210" y1="68" x2="186" y2="54" />
              <line x1="210" y1="152" x2="186" y2="166" />
            </g>
          </pattern>

          <radialGradient
            id="leftGlowServices"
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
            id="rightGlowServices"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1280 240) rotate(90) scale(340 420)"
          >
            <stop stopColor="rgba(249,115,22,0.08)" />
            <stop offset="1" stopColor="rgba(249,115,22,0)" />
          </radialGradient>

          <linearGradient id="sectionFadeServices" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="58%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.97)" />
          </linearGradient>
        </defs>

        <rect width="1600" height="1000" fill="url(#zellijRealPatternServices)" />
        <rect width="1600" height="1000" fill="url(#leftGlowServices)" />
        <rect width="1600" height="1000" fill="url(#rightGlowServices)" />
        <rect width="1600" height="1000" fill="url(#sectionFadeServices)" />
      </svg>
    </div>
  )
}

export default function CollaborationSection() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [activeTab, setActiveTab] = useState<FeatureTab>('collaboration')

  const sections = {
    collaboration: {
      badge: t('colab.badge'),
      title: 'Group collaboration',
      subtitle: 'made effortless.',
      desc: 'Keep chats, plans, and trip details in one shared space.',
      activeLabel: t('colab.activeFriends'),
      image: '/assets/images/collaboration_mockup.png',
      topIcon: <Users className="h-4 w-4 text-orange-500" />,
      benefits: [
        {
          icon: <Calendar className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Shared dates',
          desc: 'Coordinate schedules and trip availability with everyone in one place.',
        },
        {
          icon: <DollarSign className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Budget tracking',
          desc: 'Keep spending visible and aligned across the whole group trip.',
        },
        {
          icon: <Camera className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Photo sharing',
          desc: 'Collect memories, trip inspiration, and references in one shared flow.',
        },
        {
          icon: <CheckCircle2 className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Cleaner planning',
          desc: 'Reduce chaos and keep decisions organized without endless chat threads.',
        },
      ],
    },
    booking: {
      badge: 'AI Booking',
      title: 'Trip booking',
      subtitle: 'from one prompt.',
      desc: 'Generate a plan, shortlist stays, and move faster.',
      activeLabel: 'Shortlist ready',
      image:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1400&auto=format&fit=crop',
      topIcon: <Bot className="h-4 w-4 text-orange-500" />,
      benefits: [
        {
          icon: <Bot className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Smart intent',
          desc: 'Understand what the traveler wants before showing the right next actions.',
        },
        {
          icon: <Calendar className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Trip itinerary',
          desc: 'Turn one idea into a clearer structure for the whole trip.',
        },
        {
          icon: <DollarSign className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Booking picks',
          desc: 'Surface better options faster with a premium booking shortlist.',
        },
        {
          icon: <CheckCircle2 className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Fast flow',
          desc: 'Move from prompt to action with less friction and fewer steps.',
        },
      ],
    },
    information: {
      badge: 'Travel Info',
      title: 'Travel answers',
      subtitle: 'in real time.',
      desc: 'Get clear route tips, place info, and useful guidance.',
      activeLabel: 'Live insights',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop',
      topIcon: <BadgeInfo className="h-4 w-4 text-orange-500" />,
      benefits: [
        {
          icon: <MapPinned className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Place guidance',
          desc: 'Help travelers understand where to go and what matters nearby.',
        },
        {
          icon: <ShieldCheck className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Safer choices',
          desc: 'Support better travel decisions with more helpful context.',
        },
        {
          icon: <CheckCircle2 className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Clear answers',
          desc: 'Respond to travel questions with cleaner and more useful guidance.',
        },
        {
          icon: <Camera className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Better discovery',
          desc: 'Make exploring destinations feel easier and more inspiring.',
        },
      ],
    },
    guide: {
      badge: 'Guide Discovery',
      title: 'Local guides',
      subtitle: 'made simple.',
      desc: 'Find trusted local help and better experiences nearby.',
      activeLabel: 'Trusted help',
      image:
        'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1400&auto=format&fit=crop',
      topIcon: <UserRoundSearch className="h-4 w-4 text-orange-500" />,
      benefits: [
        {
          icon: <UserRoundSearch className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Guide search',
          desc: 'Discover local experts faster when travelers need real human support.',
        },
        {
          icon: <MapPinned className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Nearby options',
          desc: 'Surface relevant guide choices based on destination and context.',
        },
        {
          icon: <Users className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Human help',
          desc: 'Blend AI planning with trusted local assistance when needed.',
        },
        {
          icon: <CheckCircle2 className="h-[18px] w-[18px] text-orange-500" />,
          text: 'Trusted picks',
          desc: 'Guide users toward more reliable and higher-quality local experiences.',
        },
      ],
    },
  }

  const current = sections[activeTab]

  return (
    <section
      className="relative z-10 overflow-hidden bg-white py-14 lg:py-18"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <ZellijLineBackground />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_42%)]" />
      <div className="absolute left-1/2 top-0 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-orange-50/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500 sm:text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Trippple Services
          </div>

          <h2 className="mt-4 text-3xl font-light leading-[1.06] tracking-[-0.03em] text-zinc-950 sm:text-4xl lg:text-[44px]">
            Explore the main services
            <br />
            <span className="text-zinc-400">inside Trippple</span>
          </h2>

          <p
            className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base"
            style={{
              fontFamily:
                'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            Planning, booking, travel answers, and local discovery in one premium flow.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('collaboration')}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'collaboration'
                ? 'bg-orange-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.18)]'
                : 'border border-zinc-200 bg-white text-zinc-600'
            }`}
          >
            Collaboration
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('booking')}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'booking'
                ? 'bg-orange-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.18)]'
                : 'border border-zinc-200 bg-white text-zinc-600'
            }`}
          >
            AI Booking
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('information')}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'information'
                ? 'bg-orange-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.18)]'
                : 'border border-zinc-200 bg-white text-zinc-600'
            }`}
          >
            Information
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'guide'
                ? 'bg-orange-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.18)]'
                : 'border border-zinc-200 bg-white text-zinc-600'
            }`}
          >
            Guide Discovery
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-zinc-100/80 bg-white/80 p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)] backdrop-blur-[2px] sm:p-7 lg:rounded-[32px] lg:p-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-orange-100/28 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-orange-100/18 blur-3xl" />
          </div>

          <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="order-2 flex flex-col gap-5 lg:order-1">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-3.5 py-2 text-[11px] font-semibold text-zinc-700 shadow-sm sm:text-xs">
                {current.topIcon}
                {current.badge}
              </div>

              <h2
                className="text-[34px] font-light leading-[1.02] tracking-[-0.03em] text-zinc-950 sm:text-[40px] lg:text-[52px]"
                style={{
                  fontFamily:
                    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                {current.title} <br />
                <span className="text-zinc-400">{current.subtitle}</span>
              </h2>

              <p
                className="max-w-lg text-[15px] leading-7 text-zinc-600 sm:text-[17px]"
                style={{
                  fontFamily:
                    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                }}
              >
                {current.desc}
              </p>

              <ul className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {current.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 shrink-0">
                      {benefit.icon}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {benefit.text}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-600">
                        {benefit.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="absolute left-3 top-3 h-[84%] w-[84%] rounded-[28px] bg-orange-50/80 sm:left-5 sm:top-5 sm:rounded-[34px]" />

              <div className="relative z-10 w-full max-w-[370px]">
                <div className="overflow-hidden rounded-[30px] border-[7px] border-zinc-900 bg-white shadow-2xl sm:rounded-[36px]">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="h-[360px] w-full object-cover sm:h-[430px]"
                  />
                </div>

                <div className="absolute -right-2 top-5 rounded-2xl border border-zinc-100 bg-white px-3 py-2.5 shadow-xl sm:-right-5 sm:top-1/4 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <span className="text-[11px] font-bold text-zinc-800 sm:text-xs">
                      {current.activeLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-orange-100/30 to-transparent blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
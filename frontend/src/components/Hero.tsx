'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'

const travelImages = [
  { id: 1, src: '/assets/places/m3.jpeg', alt: 'Morocco place 1' },
  { id: 2, src: '/assets/places/m4.jpeg', alt: 'Morocco place 2' },
  { id: 3, src: '/assets/places/m5.jpeg', alt: 'Morocco place 3' },
  { id: 4, src: '/assets/places/m6.jpeg', alt: 'Morocco place 4' },
  { id: 5, src: '/assets/places/m7.jpeg', alt: 'Morocco place 5' },
  { id: 6, src: '/assets/places/m3.jpeg', alt: 'Morocco place 6' },
  { id: 7, src: '/assets/places/m4.jpeg', alt: 'Morocco place 7' },
  { id: 8, src: '/assets/places/m5.jpeg', alt: 'Morocco place 8' },
]

const repeatedImages = [...travelImages, ...travelImages]

const featureKeys = [
  'hero.feature1',
  'hero.feature2',
  'hero.feature3',
  'hero.feature4',
  'hero.feature5',
  'hero.feature6',
]

const placeholders = [
  'Coffee in Fez with good wifi...',
  'Je veux un riad à Meknès...',
  'Trip to Tangier 5 days budget 3500dh...',
]

type IntentType =
  | 'dashboard'
  | 'match'
  | 'booking'
  | 'guide'
  | 'collab'
  | 'info'

type PlaceCategory =
  | 'coffee'
  | 'restaurant'
  | 'riad'
  | 'hotel'
  | 'jardin'
  | 'place'
  | 'transport'
  | 'activity'
  | 'trip'
  | 'general'

type PendingIntent = {
  prompt: string
  intent: IntentType
  city: string
  category: PlaceCategory
  durationDays?: number | null
  budgetDh?: number | null
}

type PreferenceForm = {
  budget: string
  atmosphere: string
  vibe: string
  style: string
  wifi: string
  guests: string
  language: string
}

type TripPlan = {
  destination: string
  durationDays: number
  budgetDh: number | null
  mainPlan: {
    title: string
    summary: string
    highlights: string[]
  }
  backupPlan: {
    title: string
    summary: string
    highlights: string[]
  }
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word))
}

function extractCity(prompt: string) {
  const p = normalizeText(prompt)

  if (includesAny(p, ['chefchaouen', 'chaouen'])) return 'Chefchaouen'
  if (includesAny(p, ['marrakech'])) return 'Marrakech'
  if (includesAny(p, ['casablanca'])) return 'Casablanca'
  if (includesAny(p, ['meknes', 'meknes'])) return 'Meknes'
  if (includesAny(p, ['ifrane'])) return 'Ifrane'
  if (includesAny(p, ['azrou'])) return 'Azrou'
  if (includesAny(p, ['rabat'])) return 'Rabat'
  if (includesAny(p, ['tanger', 'tangier'])) return 'Tangier'
  if (includesAny(p, ['fes', 'fez'])) return 'Fez'

  return 'Morocco'
}

function extractCategory(prompt: string): PlaceCategory {
  const p = normalizeText(prompt)

  if (includesAny(p, ['coffee', 'cafe', 'café', 'cafeteria', 'coffee shop', 'coffeeshop'])) {
    return 'coffee'
  }

  if (includesAny(p, ['restaurant', 'food', 'eat', 'dinner', 'lunch', 'dejeuner', 'dejuner', 'manger'])) {
    return 'restaurant'
  }

  if (includesAny(p, ['riad', 'riad traditionnel', 'traditional riad'])) {
    return 'riad'
  }

  if (includesAny(p, ['hotel', 'hôtel'])) {
    return 'hotel'
  }

  if (includesAny(p, ['jardin', 'garden', 'park', 'parc'])) {
    return 'jardin'
  }

  if (includesAny(p, ['transport', 'taxi', 'train', 'bus'])) {
    return 'transport'
  }

  if (includesAny(p, ['activity', 'activities', 'experience', 'experiences', 'activite', 'activites'])) {
    return 'activity'
  }

  if (
    includesAny(p, [
      'trip',
      'voyage',
      'sejour',
      'séjour',
      'itinerary',
      'itinerarie',
      'plan my trip',
      'travel plan',
      'organise mon voyage',
      'organiser mon voyage',
    ])
  ) {
    return 'trip'
  }

  if (includesAny(p, ['place', 'spot', 'visit', 'lieu', 'endroit'])) {
    return 'place'
  }

  return 'general'
}

function extractBudgetDh(prompt: string) {
  const p = normalizeText(prompt)

  const budgetMatch =
    p.match(/(\d{3,6})\s*(dh|mad)/i) ||
    p.match(/budget\s*(de)?\s*(\d{3,6})/i) ||
    p.match(/budget\s*(\d{3,6})/i)

  if (!budgetMatch) return null

  const rawNumber = budgetMatch.find((part) => /\d{3,6}/.test(part))
  return rawNumber ? Number(rawNumber) : null
}

function extractDurationDays(prompt: string) {
  const p = normalizeText(prompt)

  const englishMatch = p.match(/(\d+)\s*(day|days)/i)
  const frenchMatch = p.match(/(\d+)\s*(jour|jours)/i)

  if (englishMatch) return Number(englishMatch[1])
  if (frenchMatch) return Number(frenchMatch[1])

  return null
}

function buildTripPlan(destination: string, durationDays: number, budgetDh: number | null): TripPlan {
  const budgetLabel = budgetDh ? `${budgetDh} MAD` : 'flexible budget'

  return {
    destination,
    durationDays,
    budgetDh,
    mainPlan: {
      title: `${destination} Smart Trip`,
      summary: `${durationDays}-day main trip focused on the best balance of culture, food, and efficient spending with a target budget of ${budgetLabel}.`,
      highlights: [
        'Priority places based on user prompt',
        'Balanced daily rhythm with must-see stops',
        'Recommended stay and food anchors',
      ],
    },
    backupPlan: {
      title: `${destination} Backup Trip`,
      summary: `Alternative version of the ${durationDays}-day trip with lighter pacing and backup choices in case the user rejects some references.`,
      highlights: [
        'Backup stay option',
        'Backup activity set',
        'Lower-risk alternative schedule',
      ],
    },
  }
}

function getDemoPrompts(intent: IntentType, category: PlaceCategory, city: string) {
  if (intent === 'match' && category === 'coffee') {
    return [
      `Coffee in ${city} with wifi`,
      `Café calme à ${city}`,
      `Best local coffee spot in ${city}`,
    ]
  }

  if (intent === 'match' && (category === 'hotel' || category === 'riad')) {
    return [
      `Riad in ${city} for 2 travelers`,
      `Hotel in ${city} budget mid-range`,
      `Je veux un riad authentique à ${city}`,
    ]
  }

  if (intent === 'match' && category === 'jardin') {
    return [
      `Best jardin in ${city}`,
      `Quiet garden in ${city}`,
      `Jardin calme à ${city}`,
    ]
  }

  if (intent === 'dashboard') {
    return [
      `Trip to ${city} 5 days budget 3500dh`,
      `Je veux un voyage à ${city} 4 jours budget 3000 dh`,
      `Plan my trip to ${city}`,
    ]
  }

  if (intent === 'guide') {
    return [
      `Guide in ${city}`,
      `French speaking guide in ${city}`,
      `Guide local à ${city}`,
    ]
  }

  if (intent === 'collab') {
    return [
      `Travel buddies in ${city}`,
      `People to hang out with in ${city}`,
      `Je cherche des voyageurs à ${city}`,
    ]
  }

  if (intent === 'info') {
    return [
      `Tell me about ${city}`,
      `History of ${city}`,
      `Infos sur ${city}`,
    ]
  }

  return [
    `Best places in ${city}`,
    `What to do in ${city}`,
    `Bonnes adresses à ${city}`,
  ]
}

function detectIntent(prompt: string): IntentType {
  const p = normalizeText(prompt)

  const isGuide = includesAny(p, [
    'guide',
    'local guide',
    'tour guide',
    'guide local',
    'guide touristique',
  ])

  const isCollab = includesAny(p, [
    'collab',
    'hangout',
    'hang out',
    'buddy',
    'buddies',
    'group',
    'travelers',
    'travellers',
    'people to join',
    'join trip',
    'meet people',
    'voyageurs',
    'groupe',
    'rencontrer des gens',
    'sortir avec',
  ])

  const isInfo = includesAny(p, [
    'tell me about',
    'history',
    'what is',
    'info',
    'information',
    'describe',
    'explain',
    'parle moi de',
    'parlez moi de',
    'histoire de',
    'c est quoi',
    'c quoi',
    'infos sur',
    'information sur',
  ])

  const isBooking = includesAny(p, [
    'book',
    'booking',
    'reserve',
    'reservation',
    'stay in',
    'book me',
    'reserver',
    'réserver',
    'reservation hotel',
    'reservation riad',
  ])

  const isPlaceMatch = includesAny(p, [
    'coffee',
    'cafe',
    'café',
    'restaurant',
    'riad',
    'hotel',
    'hôtel',
    'jardin',
    'garden',
    'park',
    'parc',
    'place',
    'spot',
    'rooftop',
    'brunch',
    'endroit',
    'lieu',
  ])

  const isTripPlanning = includesAny(p, [
    'trip',
    'voyage',
    'sejour',
    'séjour',
    'plan my trip',
    'travel plan',
    'itinerary',
    'itineraire',
    'itinéraire',
    '5 days',
    '4 days',
    '6 days',
    'jours',
    'day trip',
    'budget',
  ])

  if (isGuide) return 'guide'
  if (isCollab) return 'collab'
  if (isInfo) return 'info'
  if (isBooking) return 'booking'
  if (isPlaceMatch) return 'match'
  if (isTripPlanning) return 'dashboard'
  return 'dashboard'
}

function getRouteByIntent(intent: IntentType) {
  switch (intent) {
    case 'match':
      return '/user/match'
    case 'booking':
      return '/user/booking'
    case 'guide':
      return '/user/guides'
    case 'collab':
      return '/user/collab'
    case 'info':
      return '/user/explore-info'
    default:
      return '/user/dashboard'
  }
}

function needsPreferences(intent: IntentType) {
  return intent === 'match' || intent === 'booking' || intent === 'guide' || intent === 'collab'
}

function ImageCard({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className: string
}) {
  const [hasError, setHasError] = useState(false)

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-[18px] bg-white shadow-[0_8px_28px_rgba(24,24,27,0.10)] sm:rounded-[22px] ${className}`}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover object-center"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 via-white to-orange-100">
          <span className="px-3 text-center text-[10px] font-semibold text-zinc-500 sm:text-xs">
            {alt}
          </span>
        </div>
      )}
    </div>
  )
}

function TypePlaceholder() {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    let typingTimeout: number | undefined
    let fadeTimeout: number | undefined
    let resetTimeout: number | undefined

    const fullText = placeholders[index]

    if (text.length < fullText.length) {
      typingTimeout = window.setTimeout(() => {
        setText(fullText.slice(0, text.length + 1))
      }, 38)
    } else {
      fadeTimeout = window.setTimeout(() => {
        setIsFading(true)
        resetTimeout = window.setTimeout(() => {
          setIsFading(false)
          setText('')
          setIndex((prev) => (prev + 1) % placeholders.length)
        }, 520)
      }, 1200)
    }

    return () => {
      if (typingTimeout) window.clearTimeout(typingTimeout)
      if (fadeTimeout) window.clearTimeout(fadeTimeout)
      if (resetTimeout) window.clearTimeout(resetTimeout)
    }
  }, [index, text])

  return (
    <span
      className="pointer-events-none select-none text-zinc-400 transition-opacity duration-500 ease-out"
      style={{ opacity: isFading ? 0 : 1 }}
    >
      {text}
      <span className="inline-block h-4 w-[1px] translate-y-[1px] animate-pulse bg-zinc-300/70" />
    </span>
  )
}

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
          <pattern id="zellijRealPattern" width="220" height="220" patternUnits="userSpaceOnUse">
            <g stroke="rgba(37,99,235,0.26)" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
            id="leftGlow"
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
            id="rightGlow"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1280 240) rotate(90) scale(340 420)"
          >
            <stop stopColor="rgba(249,115,22,0.08)" />
            <stop offset="1" stopColor="rgba(249,115,22,0)" />
          </radialGradient>

          <linearGradient id="heroFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="58%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.97)" />
          </linearGradient>
        </defs>

        <rect width="1600" height="1000" fill="url(#zellijRealPattern)" />
        <rect width="1600" height="1000" fill="url(#leftGlow)" />
        <rect width="1600" height="1000" fill="url(#rightGlow)" />
        <rect width="1600" height="1000" fill="url(#heroFade)" />
      </svg>
    </div>
  )
}

function IntentPopup({
  open,
  pendingIntent,
  form,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean
  pendingIntent: PendingIntent | null
  form: PreferenceForm
  onClose: () => void
  onChange: (field: keyof PreferenceForm, value: string) => void
  onSubmit: () => void
}) {
  const fields = useMemo(() => {
    if (!pendingIntent) return []

    if (pendingIntent.intent === 'match') {
      if (pendingIntent.category === 'coffee') return ['budget', 'atmosphere', 'wifi']
      if (pendingIntent.category === 'restaurant') return ['budget', 'atmosphere']
      if (pendingIntent.category === 'riad' || pendingIntent.category === 'hotel') {
        return ['budget', 'guests', 'style']
      }
      if (pendingIntent.category === 'jardin') return ['atmosphere']
      return ['budget', 'atmosphere']
    }

    if (pendingIntent.intent === 'booking') return ['budget', 'guests', 'style']
    if (pendingIntent.intent === 'guide') return ['language', 'budget']
    if (pendingIntent.intent === 'collab') return ['vibe', 'budget']

    return []
  }, [pendingIntent])

  if (!open || !pendingIntent) return null

  const subtitle =
    pendingIntent.intent === 'match'
      ? `We’ll refine your ${pendingIntent.category} options in ${pendingIntent.city}.`
      : pendingIntent.intent === 'booking'
        ? `We’ll personalize stays in ${pendingIntent.city}.`
        : pendingIntent.intent === 'guide'
          ? `We’ll match you with guides in ${pendingIntent.city}.`
          : `We’ll find the right people around ${pendingIntent.city}.`

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#f8f3ee]/75 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-[28px] border border-orange-100/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-100 blur-3xl" />
        <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-sky-100 blur-3xl" />

        <div className="relative z-10 border-b border-zinc-100 px-6 py-5 sm:px-7">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:text-zinc-900"
          >
            <X className="h-4 w-4" />
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
            Smart routing
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
            A few preferences first
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{subtitle}</p>
        </div>

        <div className="relative z-10 grid gap-4 px-6 py-6 sm:px-7">
          {fields.includes('budget') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">Budget range</label>
              <select
                value={form.budget}
                onChange={(e) => onChange('budget', e.target.value)}
                className="h-[50px] w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300"
              >
                <option value="">Select budget</option>
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-range</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          )}

          {fields.includes('atmosphere') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">Atmosphere</label>
              <select
                value={form.atmosphere}
                onChange={(e) => onChange('atmosphere', e.target.value)}
                className="h-[50px] w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300"
              >
                <option value="">Choose atmosphere</option>
                <option value="cozy">Cozy</option>
                <option value="quiet">Quiet</option>
                <option value="social">Social</option>
                <option value="rooftop">Rooftop</option>
                <option value="local">Local</option>
              </select>
            </div>
          )}

          {fields.includes('wifi') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">Wi-Fi needed</label>
              <select
                value={form.wifi}
                onChange={(e) => onChange('wifi', e.target.value)}
                className="h-[50px] w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300"
              >
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          )}

          {fields.includes('style') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">Style</label>
              <select
                value={form.style}
                onChange={(e) => onChange('style', e.target.value)}
                className="h-[50px] w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300"
              >
                <option value="">Choose style</option>
                <option value="authentic">Authentic</option>
                <option value="budget">Budget</option>
                <option value="premium">Premium</option>
                <option value="romantic">Romantic</option>
                <option value="family">Family</option>
              </select>
            </div>
          )}

          {fields.includes('guests') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">Travelers</label>
              <select
                value={form.guests}
                onChange={(e) => onChange('guests', e.target.value)}
                className="h-[50px] w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300"
              >
                <option value="">Select travelers</option>
                <option value="1">1 traveler</option>
                <option value="2">2 travelers</option>
                <option value="3-4">3–4 travelers</option>
                <option value="5+">5+ travelers</option>
              </select>
            </div>
          )}

          {fields.includes('language') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">Guide language</label>
              <select
                value={form.language}
                onChange={(e) => onChange('language', e.target.value)}
                className="h-[50px] w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300"
              >
                <option value="">Select language</option>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="arabic">Arabic</option>
                <option value="spanish">Spanish</option>
              </select>
            </div>
          )}

          {fields.includes('vibe') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">Trip vibe</label>
              <select
                value={form.vibe}
                onChange={(e) => onChange('vibe', e.target.value)}
                className="h-[50px] w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300"
              >
                <option value="">Choose vibe</option>
                <option value="relaxed">Relaxed</option>
                <option value="adventure">Adventure</option>
                <option value="culture">Culture</option>
                <option value="foodie">Foodie</option>
                <option value="social">Social</option>
              </select>
            </div>
          )}

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={onClose}
              className="flex h-[52px] flex-1 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Continue
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [pendingIntent, setPendingIntent] = useState<PendingIntent | null>(null)
  const [form, setForm] = useState<PreferenceForm>({
    budget: '',
    atmosphere: '',
    vibe: '',
    style: '',
    wifi: '',
    guests: '',
    language: '',
  })

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const resetForm = () => {
    setForm({
      budget: '',
      atmosphere: '',
      vibe: '',
      style: '',
      wifi: '',
      guests: '',
      language: '',
    })
  }

  const savePromptContext = (payload: {
    prompt: string
    intent: IntentType
    city: string
    category: PlaceCategory
    preferences?: PreferenceForm
    durationDays?: number | null
    budgetDh?: number | null
    demoPrompts: string[]
    matchTargetCount?: number
    tripPlan?: TripPlan | null
  }) => {
    sessionStorage.setItem('heroPromptContext', JSON.stringify(payload))
  }

  const goToIntentRoute = (intent: IntentType) => {
    navigate(getRouteByIntent(intent))
  }

  const handleIntentNavigation = (trimmed: string) => {
    const intent = detectIntent(trimmed)
    const city = extractCity(trimmed)
    const category = extractCategory(trimmed)
    const durationDays = extractDurationDays(trimmed)
    const budgetDh = extractBudgetDh(trimmed)

    const context: PendingIntent = {
      prompt: trimmed,
      intent,
      city,
      category,
      durationDays,
      budgetDh,
    }

    if (needsPreferences(intent)) {
      setPendingIntent(context)
      setPopupOpen(true)
      return
    }

    const tripPlan =
      intent === 'dashboard'
        ? buildTripPlan(city, durationDays ?? 5, budgetDh)
        : null

    savePromptContext({
      prompt: trimmed,
      intent,
      city,
      category,
      durationDays,
      budgetDh,
      demoPrompts: getDemoPrompts(intent, category, city),
      matchTargetCount: intent === 'match' ? 10 : undefined,
      tripPlan,
    })

    setIsLoading(true)

    window.setTimeout(() => {
      goToIntentRoute(intent)
      setIsLoading(false)
      setQuery('')
    }, 900)
  }

  const handleSubmit = () => {
    const trimmed = query.trim()
    if (!trimmed || isLoading) return

    if (!user) {
      navigate('/login')
      return
    }

    handleIntentNavigation(trimmed)
  }

  const handlePopupClose = () => {
    setPopupOpen(false)
    setPendingIntent(null)
    resetForm()
  }

  const handlePopupSubmit = () => {
    if (!pendingIntent) return

    const tripPlan =
      pendingIntent.intent === 'dashboard'
        ? buildTripPlan(
            pendingIntent.city,
            pendingIntent.durationDays ?? 5,
            pendingIntent.budgetDh,
          )
        : null

    savePromptContext({
      prompt: pendingIntent.prompt,
      intent: pendingIntent.intent,
      city: pendingIntent.city,
      category: pendingIntent.category,
      preferences: form,
      durationDays: pendingIntent.durationDays,
      budgetDh: pendingIntent.budgetDh,
      demoPrompts: getDemoPrompts(
        pendingIntent.intent,
        pendingIntent.category,
        pendingIntent.city,
      ),
      matchTargetCount: pendingIntent.intent === 'match' ? 10 : undefined,
      tripPlan,
    })

    setPopupOpen(false)
    setIsLoading(true)

    window.setTimeout(() => {
      goToIntentRoute(pendingIntent.intent)
      setIsLoading(false)
      setQuery('')
      setPendingIntent(null)
      resetForm()
    }, 950)
  }

  return (
    <>
      <section className="relative overflow-hidden bg-white pt-[92px] sm:pt-[96px] lg:pt-[104px]">
        <ZellijLineBackground />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_42%)]" />
        <div className="absolute left-1/2 top-0 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-orange-50/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-3 sm:px-4 lg:px-6">
          <div className="relative overflow-visible bg-transparent px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-10 lg:pb-24 lg:pt-14">
            <div className="relative mx-auto flex min-h-[760px] max-w-[1120px] flex-col items-center text-center sm:min-h-[780px] lg:min-h-[820px] xl:min-h-[860px]">
              <h1 className="mx-auto mt-2 max-w-[920px] text-[36px] font-semibold leading-[0.96] tracking-[-0.05em] text-zinc-950 sm:mt-4 sm:text-[52px] lg:mt-6 lg:text-[72px] xl:text-[80px]">
                <span className="block">
                  {t('hero.title1')}{' '}
                  <span
                    className="inline-block text-orange-500"
                    style={{
                      fontFamily: '"Dancing Script", cursive',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {t('hero.title2')}
                  </span>
                </span>
                <span className="block">{t('hero.title3')}</span>
              </h1>

              <p
                className="mx-auto mt-5 max-w-[760px] px-2 text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8 lg:mt-6 lg:text-[16px]"
                style={{
                  fontFamily:
                    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                }}
              >
                {t('hero.description')}
              </p>

              <div className="mt-8 w-full max-w-[640px] px-1 sm:px-0">
                <div className="flex flex-col gap-2.5 sm:hidden">
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') handleSubmit()
                      }}
                      className="h-[54px] w-full rounded-2xl border border-zinc-200 bg-white px-5 text-base text-zinc-800 shadow-sm outline-none transition-all duration-200 focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                    />
                    {!query && (
                      <div className="pointer-events-none absolute inset-0 flex items-center px-5">
                        <TypePlaceholder />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-sm font-semibold text-white transition duration-200 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? 'Loading...' : t('hero.cta')}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </div>

                <div className="hidden w-full items-center gap-2 rounded-full border border-zinc-200 bg-white p-2 shadow-[0_8px_30px_rgba(24,24,27,0.08)] transition-all duration-200 focus-within:border-orange-300 focus-within:shadow-[0_8px_30px_rgba(249,115,22,0.10)] sm:flex">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') handleSubmit()
                      }}
                      className="h-[52px] w-full bg-transparent pl-5 text-base text-zinc-800 outline-none sm:text-[15px]"
                    />
                    {!query && (
                      <div className="pointer-events-none absolute inset-0 flex items-center pl-5">
                        <TypePlaceholder />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(24,24,27,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? 'Loading...' : t('hero.cta')}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-10 grid w-full max-w-[980px] grid-cols-2 gap-y-4 text-zinc-400 sm:mt-12 sm:grid-cols-3 lg:mt-14 lg:grid-cols-6">
                {featureKeys.map((item) => (
                  <div
                    key={item}
                    className="text-center text-xs font-semibold tracking-tight sm:text-sm"
                  >
                    {t(item)}
                  </div>
                ))}
              </div>

              <div className="relative mt-10 w-full overflow-x-hidden overflow-y-visible pb-8 sm:mt-12 sm:pb-10 lg:mt-14 lg:pb-12">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20" />

                <div className="hero-marquee flex w-max items-center gap-4 px-3 sm:gap-5 sm:px-4">
                  {repeatedImages.map((image, index) => (
                    <ImageCard
                      key={`${image.id}-${index}`}
                      src={image.src}
                      alt={image.alt}
                      className={
                        index % 4 === 0
                          ? 'h-[126px] w-[110px] sm:h-[170px] sm:w-[130px] lg:h-[200px] lg:w-[150px]'
                          : index % 4 === 1
                            ? 'h-[126px] w-[160px] sm:h-[170px] sm:w-[190px] lg:h-[200px] lg:w-[220px]'
                            : index % 4 === 2
                              ? 'h-[126px] w-[140px] sm:h-[170px] sm:w-[170px] lg:h-[200px] lg:w-[200px]'
                              : 'h-[126px] w-[120px] sm:h-[170px] sm:w-[145px] lg:h-[200px] lg:w-[165px]'
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-[#f8f3ee]/80 backdrop-blur-md">
            <div className="relative w-[320px] overflow-hidden rounded-[28px] border border-orange-100/70 bg-white px-7 py-8 text-center shadow-[0_30px_80px_rgba(249,115,22,0.18)]">
              <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-orange-200/40 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-amber-200/50 blur-2xl" />
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111827] text-white shadow-[0_12px_26px_rgba(15,23,42,0.28)]">
                <ArrowRight className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-zinc-900">Preparing your experience</p>
              <p className="mt-2 text-xs text-zinc-500">Routing you to the best travel flow</p>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-orange-100">
                <div className="hero-loader h-full w-1/2 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300" />
              </div>
            </div>
          </div>
        )}

        <IntentPopup
          open={popupOpen}
          pendingIntent={pendingIntent}
          form={form}
          onClose={handlePopupClose}
          onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handlePopupSubmit}
        />

        <style>{`
          .hero-marquee {
            animation: heroMarquee 35s linear infinite;
            will-change: transform;
          }

          .hero-marquee:hover {
            animation-play-state: paused;
          }

          @keyframes heroMarquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .hero-loader {
            animation: heroLoader 1.1s ease-in-out infinite;
          }

          @keyframes heroLoader {
            0% {
              transform: translateX(-20%);
              width: 35%;
            }
            50% {
              transform: translateX(20%);
              width: 70%;
            }
            100% {
              transform: translateX(-20%);
              width: 35%;
            }
          }
        `}</style>
      </section>
    </>
  )
}
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Coffee,
  Compass,
  Hotel,
  MapPin,
  Route,
  Sparkles,
  Utensils,
  Wallet,
  Camera,
  RefreshCcw,
  X,
  Users,
} from 'lucide-react'
import PLACE_DATA, { type PlaceItem } from '@/data/dummyData'

type TripStopType = 'hotel' | 'cafe' | 'activity' | 'restaurant'

type TripStop = {
  id: string
  name: string
  type: TripStopType
  time: string
  description: string
  image: string
  mapUrl: string
  price?: string
}

type TripDay = {
  day: number
  title: string
  summary: string
  area: string
  hotel: TripStop
  stops: TripStop[]
}

type TripPlan = {
  city: 'Fez' | 'Meknes'
  durationDays: number
  budgetDh: number | null
  title: string
  subtitle: string
  coverImage: string
  totalEstimate: string
  tags: string[]
  days: TripDay[]
}

type HeroPromptContext = {
  prompt?: string
  city?: string
  durationDays?: number | null
  budgetDh?: number | null
}

type PartialSelection = {
  hotel: boolean
  cafe: boolean
  activity: boolean
  restaurant: boolean
}

type GroupRecommendation = {
  id: string
  name: string
  vibe: string
  members: number
  match: string
  city: string
}

type Quest = {
  id: string
  title: string
  description: string
  progress: number
  goal: number
  reward: number
  tag: string
  location: string
}

type LeaderboardEntry = {
  id: string
  name: string
  points: number
  avatar: string
  trend: string
}

const FEZ_IMAGES = {
  cover:
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80',
  medina:
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  riad:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  cafe:
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  food:
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
}

const MEKNES_IMAGES = {
  cover:
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1400&q=80',
  medina:
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
  riad:
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
  cafe:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  food:
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function extractCity(prompt: string): 'Fez' | 'Meknes' {
  const p = normalizeText(prompt)
  if (p.includes('meknes')) return 'Meknes'
  return 'Fez'
}

function extractDurationDays(prompt: string) {
  const p = normalizeText(prompt)
  const english = p.match(/(\d+)\s*(day|days)/i)
  const french = p.match(/(\d+)\s*(jour|jours)/i)
  if (english) return Number(english[1])
  if (french) return Number(french[1])
  return 3
}

function extractBudgetDh(prompt: string) {
  const p = normalizeText(prompt)
  const match =
    p.match(/(\d{3,6})\s*(dh|mad)/i) ||
    p.match(/budget\s*(de)?\s*(\d{3,6})/i) ||
    p.match(/budget\s*(\d{3,6})/i)

  if (!match) return null
  const raw = match.find((part) => /\d{3,6}/.test(part))
  return raw ? Number(raw) : null
}

function getStopIcon(type: TripStopType) {
  switch (type) {
    case 'hotel':
      return <Hotel className='h-4 w-4' />
    case 'cafe':
      return <Coffee className='h-4 w-4' />
    case 'restaurant':
      return <Utensils className='h-4 w-4' />
    default:
      return <Camera className='h-4 w-4' />
  }
}

function getCityImages(city: 'Fez' | 'Meknes') {
  return city === 'Fez' ? FEZ_IMAGES : MEKNES_IMAGES
}

function buildMapUrl(place: PlaceItem) {
  if (place.latitude && place.longitude) {
    return `https://www.google.com/maps?q=${place.latitude},${place.longitude}`
  }

  const query = encodeURIComponent(`${place.name}, ${place.address}, ${place.city}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

function formatCityLabel(city: 'Fez' | 'Meknes') {
  return city === 'Fez' ? 'Fès' : 'Meknès'
}

function normalizeCityName(city: string): 'Fez' | 'Meknes' | null {
  const value = normalizeText(city)
  if (value.includes('fes') || value.includes('fez')) return 'Fez'
  if (value.includes('meknes')) return 'Meknes'
  return null
}

function toTripStopType(place: PlaceItem): TripStopType {
  if (place.type === 'hotel') return 'hotel'
  if (place.type === 'cafe') return 'cafe'
  if (place.type === 'restaurant') return 'restaurant'
  return 'activity'
}

function getPlaceImage(place: PlaceItem, city: 'Fez' | 'Meknes', type: TripStopType) {
  const q = encodeURIComponent(`${place.name} ${place.city} morocco ${type}`)
  const cityImages = getCityImages(city)

  if (type === 'hotel') {
    if (place.id.startsWith('FE_016')) return 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80'
    if (place.id.startsWith('FE_017')) return 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80'
    if (place.id.startsWith('MK_011')) return 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80'
    return `https://source.unsplash.com/900x700/?${q},riad,hotel`
  }

  if (type === 'cafe') {
    if (place.id.startsWith('FE_014')) return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80'
    if (place.id.startsWith('MK_010')) return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'
    return `https://source.unsplash.com/900x700/?${q},cafe,coffee`
  }

  if (type === 'restaurant') {
    if (place.id.startsWith('FE_011')) return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    if (place.id.startsWith('MK_008')) return 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80'
    return `https://source.unsplash.com/900x700/?${q},restaurant,food`
  }

  if (place.id.startsWith('FE_001') || place.id.startsWith('MK_001')) return cityImages.medina
  return `https://source.unsplash.com/900x700/?${q},morocco,architecture,travel`
}

function toTripStop(
  place: PlaceItem,
  city: 'Fez' | 'Meknes',
  time: string,
  forcedType?: TripStopType,
): TripStop {
  const stopType = forcedType ?? toTripStopType(place)

  return {
    id: place.id,
    name: place.name,
    type: stopType,
    time,
    description: place.description,
    image: getPlaceImage(place, city, stopType),
    mapUrl: buildMapUrl(place),
    price: place.price_range || undefined,
  }
}

function getPlacesByCity(city: 'Fez' | 'Meknes') {
  const filtered = PLACE_DATA.filter((place) => normalizeCityName(place.city) === city)
  const sortByRating = (a: PlaceItem, b: PlaceItem) => b.rating - a.rating

  return {
    hotels: filtered.filter((p) => p.type === 'hotel').sort(sortByRating),
    cafes: filtered.filter((p) => p.type === 'cafe').sort(sortByRating),
    restaurants: filtered.filter((p) => p.type === 'restaurant').sort(sortByRating),
    activities: filtered
      .filter((p) => !['hotel', 'cafe', 'restaurant'].includes(p.type))
      .sort(sortByRating),
  }
}

function pickFromPool<T>(pool: T[], index: number): T {
  return pool[index % pool.length]
}

function createPlanFromDummyData(
  city: 'Fez' | 'Meknes',
  days: number,
  budgetDh: number | null,
  variant: 'main' | 'backup',
): TripPlan {
  const safeDays = Math.max(2, Math.min(days, 5))
  const cityData = getPlacesByCity(city)
  const cityImages = getCityImages(city)

  const fallbackHotel: PlaceItem = {
    id: `${city}-fallback-hotel`,
    name: city === 'Fez' ? 'Riad Stay' : 'Central Stay',
    type: 'hotel',
    city: formatCityLabel(city),
    province: '',
    region: 'Fès-Meknès',
    description: 'Comfortable stay in a central location.',
    address: city === 'Fez' ? 'Médina de Fès' : 'Centre de Meknès',
    rating: 4.2,
    price_range: 'From 700 DH/night',
    opening_hours: '24h/24',
    latitude: 0,
    longitude: 0,
    categories: [],
    website: '',
  }

  const fallbackCafe: PlaceItem = {
    id: `${city}-fallback-cafe`,
    name: city === 'Fez' ? 'Medina Café Stop' : 'Old City Café',
    type: 'cafe',
    city: formatCityLabel(city),
    province: '',
    region: 'Fès-Meknès',
    description: 'A relaxed café stop to balance the route.',
    address: city === 'Fez' ? 'Médina de Fès' : 'Médina de Meknès',
    rating: 4.0,
    price_range: '40-80 DH',
    opening_hours: '9h-22h',
    latitude: 0,
    longitude: 0,
    categories: [],
    website: '',
  }

  const fallbackRestaurant: PlaceItem = {
    id: `${city}-fallback-restaurant`,
    name: city === 'Fez' ? 'Traditional Fassi Table' : 'Traditional Meknassi Table',
    type: 'restaurant',
    city: formatCityLabel(city),
    province: '',
    region: 'Fès-Meknès',
    description: 'A reliable restaurant stop with local flavor.',
    address: city === 'Fez' ? 'Fès' : 'Meknès',
    rating: 4.1,
    price_range: '120-220 DH',
    opening_hours: '12h-22h',
    latitude: 0,
    longitude: 0,
    categories: [],
    website: '',
  }

  const fallbackActivity: PlaceItem = {
    id: `${city}-fallback-activity`,
    name: city === 'Fez' ? 'Historic Medina Walk' : 'Imperial Walk',
    type: 'attraction',
    city: formatCityLabel(city),
    province: '',
    region: 'Fès-Meknès',
    description: 'A flexible cultural route through the city.',
    address: city === 'Fez' ? 'Médina de Fès' : 'Médina de Meknès',
    rating: 4.1,
    price_range: 'Accès libre',
    opening_hours: '24h/24',
    latitude: 0,
    longitude: 0,
    categories: [],
    website: '',
  }

  const hotels = cityData.hotels.length ? cityData.hotels : [fallbackHotel]
  const cafes = cityData.cafes.length ? cityData.cafes : [fallbackCafe]
  const restaurants = cityData.restaurants.length ? cityData.restaurants : [fallbackRestaurant]
  const activities = cityData.activities.length ? cityData.activities : [fallbackActivity]

  const mainDayTitles =
    city === 'Fez'
      ? [
          'Arrival & Medina Start',
          'Crafts & Rooftop Rhythm',
          'Modern Fes Finale',
          'Extra Discovery Day',
          'Flexible Premium Finish',
        ]
      : [
          'Imperial Arrival',
          'Heritage & Slow Food',
          'Modern Finale',
          'Extra Imperial Route',
          'Flexible Final Day',
        ]

  const backupDayTitles =
    city === 'Fez'
      ? [
          'Relaxed Medina Route',
          'Culture Alternative',
          'Flexible Last Day',
          'Backup Discovery Day',
          'Soft Final Flow',
        ]
      : [
          'Soft Imperial Start',
          'Backup Heritage Day',
          'Easy Final Day',
          'Backup City Route',
          'Relaxed Last Flow',
        ]

  const mainSummary =
    city === 'Fez'
      ? 'Premium structured trip with hotels, cafés, food, and activities.'
      : 'Structured Meknes itinerary with food, cafés, stays, and monuments.'

  const backupSummary =
    city === 'Fez'
      ? 'Alternative softer route with simpler pacing and backup options.'
      : 'Alternative relaxed route with simpler pacing.'

  const daysData: TripDay[] = Array.from({ length: safeDays }, (_, index) => {
    const dayNumber = index + 1
    const hotel = pickFromPool(hotels, index)
    const cafe = pickFromPool(cafes, index)
    const restaurant = pickFromPool(restaurants, index)
    const activityA = pickFromPool(activities, index * 2)
    const activityB = pickFromPool(activities, index * 2 + 1)

    const stops =
      variant === 'main'
        ? [
            toTripStop(activityA, city, '10:00', 'activity'),
            toTripStop(cafe, city, '11:30', 'cafe'),
            toTripStop(activityB, city, '13:00', 'activity'),
            toTripStop(restaurant, city, '14:30', 'restaurant'),
          ]
        : [
            toTripStop(activityA, city, '11:00', 'activity'),
            toTripStop(cafe, city, '12:30', 'cafe'),
            toTripStop(restaurant, city, '14:00', 'restaurant'),
          ]

    return {
      day: dayNumber,
      title:
        variant === 'main'
          ? mainDayTitles[index] ?? `Day ${dayNumber}`
          : backupDayTitles[index] ?? `Day ${dayNumber}`,
      summary:
        variant === 'main'
          ? `${mainSummary} Built from dummy regional places data.`
          : `${backupSummary} Built from dummy regional places data.`,
      area: city === 'Fez' ? 'Fes el-Bali' : 'Historic Meknes',
      hotel: toTripStop(hotel, city, variant === 'main' ? 'Check-in' : 'Stay', 'hotel'),
      stops,
    }
  })

  const estimate = budgetDh
    ? `~ ${budgetDh.toLocaleString()} MAD`
    : variant === 'main'
      ? city === 'Fez'
        ? `${safeDays * 1250}–${safeDays * 1850} MAD`
        : `${safeDays * 950}–${safeDays * 1500} MAD`
      : city === 'Fez'
        ? `${safeDays * 1050}–${safeDays * 1550} MAD`
        : `${safeDays * 850}–${safeDays * 1350} MAD`

  return {
    city,
    durationDays: safeDays,
    budgetDh,
    title:
      variant === 'main'
        ? `Smart ${safeDays}-Day ${city} Road`
        : `Backup ${safeDays}-Day ${city} Road`,
    subtitle: variant === 'main' ? mainSummary : backupSummary,
    coverImage: cityImages.cover,
    totalEstimate: estimate,
    tags:
      variant === 'main'
        ? city === 'Fez'
          ? ['Medina', 'Culture', 'Food', 'Premium']
          : ['Imperial', 'Food', 'Walkable', 'Premium']
        : ['Backup', 'Relaxed', 'Flexible', 'Calm'],
    days: daysData,
  }
}

function generatePlan(
  prompt: string,
  context: HeroPromptContext | null,
  variant: 'main' | 'backup',
): TripPlan {
  const rawCity = context?.city || extractCity(prompt)
  const city = normalizeText(rawCity).includes('mek') ? 'Meknes' : 'Fez'
  const days = context?.durationDays ?? extractDurationDays(prompt)
  const budgetDh = context?.budgetDh ?? extractBudgetDh(prompt)

  return createPlanFromDummyData(city, days ?? 3, budgetDh ?? null, variant)
}

function getGroupRecommendations(city: 'Fez' | 'Meknes'): GroupRecommendation[] {
  if (city === 'Fez') {
    return [
      { id: 'g1', name: 'Fez Culture Crew', vibe: 'Culture & medina', members: 4, match: '96%', city: 'Fez' },
      { id: 'g2', name: 'Foodie Walkers', vibe: 'Food & cafés', members: 3, match: '92%', city: 'Fez' },
      { id: 'g3', name: 'Photo Spots Circle', vibe: 'Views & content', members: 5, match: '89%', city: 'Fez' },
    ]
  }

  return [
    { id: 'g4', name: 'Meknes Heritage Group', vibe: 'History & calm vibe', members: 4, match: '95%', city: 'Meknes' },
    { id: 'g5', name: 'Imperial City Friends', vibe: 'Soft walking route', members: 3, match: '91%', city: 'Meknes' },
    { id: 'g6', name: 'Slow Travel Circle', vibe: 'Relaxed premium', members: 6, match: '88%', city: 'Meknes' },
  ]
}

function formatCompactValue(value: string | number) {
  return String(value).replace(/\s*MAD/i, ' MAD')
}

function formatPriceLabel(price?: string) {
  if (!price) return null
  return price.replace('/nuit', ' / night')
}

function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-[#f7f6f2]'>
      <div className='mx-auto w-full max-w-[1440px] px-3 py-3 sm:px-5 lg:px-6 xl:px-8'>{children}</div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  compact,
}: {
  title: string
  value: string | number
  icon: ComponentType<{ className?: string }>
  compact?: boolean
}) {
  return (
    <div className='rounded-[20px] border border-zinc-200 bg-white px-3.5 py-3 shadow-[0_4px_18px_rgba(24,24,27,0.04)] sm:px-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400'>{title}</p>
          <p
            className={`mt-1 font-semibold tracking-[-0.04em] text-zinc-950 ${
              compact ? 'text-[18px] leading-6 sm:text-[20px]' : 'text-[20px] leading-6 sm:text-2xl'
            }`}
          >
            {formatCompactValue(value)}
          </p>
        </div>
        <div className='rounded-2xl bg-orange-50 p-2 text-orange-500'>
          <Icon className='h-4 w-4' />
        </div>
      </div>
    </div>
  )
}

function DaySidebarButton({
  day,
  active,
  onClick,
}: {
  day: TripDay
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[18px] border px-3.5 py-3 text-left transition ${
        active
          ? 'border-orange-200 bg-orange-50'
          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
      }`}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400'>Day {day.day}</p>
          <p className='mt-1 truncate text-sm font-semibold text-zinc-950'>{day.title}</p>
          <p className='mt-1 line-clamp-2 text-xs leading-5 text-zinc-500'>{day.summary}</p>
        </div>
        <ChevronRight className='mt-0.5 h-4 w-4 shrink-0 text-zinc-400' />
      </div>
    </button>
  )
}

function ActivityRow({ stop }: { stop: TripStop }) {
  return (
    <div className='rounded-[18px] border border-zinc-200 bg-white p-3 shadow-[0_4px_16px_rgba(24,24,27,0.03)]'>
      <div className='flex gap-3'>
        <div className='h-16 w-16 shrink-0 overflow-hidden rounded-[14px] bg-zinc-100 sm:h-20 sm:w-24'>
          <img src={stop.image} alt={stop.name} className='h-full w-full object-cover' />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0'>
              <div className='flex items-center gap-2 text-zinc-900'>
                <span className='rounded-full bg-orange-50 p-1 text-orange-500'>{getStopIcon(stop.type)}</span>
                <p className='truncate text-sm font-semibold'>{stop.name}</p>
              </div>
              <p className='mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400'>
                {stop.time}
              </p>
            </div>

            {stop.price ? (
              <span className='shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-medium leading-none text-zinc-600'>
                {formatPriceLabel(stop.price)}
              </span>
            ) : null}
          </div>

          <p className='mt-2 line-clamp-2 text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6'>
            {stop.description}
          </p>

          <div className='mt-3 flex flex-wrap gap-2'>
            <a
              href={stop.mapUrl}
              target='_blank'
              rel='noreferrer'
              className='inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-zinc-950 px-3 text-[11px] font-semibold text-white transition hover:bg-zinc-800'
            >
              View map
              <MapPin className='h-3 w-3' />
            </a>

            <a
              href={stop.image}
              target='_blank'
              rel='noreferrer'
              className='inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[11px] font-semibold text-zinc-700 transition hover:bg-zinc-50'
            >
              Photo
              <ArrowRight className='h-3 w-3' />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompactGroupCard({ group }: { group: GroupRecommendation }) {
  return (
    <div className='rounded-[18px] border border-zinc-200 bg-white p-3.5 shadow-[0_4px_16px_rgba(24,24,27,0.03)]'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold text-zinc-950'>{group.name}</p>
          <p className='mt-1 text-xs leading-5 text-zinc-500'>{group.vibe}</p>
        </div>
        <span className='rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700'>
          {group.match}
        </span>
      </div>

      <div className='mt-3 flex items-center justify-between text-[11px] text-zinc-500'>
        <span className='inline-flex items-center gap-1.5'>
          <Users className='h-3.5 w-3.5' />
          {group.members} members
        </span>
        <span>{group.city}</span>
      </div>

      <div className='mt-3 flex gap-2'>
        <button className='inline-flex h-9 items-center justify-center rounded-xl bg-orange-500 px-3 text-xs font-semibold text-white transition hover:bg-orange-600'>
          Join
        </button>
        <Link
          to='/user/groups'
          className='inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50'
        >
          See more
        </Link>
      </div>
    </div>
  )
}

function ModalShell({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean
  title: string
  subtitle: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]'>
      <div className='max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.18)]'>
        <div className='flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-5 sm:px-6'>
          <div className='min-w-0'>
            <h3 className='text-xl font-semibold tracking-[-0.03em] text-zinc-950'>{title}</h3>
            <p className='mt-2 text-sm leading-6 text-zinc-500'>{subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50'
            aria-label='Close'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='max-h-[calc(90vh-92px)] overflow-y-auto px-5 py-5 sm:px-6'>{children}</div>
      </div>
    </div>
  )
}

export default function UserDashboard() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  const [context, setContext] = useState<HeroPromptContext | null>(null)
  const [roadVariant, setRoadVariant] = useState<'main' | 'backup'>('main')
  const [activeDay, setActiveDay] = useState(1)

  const [isFullModalOpen, setIsFullModalOpen] = useState(false)
  const [isPartialModalOpen, setIsPartialModalOpen] = useState(false)

  const [partialDay, setPartialDay] = useState(1)
  const [partialSelection, setPartialSelection] = useState<PartialSelection>({
    hotel: true,
    cafe: true,
    activity: true,
    restaurant: true,
  })

  const isFrench = i18n.language?.startsWith('fr')

  useEffect(() => {
    const raw = sessionStorage.getItem('heroPromptContext')
    if (!raw) return

    try {
      setContext(JSON.parse(raw))
    } catch {
      setContext(null)
    }
  }, [])

  const prompt = context?.prompt || 'Trip to Fez 3 days budget 3500dh'
  const plan = useMemo(() => generatePlan(prompt, context, roadVariant), [prompt, context, roadVariant])
  const groups = useMemo(() => getGroupRecommendations(plan.city), [plan.city])

  useEffect(() => {
    if (plan.days.length > 0) {
      setActiveDay(plan.days[0].day)
      setPartialDay(plan.days[0].day)
    }
  }, [plan.title, plan.days])

  const selectedDay = plan.days.find((day) => day.day === activeDay) ?? plan.days[0]
  const partialSelectedDay = plan.days.find((day) => day.day === partialDay) ?? plan.days[0]

  const totalStops = plan.days.reduce((acc, day) => acc + day.stops.length + 1, 0)

  const chosenTypes = (Object.entries(partialSelection) as [TripStopType, boolean][])
    .filter(([, checked]) => checked)
    .map(([type]) => type)

  const partialStops = partialSelectedDay
    ? [
        ...(partialSelection.hotel ? [partialSelectedDay.hotel] : []),
        ...partialSelectedDay.stops.filter((stop) => chosenTypes.includes(stop.type)),
      ]
    : []

  const firstGroup = groups[0]

  const copy = {
    dashboard: isFrench ? 'Tableau de bord' : 'Dashboard',
    subtitle: isFrench
      ? 'Plan simple, propre et premium pour une vraie bonne expérience utilisateur.'
      : 'A simple, clean premium dashboard built for a strong user experience.',
    bookFull: isFrench ? 'Réserver tout' : 'Book Full Trip',
    bookPartial: isFrench ? 'Réserver partiellement' : 'Book Partial',
    mainRoad: isFrench ? 'Road principal' : 'Main Road',
    backupRoad: isFrench ? 'Road backup' : 'Backup Road',
    tripDays: isFrench ? 'Jours' : 'Trip Days',
    totalStopsLabel: isFrench ? 'Stops' : 'Total Stops',
    tripStyle: isFrench ? 'Style' : 'Trip Style',
    estimatedBudget: isFrench ? 'Budget' : 'Estimated Budget',
    stayAnchor: isFrench ? 'Hôtel du jour' : 'Stay Anchor',
    routeOfDay: isFrench ? 'Activités du jour' : 'Activities of the day',
    viewDayMap: isFrench ? 'Voir sur map' : 'View day map',
    groups: isFrench ? 'Groupe recommandé' : 'Recommended group',
    confirmFull: isFrench ? 'Confirmer réservation complète' : 'Confirm Full Booking',
    confirmPartial: isFrench ? 'Confirmer réservation partielle' : 'Confirm Partial Booking',
    chooseDay: isFrench ? 'Choisir le jour' : 'Choose Day',
    chooseType: isFrench ? 'Choisir les catégories' : 'Choose categories',
    includedItems: isFrench ? 'Éléments inclus' : 'Included items',
    noItems: isFrench ? 'Aucun élément sélectionné.' : 'No items selected.',
    close: isFrench ? 'Fermer' : 'Close',
    questBoard: isFrench ? 'Tableau des quêtes' : 'Quest board',
    questSubtitle: isFrench
      ? 'Des objectifs rapides pour gagner des points.'
      : 'Quick wins to build your travel score.',
    questProgress: isFrench ? 'Progression' : 'Progress',
    questCompleted: isFrench ? 'Quêtes complétées' : 'Quests completed',
    questScore: isFrench ? 'Score total' : 'Total score',
    questRank: isFrench ? 'Rang régional' : 'Regional rank',
    leaderboard: isFrench ? 'Leaderboard local' : 'Local leaderboard',
    xp: isFrench ? 'points' : 'points',
  }

  const questBoard = useMemo(() => {
    const city = plan.city
    const quests: Quest[] = city === 'Meknes'
      ? [
        {
          id: 'quest-mek-1',
          title: isFrench ? 'Explorer la médina' : 'Medina Explorer',
          description: isFrench ? 'Visiter 3 portes historiques.' : 'Visit 3 historic gates.',
          progress: 2,
          goal: 3,
          reward: 120,
          tag: isFrench ? 'Culture' : 'Culture',
          location: 'Meknes Medina',
        },
        {
          id: 'quest-mek-2',
          title: isFrench ? 'Goûter local' : 'Local Taste',
          description: isFrench ? 'Tester 2 spots food.' : 'Try 2 food spots.',
          progress: 1,
          goal: 2,
          reward: 80,
          tag: isFrench ? 'Food' : 'Food',
          location: 'Place Hedim',
        },
        {
          id: 'quest-mek-3',
          title: isFrench ? 'Vue panoramique' : 'Panorama Spot',
          description: isFrench ? 'Trouver 1 rooftop ou point haut.' : 'Find 1 rooftop or high view.',
          progress: 0,
          goal: 1,
          reward: 60,
          tag: isFrench ? 'Vue' : 'View',
          location: 'Meknes Ridge',
        },
      ]
      : [
        {
          id: 'quest-fez-1',
          title: isFrench ? 'Cuir & artisanat' : 'Tannery Discovery',
          description: isFrench ? 'Visiter 1 tannerie emblématique.' : 'Visit 1 iconic tannery.',
          progress: 1,
          goal: 1,
          reward: 120,
          tag: isFrench ? 'Artisan' : 'Artisan',
          location: 'Chouara',
        },
        {
          id: 'quest-fez-2',
          title: isFrench ? 'Coffee break' : 'Coffee break',
          description: isFrench ? 'Tester 2 cafés calmes.' : 'Try 2 quiet cafés.',
          progress: 1,
          goal: 2,
          reward: 80,
          tag: isFrench ? 'Pause' : 'Chill',
          location: 'Fez Medina',
        },
        {
          id: 'quest-fez-3',
          title: isFrench ? 'Photo de voyage' : 'Travel photo',
          description: isFrench ? 'Prendre 3 photos premium.' : 'Capture 3 premium shots.',
          progress: 2,
          goal: 3,
          reward: 100,
          tag: isFrench ? 'Photo' : 'Photo',
          location: 'Bab Boujloud',
        },
      ]

    const totalQuests = quests.length
    const completedQuests = quests.filter((quest) => quest.progress >= quest.goal).length
    const totalScore = quests.reduce((sum, quest) => {
      const ratio = Math.min(quest.progress / quest.goal, 1)
      return sum + Math.round(quest.reward * ratio)
    }, 0)

    const leaderboard: LeaderboardEntry[] = [
      {
        id: 'lb-1',
        name: 'Yasmine A.',
        points: 920,
        avatar:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=60',
        trend: isFrench ? '+12 cette semaine' : '+12 this week',
      },
      {
        id: 'lb-2',
        name: 'Karim D.',
        points: 880,
        avatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=60',
        trend: isFrench ? '+8 cette semaine' : '+8 this week',
      },
      {
        id: 'lb-3',
        name: 'Sofia L.',
        points: 840,
        avatar:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=60',
        trend: isFrench ? '+5 cette semaine' : '+5 this week',
      },
    ]

    return {
      quests,
      totalQuests,
      completedQuests,
      totalScore,
      rank: city === 'Meknes' ? 4 : 3,
      leaderboard,
    }
  }, [plan.city, isFrench])

  function handleOpenFullModal() {
    setIsFullModalOpen(true)
  }

  function handleOpenPartialModal() {
    setPartialDay(selectedDay?.day ?? 1)
    setIsPartialModalOpen(true)
  }

  function handleConfirmFullTrip() {
    setIsFullModalOpen(false)
    navigate('/user/booking', {
      state: {
        mode: 'full-trip',
        tripPlan: plan,
        roadVariant,
      },
    })
  }

  function handleConfirmPartialTrip() {
    setIsPartialModalOpen(false)
    navigate('/user/booking', {
      state: {
        mode: 'partial-trip',
        tripPlan: plan,
        day: partialSelectedDay.day,
        roadVariant,
        selectedTypes: chosenTypes,
        selectedStops: partialStops,
      },
    })
  }

  function togglePartialType(type: keyof PartialSelection) {
    setPartialSelection((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  return (
    <DashboardShell>
      <>
        <div className='space-y-4'>
          <section className='rounded-[24px] border border-zinc-200 bg-white p-4 shadow-[0_4px_20px_rgba(24,24,27,0.04)] sm:p-5'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div className='min-w-0'>
                <div className='inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-600'>
                  <Sparkles className='h-3.5 w-3.5' />
                  {roadVariant === 'main' ? copy.mainRoad : copy.backupRoad}
                </div>

                <h1 className='mt-3 text-xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-3xl'>
                  {plan.title}
                </h1>
                <p className='mt-2 max-w-2xl text-sm leading-6 text-zinc-500'>{copy.subtitle}</p>

                <div className='mt-3 flex flex-wrap gap-2'>
                  {plan.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className='rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium text-zinc-600'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

<<<<<<< HEAD
              <div className='flex flex-col gap-2 sm:flex-row lg:shrink-0'>
=======
              <div className='flex gap-3 overflow-x-auto pb-2'>
                {plan.days.map((day) => (
                  <DayChip
                    key={day.day}
                    day={day}
                    active={selectedDay.day === day.day}
                    onClick={() => setActiveDay(day.day)}
                  />
                ))}
              </div>
            </div>

            <div className='rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_14px_40px_rgba(24,24,27,0.05)] sm:p-5'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500'>
                    {copy.questBoard}
                  </p>
                  <h3 className='mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-950'>
                    {questBoard.totalScore} {copy.xp}
                  </h3>
                  <p className='mt-2 text-sm text-zinc-500'>{copy.questSubtitle}</p>
                </div>
                <div className='rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600'>
                  #{questBoard.rank}
                </div>
              </div>

              <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3'>
                <div className='rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-center'>
                  <p className='text-xs text-zinc-500'>{copy.questCompleted}</p>
                  <p className='mt-2 text-lg font-semibold text-zinc-950'>
                    {questBoard.completedQuests}/{questBoard.totalQuests}
                  </p>
                </div>
                <div className='rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-center'>
                  <p className='text-xs text-zinc-500'>{copy.questScore}</p>
                  <p className='mt-2 text-lg font-semibold text-zinc-950'>{questBoard.totalScore}</p>
                </div>
                <div className='rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-center'>
                  <p className='text-xs text-zinc-500'>{copy.questRank}</p>
                  <p className='mt-2 text-lg font-semibold text-zinc-950'>#{questBoard.rank}</p>
                </div>
              </div>

              <div className='mt-5 space-y-3'>
                {questBoard.quests.map((quest) => {
                  const ratio = Math.min(quest.progress / quest.goal, 1)
                  const completed = ratio >= 1
                  return (
                    <div
                      key={quest.id}
                      className='rounded-[20px] border border-zinc-200 bg-white p-4'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='min-w-0'>
                          <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400'>
                            {quest.tag} · {quest.location}
                          </p>
                          <h4 className='mt-2 text-base font-semibold text-zinc-950'>
                            {quest.title}
                          </h4>
                          <p className='mt-2 text-sm text-zinc-500'>{quest.description}</p>
                        </div>
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-2xl ${completed
                            ? 'bg-green-50 text-green-600'
                            : 'bg-orange-50 text-orange-600'
                            }`}
                        >
                          <CheckCircle2 className='h-4 w-4' />
                        </div>
                      </div>

                      <div className='mt-4'>
                        <div className='mb-2 flex items-center justify-between text-xs text-zinc-500'>
                          <span>
                            {copy.questProgress}: {quest.progress}/{quest.goal}
                          </span>
                          <span className='font-semibold text-zinc-700'>+{quest.reward} XP</span>
                        </div>
                        <div className='h-2 w-full overflow-hidden rounded-full bg-zinc-100'>
                          <div
                            className='h-full rounded-full bg-orange-500 transition-all'
                            style={{ width: `${ratio * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_14px_40px_rgba(24,24,27,0.05)] sm:p-5'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <h3 className='text-lg font-semibold text-zinc-950'>{copy.leaderboard}</h3>
                <Link to='/user/match' className='text-sm font-medium text-orange-600 hover:underline'>
                  {isFrench ? 'Voir plus' : 'See more'}
                </Link>
              </div>
              <div className='space-y-3'>
                {questBoard.leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className='flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-900 text-xs font-semibold text-white'>
                        {index + 1}
                      </div>
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className='h-9 w-9 rounded-2xl object-cover'
                      />
                      <div>
                        <p className='text-sm font-semibold text-zinc-900'>{entry.name}</p>
                        <p className='text-xs text-zinc-500'>{entry.trend}</p>
                      </div>
                    </div>
                    <div className='text-sm font-semibold text-zinc-900'>{entry.points} XP</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_14px_40px_rgba(24,24,27,0.05)] sm:p-6'>
              <div className='flex flex-col gap-4 border-b border-zinc-100 pb-6 lg:flex-row lg:items-end lg:justify-between'>
                <div className='min-w-0'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500'>
                    Day {selectedDay.day}
                  </p>
                  <h3 className='mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-3xl'>
                    {selectedDay.title}
                  </h3>
                  <p className='mt-3 max-w-2xl text-sm leading-7 text-zinc-600'>
                    {selectedDay.summary}
                  </p>
                </div>

                <a
                  href={selectedDay.hotel.mapUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50'
                >
                  {copy.viewDayMap}
                  <MapPin className='h-4 w-4' />
                </a>
              </div>

              <div className='mt-6 rounded-[24px] border border-zinc-200 bg-zinc-50/80 p-4 sm:p-5'>
                <div className='mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400'>
                  <Hotel className='h-4 w-4 text-orange-500' />
                  {copy.stayAnchor}
                </div>

                <div className='grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]'>
                  <div className='overflow-hidden rounded-[24px] bg-zinc-100'>
                    <img
                      src={selectedDay.hotel.image}
                      alt={selectedDay.hotel.name}
                      className='h-full min-h-[220px] w-full object-cover'
                    />
                  </div>

                  <div className='flex flex-col justify-between'>
                    <div>
                      <h4 className='text-xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-2xl'>
                        {selectedDay.hotel.name}
                      </h4>
                      <p className='mt-3 text-sm leading-7 text-zinc-600'>
                        {selectedDay.hotel.description}
                      </p>
                      {selectedDay.hotel.price && (
                        <p className='mt-4 text-sm font-semibold text-orange-600'>
                          {selectedDay.hotel.price}
                        </p>
                      )}
                    </div>

                    <div className='mt-5 flex flex-col gap-2 sm:flex-row'>
                      <a
                        href={selectedDay.hotel.image}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100'
                      >
                        {isFrench ? 'Voir le stop' : 'See the stop'}
                        <ArrowRight className='h-4 w-4' />
                      </a>

                      <a
                        href={selectedDay.hotel.mapUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800'
                      >
                        {isFrench ? 'Voir sur map' : 'View in map'}
                        <MapPin className='h-4 w-4' />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_14px_40px_rgba(24,24,27,0.05)] sm:p-6'>
              <div className='mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400'>
                <CalendarDays className='h-4 w-4 text-orange-500' />
                {copy.routeOfDay}
              </div>

              <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
                {selectedDay.stops.map((stop) => (
                  <StopMiniCard key={stop.id} stop={stop} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalShell
        open={isFullModalOpen}
        onClose={() => setIsFullModalOpen(false)}
        title={copy.bookFull}
        subtitle={
          isFrench
            ? 'Ce popup blanc confirme la réservation de tout le voyage.'
            : 'This white popup confirms booking the whole trip.'
        }
      >
        <div className='space-y-5'>
          <div className='rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 sm:p-5'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400'>
              {plan.city}
            </p>
            <h4 className='mt-2 text-xl font-semibold text-zinc-950'>{plan.title}</h4>
            <p className='mt-2 text-sm leading-6 text-zinc-600'>{plan.subtitle}</p>

            <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3'>
              <div className='rounded-2xl border border-zinc-200 bg-white p-4'>
                <p className='text-xs text-zinc-500'>{copy.tripDays}</p>
                <p className='mt-2 text-lg font-semibold text-zinc-950'>{plan.durationDays}</p>
              </div>
              <div className='rounded-2xl border border-zinc-200 bg-white p-4'>
                <p className='text-xs text-zinc-500'>{copy.totalStopsLabel}</p>
                <p className='mt-2 text-lg font-semibold text-zinc-950'>{totalStops}</p>
              </div>
              <div className='rounded-2xl border border-zinc-200 bg-white p-4'>
                <p className='text-xs text-zinc-500'>{copy.estimatedBudget}</p>
                <p className='mt-2 text-lg font-semibold text-zinc-950'>{plan.totalEstimate}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
            <button
              onClick={() => setIsFullModalOpen(false)}
              className='inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50'
            >
              {copy.close}
            </button>
            <button
              onClick={handleConfirmFullTrip}
              className='inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800'
            >
              {copy.confirmFull}
              <CheckCircle2 className='h-4 w-4' />
            </button>
          </div>
        </div>
      </ModalShell>

      <ModalShell
        open={isPartialModalOpen}
        onClose={() => setIsPartialModalOpen(false)}
        title={copy.bookPartial}
        subtitle={
          isFrench
            ? 'Choisissez un jour et les éléments à réserver.'
            : 'Choose a day and the trip items you want to book.'
        }
      >
        <div className='space-y-6'>
          <div>
            <p className='mb-3 text-sm font-semibold text-zinc-900'>{copy.chooseDay}</p>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {plan.days.map((day) => (
>>>>>>> 98548d0 (Improve agent UI and API wiring)
                <button
                  onClick={() => setRoadVariant('main')}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                    roadVariant === 'main'
                      ? 'border-orange-200 bg-orange-50 text-orange-600'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <Route className='h-4 w-4' />
                  {copy.mainRoad}
                </button>

                <button
                  onClick={() => setRoadVariant('backup')}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                    roadVariant === 'backup'
                      ? 'border-orange-200 bg-orange-50 text-orange-600'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <RefreshCcw className='h-4 w-4' />
                  {copy.backupRoad}
                </button>

                <button
                  onClick={handleOpenFullModal}
                  className='inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800'
                >
                  {copy.bookFull}
                  <CheckCircle2 className='h-4 w-4' />
                </button>
              </div>
            </div>
          </section>

          <section className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
            <StatCard title={copy.tripDays} value={plan.durationDays} icon={CalendarDays} />
            <StatCard title={copy.totalStopsLabel} value={totalStops} icon={Route} />
            <StatCard title={copy.tripStyle} value={plan.city} icon={Compass} />
            <StatCard title={copy.estimatedBudget} value={plan.totalEstimate} icon={Wallet} compact />
          </section>

          <section className='grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]'>
            <div className='space-y-4'>
              <div className='rounded-[22px] border border-zinc-200 bg-white p-4 shadow-[0_4px_18px_rgba(24,24,27,0.04)]'>
                <div className='mb-3 flex items-center justify-between gap-3'>
                  <h2 className='text-base font-semibold tracking-[-0.03em] text-zinc-950'>Days</h2>
                  <Link to='/user/trips' className='text-xs font-semibold text-orange-600 hover:underline'>
                    View all
                  </Link>
                </div>

                <div className='space-y-2.5'>
                  {plan.days.map((day) => (
                    <DaySidebarButton
                      key={day.day}
                      day={day}
                      active={selectedDay.day === day.day}
                      onClick={() => setActiveDay(day.day)}
                    />
                  ))}
                </div>
              </div>

              <div className='rounded-[22px] border border-zinc-200 bg-white p-4 shadow-[0_4px_18px_rgba(24,24,27,0.04)]'>
                <div className='mb-3 flex items-center gap-2'>
                  <Users className='h-4 w-4 text-orange-500' />
                  <h3 className='text-base font-semibold text-zinc-950'>{copy.groups}</h3>
                </div>

                {firstGroup ? <CompactGroupCard group={firstGroup} /> : null}
              </div>
            </div>

            <div className='space-y-4'>
              <div className='rounded-[22px] border border-zinc-200 bg-white p-4 shadow-[0_4px_18px_rgba(24,24,27,0.04)] sm:p-5'>
                <div className='flex flex-col gap-3 border-b border-zinc-100 pb-4 sm:flex-row sm:items-start sm:justify-between'>
                  <div className='min-w-0'>
                    <p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-500'>
                      Day {selectedDay.day}
                    </p>
                    <h2 className='mt-1 text-lg font-semibold tracking-[-0.04em] text-zinc-950 sm:text-2xl'>
                      {selectedDay.title}
                    </h2>
                    <p className='mt-2 text-sm leading-6 text-zinc-500'>{selectedDay.summary}</p>
                  </div>

                  <button
                    onClick={handleOpenPartialModal}
                    className='inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50'
                  >
                    {copy.bookPartial}
                    <ArrowRight className='h-4 w-4' />
                  </button>
                </div>

                <div className='mt-4 rounded-[18px] border border-zinc-200 bg-zinc-50 p-3 sm:p-4'>
                  <div className='mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400'>
                    <Hotel className='h-4 w-4 text-orange-500' />
                    {copy.stayAnchor}
                  </div>

                  <div className='flex flex-col gap-3 sm:flex-row'>
                    <div className='h-24 w-full shrink-0 overflow-hidden rounded-[16px] bg-zinc-100 sm:h-28 sm:w-40'>
                      <img
                        src={selectedDay.hotel.image}
                        alt={selectedDay.hotel.name}
                        className='h-full w-full object-cover'
                      />
                    </div>

                    <div className='min-w-0 flex-1'>
                      <div className='flex flex-col gap-2'>
                        <div className='min-w-0'>
                          <h3 className='text-base font-semibold tracking-[-0.03em] text-zinc-950 sm:text-lg'>
                            {selectedDay.hotel.name}
                          </h3>
                          <p className='mt-1.5 text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6'>
                            {selectedDay.hotel.description}
                          </p>
                        </div>

                        {selectedDay.hotel.price ? (
                          <span className='inline-flex w-fit rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600 sm:text-xs'>
                            {formatPriceLabel(selectedDay.hotel.price)}
                          </span>
                        ) : null}
                      </div>

                      <div className='mt-3 flex flex-wrap gap-2'>
                        <a
                          href={selectedDay.hotel.mapUrl}
                          target='_blank'
                          rel='noreferrer'
                          className='inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-zinc-950 px-3 text-[11px] font-semibold text-white transition hover:bg-zinc-800'
                        >
                          {copy.viewDayMap}
                          <MapPin className='h-3 w-3' />
                        </a>

                        <a
                          href={selectedDay.hotel.image}
                          target='_blank'
                          rel='noreferrer'
                          className='inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[11px] font-semibold text-zinc-700 transition hover:bg-zinc-50'
                        >
                          Photo
                          <ArrowRight className='h-3 w-3' />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-[22px] border border-zinc-200 bg-white p-4 shadow-[0_4px_18px_rgba(24,24,27,0.04)] sm:p-5'>
                <div className='mb-4 flex items-center gap-2'>
                  <Camera className='h-4 w-4 text-orange-500' />
                  <h3 className='text-base font-semibold text-zinc-950'>{copy.routeOfDay}</h3>
                </div>

                <div className='space-y-3'>
                  {selectedDay.stops.map((stop) => (
                    <ActivityRow key={stop.id} stop={stop} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <ModalShell
          open={isFullModalOpen}
          onClose={() => setIsFullModalOpen(false)}
          title={copy.bookFull}
          subtitle={
            isFrench
              ? 'Confirmez la réservation de tout le voyage.'
              : 'Confirm booking for the whole trip.'
          }
        >
          <div className='space-y-5'>
            <div className='rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 sm:p-5'>
              <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400'>{plan.city}</p>
              <h4 className='mt-2 text-xl font-semibold text-zinc-950'>{plan.title}</h4>
              <p className='mt-2 text-sm leading-6 text-zinc-600'>{plan.subtitle}</p>

              <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3'>
                <div className='rounded-2xl border border-zinc-200 bg-white p-4'>
                  <p className='text-xs text-zinc-500'>{copy.tripDays}</p>
                  <p className='mt-2 text-lg font-semibold text-zinc-950'>{plan.durationDays}</p>
                </div>
                <div className='rounded-2xl border border-zinc-200 bg-white p-4'>
                  <p className='text-xs text-zinc-500'>{copy.totalStopsLabel}</p>
                  <p className='mt-2 text-lg font-semibold text-zinc-950'>{totalStops}</p>
                </div>
                <div className='rounded-2xl border border-zinc-200 bg-white p-4'>
                  <p className='text-xs text-zinc-500'>{copy.estimatedBudget}</p>
                  <p className='mt-2 text-lg font-semibold text-zinc-950'>{plan.totalEstimate}</p>
                </div>
              </div>
            </div>

            <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <button
                onClick={() => setIsFullModalOpen(false)}
                className='inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50'
              >
                {copy.close}
              </button>
              <button
                onClick={handleConfirmFullTrip}
                className='inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800'
              >
                {copy.confirmFull}
                <CheckCircle2 className='h-4 w-4' />
              </button>
            </div>
          </div>
        </ModalShell>

        <ModalShell
          open={isPartialModalOpen}
          onClose={() => setIsPartialModalOpen(false)}
          title={copy.bookPartial}
          subtitle={
            isFrench
              ? 'Choisissez un jour et les éléments à réserver.'
              : 'Choose a day and the trip items you want to book.'
          }
        >
          <div className='space-y-6'>
            <div>
              <p className='mb-3 text-sm font-semibold text-zinc-900'>{copy.chooseDay}</p>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {plan.days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setPartialDay(day.day)}
                    className={`rounded-[20px] border p-4 text-left transition ${
                      partialDay === day.day
                        ? 'border-orange-200 bg-orange-50'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400'>
                      Day {day.day}
                    </p>
                    <p className='mt-2 text-sm font-semibold text-zinc-950'>{day.title}</p>
                    <p className='mt-2 text-xs leading-6 text-zinc-500'>{day.summary}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className='mb-3 text-sm font-semibold text-zinc-900'>{copy.chooseType}</p>
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                {[
                  { key: 'hotel', label: 'Hotel', icon: Hotel },
                  { key: 'cafe', label: 'Cafe', icon: Coffee },
                  { key: 'activity', label: 'Activity', icon: Camera },
                  { key: 'restaurant', label: 'Restaurant', icon: Utensils },
                ].map((item) => {
                  const Icon = item.icon
                  const active = partialSelection[item.key as keyof PartialSelection]

                  return (
                    <button
                      key={item.key}
                      onClick={() => togglePartialType(item.key as keyof PartialSelection)}
                      className={`flex h-20 flex-col items-center justify-center gap-2 rounded-[20px] border text-sm font-semibold transition ${
                        active
                          ? 'border-orange-200 bg-orange-50 text-orange-600'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <Icon className='h-5 w-5' />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className='rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 sm:p-5'>
              <p className='mb-3 text-sm font-semibold text-zinc-900'>{copy.includedItems}</p>

              {partialStops.length === 0 ? (
                <p className='text-sm text-zinc-500'>{copy.noItems}</p>
              ) : (
                <div className='space-y-3'>
                  {partialStops.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-start justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3'
                    >
                      <div className='min-w-0'>
                        <div className='flex items-center gap-2 text-zinc-900'>
                          {getStopIcon(item.type)}
                          <span className='font-semibold'>{item.name}</span>
                        </div>
                        <p className='mt-1 text-sm text-zinc-500'>
                          Day {partialSelectedDay.day} • {item.time}
                        </p>
                      </div>

                      <span className='shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-600'>
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <button
                onClick={() => setIsPartialModalOpen(false)}
                className='inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50'
              >
                {copy.close}
              </button>
              <button
                onClick={handleConfirmPartialTrip}
                disabled={partialStops.length === 0}
                className='inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {copy.confirmPartial}
                <ArrowRight className='h-4 w-4' />
              </button>
            </div>
          </div>
        </ModalShell>
      </>
    </DashboardShell>
  )
}

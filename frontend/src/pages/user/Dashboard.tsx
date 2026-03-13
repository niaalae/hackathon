import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { LucideIcon } from 'lucide-react'
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
} from 'lucide-react'

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

const FEZ_IMAGES = {
  cover:
    'https://images.unsplash.com/photo-1577147443647-81856d5151af?auto=format&fit=crop&w=1200&q=80',
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
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
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
  if (p.includes('meknes') || p.includes('meknès')) return 'Meknes'
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

function createFezPlan(days: number, budgetDh: number | null, variant: 'main' | 'backup'): TripPlan {
  const safeDays = Math.max(2, Math.min(days, 5))

  const mainDays: TripDay[] = [
    {
      day: 1,
      title: 'Arrival & Medina Start',
      summary: 'Soft arrival with a premium medina opening.',
      area: 'Fes el-Bali',
      hotel: {
        id: 'fez-main-hotel-1',
        name: 'Riad near Bab Boujloud',
        type: 'hotel',
        time: 'Check-in',
        description: 'Elegant riad, central access, calm atmosphere, good first-day anchor.',
        image: FEZ_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Riad+Bab+Boujloud+Fes',
        price: 'From 950 MAD/night',
      },
      stops: [
        {
          id: 'fez-main-1',
          name: 'Bab Boujloud',
          type: 'activity',
          time: '10:00',
          description: 'Start from the iconic gateway and enter the medina through the classic route.',
          image: FEZ_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bab+Boujloud+Fes',
        },
        {
          id: 'fez-main-2',
          name: 'Quiet Coffee Stop',
          type: 'cafe',
          time: '11:30',
          description: 'A clean coffee break with a quieter premium feel.',
          image: FEZ_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=quiet+cafe+fes+medina',
          price: '45–80 MAD',
        },
        {
          id: 'fez-main-3',
          name: 'Bou Inania Walk',
          type: 'activity',
          time: '13:00',
          description: 'Architecture, artisan streets, and heritage atmosphere.',
          image: FEZ_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bou+Inania+Madrasa+Fes',
        },
        {
          id: 'fez-main-4',
          name: 'Traditional Lunch',
          type: 'restaurant',
          time: '14:30',
          description: 'Local food anchor with a strong Fassi identity.',
          image: FEZ_IMAGES.food,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=traditional+restaurant+fes',
          price: '140–240 MAD',
        },
      ],
    },
    {
      day: 2,
      title: 'Crafts & Rooftop Rhythm',
      summary: 'A stronger cultural day with good pacing and premium food moments.',
      area: 'Craft district',
      hotel: {
        id: 'fez-main-hotel-2',
        name: 'Boutique Riad in the Medina',
        type: 'hotel',
        time: 'Stay',
        description: 'Well-located riad for a dense but comfortable route.',
        image: FEZ_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Boutique+Riad+Fes',
        price: 'From 1100 MAD/night',
      },
      stops: [
        {
          id: 'fez-main-5',
          name: 'Rooftop Breakfast',
          type: 'cafe',
          time: '09:00',
          description: 'Morning coffee and breakfast with a visual medina view.',
          image: FEZ_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=rooftop+breakfast+fes',
          price: '70–130 MAD',
        },
        {
          id: 'fez-main-6',
          name: 'Tannery Viewpoint',
          type: 'activity',
          time: '11:00',
          description: 'One of the strongest visual stops in Fes.',
          image: FEZ_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chouara+Tannery+Fes',
        },
        {
          id: 'fez-main-7',
          name: 'Artisan Shopping Lane',
          type: 'activity',
          time: '13:00',
          description: 'Leather, ceramics, and handmade products in the artisan zone.',
          image: FEZ_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=artisan+shops+fes',
        },
        {
          id: 'fez-main-8',
          name: 'Signature Fassi Lunch',
          type: 'restaurant',
          time: '14:30',
          description: 'A stronger culinary stop for a more polished trip feel.',
          image: FEZ_IMAGES.food,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=best+restaurant+fes',
          price: '180–280 MAD',
        },
      ],
    },
    {
      day: 3,
      title: 'Modern Fes Finale',
      summary: 'Brunch, photo route, shopping, and final dinner.',
      area: 'Ville Nouvelle',
      hotel: {
        id: 'fez-main-hotel-3',
        name: 'Modern Stay in Ville Nouvelle',
        type: 'hotel',
        time: 'Late checkout',
        description: 'Modern, calmer, and easier if the user wants a smoother finish.',
        image: FEZ_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ville+Nouvelle+Hotel+Fes',
        price: 'From 820 MAD/night',
      },
      stops: [
        {
          id: 'fez-main-9',
          name: 'Brunch Café',
          type: 'cafe',
          time: '10:00',
          description: 'Modern brunch stop with a cleaner atmosphere.',
          image: FEZ_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=brunch+cafe+fes',
          price: '80–140 MAD',
        },
        {
          id: 'fez-main-10',
          name: 'Photo Route',
          type: 'activity',
          time: '12:30',
          description: 'Easy visual route before the end of the trip.',
          image: FEZ_IMAGES.cover,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=best+photo+spots+fes',
        },
        {
          id: 'fez-main-11',
          name: 'Shopping Block',
          type: 'activity',
          time: '15:00',
          description: 'Souvenirs, handmade pieces, and flexible free time.',
          image: FEZ_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=shopping+fes',
        },
        {
          id: 'fez-main-12',
          name: 'Final Dinner',
          type: 'restaurant',
          time: '20:00',
          description: 'Premium closing dinner with a memorable finish.',
          image: FEZ_IMAGES.food,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=dinner+fes',
          price: '190–320 MAD',
        },
      ],
    },
  ]

  const backupDays: TripDay[] = [
    {
      day: 1,
      title: 'Relaxed Medina Route',
      summary: 'A lighter arrival day with fewer dense stops.',
      area: 'Old city',
      hotel: {
        id: 'fez-back-hotel-1',
        name: 'Calm Medina Stay',
        type: 'hotel',
        time: 'Check-in',
        description: 'Alternative stay with quieter pacing and easier walking.',
        image: FEZ_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=quiet+riad+fes',
        price: 'From 780 MAD/night',
      },
      stops: [
        {
          id: 'fez-back-1',
          name: 'Soft Medina Walk',
          type: 'activity',
          time: '11:00',
          description: 'A slower route for users who want less density.',
          image: FEZ_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=medina+walk+fes',
        },
        {
          id: 'fez-back-2',
          name: 'Tea & Coffee Stop',
          type: 'cafe',
          time: '12:30',
          description: 'Simple café stop in a calmer part of the route.',
          image: FEZ_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=tea+cafe+fes',
          price: '35–70 MAD',
        },
        {
          id: 'fez-back-3',
          name: 'Easy Lunch',
          type: 'restaurant',
          time: '14:00',
          description: 'Lower-pressure lunch option with a simpler route.',
          image: FEZ_IMAGES.food,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=lunch+fes',
          price: '100–180 MAD',
        },
      ],
    },
    {
      day: 2,
      title: 'Culture Alternative',
      summary: 'A backup discovery day with less intensity.',
      area: 'Heritage side',
      hotel: {
        id: 'fez-back-hotel-2',
        name: 'Comfort Riad Backup',
        type: 'hotel',
        time: 'Stay',
        description: 'Balanced comfort for the backup road.',
        image: FEZ_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=comfort+riad+fes',
        price: 'From 880 MAD/night',
      },
      stops: [
        {
          id: 'fez-back-4',
          name: 'Breakfast Start',
          type: 'cafe',
          time: '09:30',
          description: 'Calm breakfast and coffee before the route.',
          image: FEZ_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=breakfast+fes',
        },
        {
          id: 'fez-back-5',
          name: 'Heritage Route',
          type: 'activity',
          time: '11:00',
          description: 'Alternative cultural flow without dense walking pressure.',
          image: FEZ_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=heritage+route+fes',
        },
        {
          id: 'fez-back-6',
          name: 'Backup Lunch',
          type: 'restaurant',
          time: '14:00',
          description: 'Good quality but more flexible food stop.',
          image: FEZ_IMAGES.food,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=restaurant+fes',
          price: '120–210 MAD',
        },
      ],
    },
    {
      day: 3,
      title: 'Flexible Last Day',
      summary: 'Easy final day with brunch and a soft finish.',
      area: 'Flexible zone',
      hotel: {
        id: 'fez-back-hotel-3',
        name: 'Modern Backup Stay',
        type: 'hotel',
        time: 'Late checkout',
        description: 'Alternative final stay if the main road is rejected.',
        image: FEZ_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=modern+hotel+fes',
        price: 'From 760 MAD/night',
      },
      stops: [
        {
          id: 'fez-back-7',
          name: 'Late Brunch',
          type: 'cafe',
          time: '10:30',
          description: 'Slower start for the final day.',
          image: FEZ_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=brunch+fes',
          price: '70–120 MAD',
        },
        {
          id: 'fez-back-8',
          name: 'Free Exploration',
          type: 'activity',
          time: '13:00',
          description: 'Flexible block to revisit favorite stops.',
          image: FEZ_IMAGES.cover,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=places+to+visit+fes',
        },
        {
          id: 'fez-back-9',
          name: 'Last Dinner',
          type: 'restaurant',
          time: '19:30',
          description: 'Simple premium ending for the backup route.',
          image: FEZ_IMAGES.food,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=best+dinner+fes',
          price: '150–260 MAD',
        },
      ],
    },
  ]

  const chosen = variant === 'main' ? mainDays : backupDays
  const selectedDays = chosen.slice(0, safeDays)
  const estimate = budgetDh
    ? `~ ${budgetDh.toLocaleString()} MAD`
    : variant === 'main'
      ? `${safeDays * 1250}–${safeDays * 1850} MAD`
      : `${safeDays * 1050}–${safeDays * 1550} MAD`

  return {
    city: 'Fez',
    durationDays: safeDays,
    budgetDh,
    title: variant === 'main' ? `Smart ${safeDays}-Day Fez Road` : `Backup ${safeDays}-Day Fez Road`,
    subtitle:
      variant === 'main'
        ? 'Premium structured trip with hotels, cafés, food, and activities.'
        : 'Alternative softer route with simpler pacing and backup options.',
    coverImage: variant === 'main' ? FEZ_IMAGES.cover : FEZ_IMAGES.medina,
    totalEstimate: estimate,
    tags:
      variant === 'main'
        ? ['Medina', 'Culture', 'Food', 'Premium']
        : ['Backup', 'Relaxed', 'Flexible', 'Calm'],
    days: selectedDays,
  }
}

function createMeknesPlan(days: number, budgetDh: number | null, variant: 'main' | 'backup'): TripPlan {
  const safeDays = Math.max(2, Math.min(days, 5))

  const mainDays: TripDay[] = [
    {
      day: 1,
      title: 'Imperial Arrival',
      summary: 'Classic Meknes opening with monument and café stop.',
      area: 'Historic Meknes',
      hotel: {
        id: 'mek-main-hotel-1',
        name: 'Charming Stay near Bab Mansour',
        type: 'hotel',
        time: 'Check-in',
        description: 'Premium first-day anchor near the historic core.',
        image: MEKNES_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=hotel+bab+mansour+meknes',
        price: 'From 720 MAD/night',
      },
      stops: [
        {
          id: 'mek-main-1',
          name: 'Bab Mansour',
          type: 'activity',
          time: '10:00',
          description: 'Start with the most iconic imperial gateway.',
          image: MEKNES_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bab+Mansour+Meknes',
        },
        {
          id: 'mek-main-2',
          name: 'Coffee Break',
          type: 'cafe',
          time: '11:30',
          description: 'Simple premium café stop near the center.',
          image: MEKNES_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=cafe+meknes+center',
          price: '35–70 MAD',
        },
        {
          id: 'mek-main-3',
          name: 'Imperial Walk',
          type: 'activity',
          time: '13:00',
          description: 'Historic route through the imperial side of the city.',
          image: MEKNES_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=imperial+city+meknes',
        },
        {
          id: 'mek-main-4',
          name: 'Traditional Lunch',
          type: 'restaurant',
          time: '14:30',
          description: 'Regional dishes in a comfortable setting.',
          image: MEKNES_IMAGES.food,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=restaurant+meknes',
          price: '100–190 MAD',
        },
      ],
    },
    {
      day: 2,
      title: 'Heritage & Slow Food',
      summary: 'History blocks with a calm polished rhythm.',
      area: 'Imperial district',
      hotel: {
        id: 'mek-main-hotel-2',
        name: 'Central Meknes Hotel',
        type: 'hotel',
        time: 'Stay',
        description: 'Central option with easier access and good comfort.',
        image: MEKNES_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=central+hotel+meknes',
        price: 'From 790 MAD/night',
      },
      stops: [
        {
          id: 'mek-main-5',
          name: 'Breakfast Café',
          type: 'cafe',
          time: '09:00',
          description: 'Good calm breakfast before the route.',
          image: MEKNES_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=breakfast+cafe+meknes',
        },
        {
          id: 'mek-main-6',
          name: 'Monument Route',
          type: 'activity',
          time: '10:30',
          description: 'Structured route through the main heritage points.',
          image: MEKNES_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=historic+sites+meknes',
        },
        {
          id: 'mek-main-7',
          name: 'Signature Lunch',
          type: 'restaurant',
          time: '13:30',
          description: 'Refined food stop for the middle of the trip.',
          image: MEKNES_IMAGES.food,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=best+lunch+meknes',
          price: '130–220 MAD',
        },
      ],
    },
    {
      day: 3,
      title: 'Modern Finale',
      summary: 'Brunch, visual route, and final city finish.',
      area: 'Center',
      hotel: {
        id: 'mek-main-hotel-3',
        name: 'Comfort Stay in Center',
        type: 'hotel',
        time: 'Late checkout',
        description: 'Easy exit strategy and calmer final-day base.',
        image: MEKNES_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=center+hotel+meknes',
        price: 'From 690 MAD/night',
      },
      stops: [
        {
          id: 'mek-main-8',
          name: 'Brunch Stop',
          type: 'cafe',
          time: '10:00',
          description: 'Modern and lighter final-day opening.',
          image: MEKNES_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=brunch+meknes',
          price: '75–130 MAD',
        },
        {
          id: 'mek-main-9',
          name: 'Photo Route',
          type: 'activity',
          time: '12:30',
          description: 'Final visual route and optional shopping.',
          image: MEKNES_IMAGES.cover,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=photo+spots+meknes',
        },
        {
          id: 'mek-main-10',
          name: 'Final Dinner',
          type: 'restaurant',
          time: '19:30',
          description: 'Clean premium finish before departure.',
          image: MEKNES_IMAGES.food,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=dinner+meknes',
          price: '140–240 MAD',
        },
      ],
    },
  ]

  const backupDays: TripDay[] = [
    {
      day: 1,
      title: 'Soft Imperial Start',
      summary: 'Backup start with calmer pacing.',
      area: 'Old city',
      hotel: {
        id: 'mek-back-hotel-1',
        name: 'Calm Stay in Meknes',
        type: 'hotel',
        time: 'Check-in',
        description: 'Alternative opening stay with less dense movement.',
        image: MEKNES_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=quiet+hotel+meknes',
        price: 'From 620 MAD/night',
      },
      stops: [
        {
          id: 'mek-back-1',
          name: 'Slow Walk',
          type: 'activity',
          time: '11:00',
          description: 'Simpler route if the main road is too dense.',
          image: MEKNES_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=walk+meknes',
        },
        {
          id: 'mek-back-2',
          name: 'Tea Stop',
          type: 'cafe',
          time: '12:30',
          description: 'Tea and coffee in a relaxed setting.',
          image: MEKNES_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=tea+meknes',
          price: '30–60 MAD',
        },
      ],
    },
    {
      day: 2,
      title: 'Backup Heritage Day',
      summary: 'Alternative culture route with simpler timing.',
      area: 'Heritage side',
      hotel: {
        id: 'mek-back-hotel-2',
        name: 'Backup Central Hotel',
        type: 'hotel',
        time: 'Stay',
        description: 'Balanced comfort for the backup itinerary.',
        image: MEKNES_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=central+backup+hotel+meknes',
        price: 'From 690 MAD/night',
      },
      stops: [
        {
          id: 'mek-back-3',
          name: 'Breakfast Start',
          type: 'cafe',
          time: '09:30',
          description: 'Simple breakfast before the route.',
          image: MEKNES_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=breakfast+meknes',
        },
        {
          id: 'mek-back-4',
          name: 'Flexible Heritage Route',
          type: 'activity',
          time: '11:00',
          description: 'More flexible heritage block than the main road.',
          image: MEKNES_IMAGES.medina,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=heritage+meknes',
        },
        {
          id: 'mek-back-5',
          name: 'Backup Lunch',
          type: 'restaurant',
          time: '14:00',
          description: 'Safer fallback lunch option.',
          image: MEKNES_IMAGES.food,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=lunch+meknes',
          price: '100–180 MAD',
        },
      ],
    },
    {
      day: 3,
      title: 'Easy Final Day',
      summary: 'Backup final day with softer flow.',
      area: 'Flexible',
      hotel: {
        id: 'mek-back-hotel-3',
        name: 'Backup Final Stay',
        type: 'hotel',
        time: 'Late checkout',
        description: 'Alternative final option for smoother exit.',
        image: MEKNES_IMAGES.riad,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=hotel+meknes',
        price: 'From 650 MAD/night',
      },
      stops: [
        {
          id: 'mek-back-6',
          name: 'Late Coffee',
          type: 'cafe',
          time: '10:30',
          description: 'Slow final morning.',
          image: MEKNES_IMAGES.cafe,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=coffee+meknes',
        },
        {
          id: 'mek-back-7',
          name: 'Free Route',
          type: 'activity',
          time: '13:00',
          description: 'Open block to revisit top places.',
          image: MEKNES_IMAGES.cover,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=best+places+meknes',
        },
      ],
    },
  ]

  const chosen = variant === 'main' ? mainDays : backupDays
  const selectedDays = chosen.slice(0, safeDays)
  const estimate = budgetDh
    ? `~ ${budgetDh.toLocaleString()} MAD`
    : variant === 'main'
      ? `${safeDays * 950}–${safeDays * 1500} MAD`
      : `${safeDays * 850}–${safeDays * 1350} MAD`

  return {
    city: 'Meknes',
    durationDays: safeDays,
    budgetDh,
    title: variant === 'main' ? `Smart ${safeDays}-Day Meknes Road` : `Backup ${safeDays}-Day Meknes Road`,
    subtitle:
      variant === 'main'
        ? 'Structured Meknes itinerary with food, cafés, stays, and monuments.'
        : 'Alternative relaxed route with simpler pacing.',
    coverImage: variant === 'main' ? MEKNES_IMAGES.cover : MEKNES_IMAGES.medina,
    totalEstimate: estimate,
    tags:
      variant === 'main'
        ? ['Imperial', 'Food', 'Walkable', 'Premium']
        : ['Backup', 'Relaxed', 'Simple', 'Flexible'],
    days: selectedDays,
  }
}

function generatePlan(
  prompt: string,
  context: HeroPromptContext | null,
  variant: 'main' | 'backup',
): TripPlan {
  const rawCity = context?.city || extractCity(prompt)
  const city = rawCity.toLowerCase().includes('mek') ? 'Meknes' : 'Fez'
  const days = context?.durationDays ?? extractDurationDays(prompt)
  const budgetDh = context?.budgetDh ?? extractBudgetDh(prompt)

  return city === 'Meknes'
    ? createMeknesPlan(days ?? 3, budgetDh ?? null, variant)
    : createFezPlan(days ?? 3, budgetDh ?? null, variant)
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string
  value: string | number
  change: string
  icon: LucideIcon
}) {
  return (
    <div className='rounded-[24px] border border-zinc-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(24,24,27,0.04)] sm:p-5'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <p className='text-sm text-zinc-500'>{title}</p>
          <p className='mt-3 break-words text-[28px] font-semibold leading-none tracking-[-0.04em] text-zinc-950 sm:text-[34px]'>
            {value}
          </p>
          <p className='mt-3 text-sm text-zinc-500'>{change}</p>
        </div>
        <div className='shrink-0 rounded-2xl bg-orange-500/10 p-3 text-orange-500'>
          <Icon className='h-5 w-5' />
        </div>
      </div>
    </div>
  )
}

function DayChip({
  active,
  day,
  onClick,
}: {
  active: boolean
  day: TripDay
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`min-w-[220px] rounded-[22px] border p-4 text-left transition sm:min-w-[250px] ${active
        ? 'border-orange-200 bg-orange-50'
        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
        }`}
    >
      <div className='flex items-center justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400'>
            Day {day.day}
          </p>
          <p className='mt-1 truncate text-sm font-semibold text-zinc-900'>{day.title}</p>
        </div>
        <ChevronRight className='h-4 w-4 shrink-0 text-zinc-400' />
      </div>
      <p className='mt-3 line-clamp-2 text-xs leading-6 text-zinc-500'>{day.summary}</p>
    </button>
  )
}

function StopMiniCard({ stop }: { stop: TripStop }) {
  return (
    <div className='overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_8px_24px_rgba(24,24,27,0.04)]'>
      <div className='relative h-44 overflow-hidden bg-zinc-100 sm:h-48'>
        <img src={stop.image} alt={stop.name} className='h-full w-full object-cover' />
        <div className='absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-zinc-800 backdrop-blur'>
          {getStopIcon(stop.type)}
          <span className='capitalize'>{stop.type}</span>
        </div>
      </div>

      <div className='p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400'>
              {stop.time}
            </p>
            <h4 className='mt-1 text-base font-semibold text-zinc-950'>{stop.name}</h4>
          </div>
          {stop.price && (
            <span className='shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600'>
              {stop.price}
            </span>
          )}
        </div>

        <p className='mt-3 text-sm leading-6 text-zinc-600'>{stop.description}</p>

        <div className='mt-4 flex flex-col gap-2 sm:flex-row'>
          <a
            href={stop.image}
            target='_blank'
            rel='noreferrer'
            className='inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50'
          >
            See the stop
            <ArrowRight className='h-4 w-4' />
          </a>

          <a
            href={stop.mapUrl}
            target='_blank'
            rel='noreferrer'
            className='inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800'
          >
            View in map
            <MapPin className='h-4 w-4' />
          </a>
        </div>
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
  children: React.ReactNode
}) {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]'>
      <div className='max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[30px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.22)]'>
        <div className='flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-5 sm:px-6'>
          <div className='min-w-0'>
            <h3 className='text-xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-2xl'>
              {title}
            </h3>
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

  const copy = {
    dashboard: isFrench ? 'Tableau de bord' : 'Dashboard',
    subtitle: isFrench
      ? 'Un planificateur premium, clair et centré sur Fès et Meknès.'
      : 'A clean premium planner focused on Fez and Meknes.',
    bookFull: isFrench ? 'Réserver tout le voyage' : 'Book Full Trip',
    bookPartial: isFrench ? 'Réserver une partie' : 'Book Partial',
    mainRoad: isFrench ? 'Road principal' : 'Main Road',
    backupRoad: isFrench ? 'Road backup' : 'Backup Road',
    tripDays: isFrench ? 'Jours du voyage' : 'Trip Days',
    totalStopsLabel: isFrench ? 'Total des stops' : 'Total Stops',
    tripStyle: isFrench ? 'Style du voyage' : 'Trip Style',
    estimatedBudget: isFrench ? 'Budget estimé' : 'Estimated Budget',
    stayAnchor: isFrench ? 'Hôtel principal' : 'Stay Anchor',
    routeOfDay: isFrench ? 'Route du jour' : 'Route of the day',
    viewDayMap: isFrench ? 'Voir la journée sur map' : 'View day in map',
    roadFlow: isFrench ? 'Flow du voyage' : 'Trip Flow',
    discoverRoad: isFrench ? 'Découvrir le road' : 'Discover the road',
    region: 'Fes-Meknes region',
    confirmFull: isFrench ? 'Confirmer la réservation complète' : 'Confirm Full Booking',
    confirmPartial: isFrench ? 'Confirmer la réservation partielle' : 'Confirm Partial Booking',
    chooseDay: isFrench ? 'Choisir le jour' : 'Choose Day',
    chooseType: isFrench ? 'Choisir les catégories' : 'Choose categories',
    includedItems: isFrench ? 'Éléments inclus' : 'Included items',
    noItems: isFrench ? 'Aucun élément sélectionné.' : 'No items selected.',
    close: isFrench ? 'Fermer' : 'Close',
  }

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
    <>
      <div className='space-y-5 sm:space-y-6'>
        <div className='flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between'>
          <div className='min-w-0'>
            <h2 className='text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl'>
              {copy.dashboard}
            </h2>
            <p className='mt-2 max-w-2xl text-sm leading-7 text-zinc-500'>{copy.subtitle}</p>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <button
              onClick={handleOpenFullModal}
              className='inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800'
            >
              {copy.bookFull}
              <CheckCircle2 className='h-4 w-4' />
            </button>

            <button
              onClick={handleOpenPartialModal}
              className='inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50'
            >
              {copy.bookPartial}
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <StatCard
            title={copy.tripDays}
            value={plan.durationDays}
            change={`${plan.city} ${isFrench ? 'itinéraire' : 'itinerary'}`}
            icon={CalendarDays}
          />
          <StatCard
            title={copy.totalStopsLabel}
            value={totalStops}
            change={isFrench ? 'Hôtels, cafés, activités' : 'Hotels, cafés, activities'}
            icon={Route}
          />
          <StatCard title={copy.tripStyle} value={plan.city} change={copy.region} icon={Compass} />
          <StatCard
            title={copy.estimatedBudget}
            value={plan.totalEstimate}
            change={isFrench ? 'Basé sur ce plan' : 'Based on this plan'}
            icon={Wallet}
          />
        </div>

        <div className='grid grid-cols-1 gap-6 2xl:grid-cols-[380px_minmax(0,1fr)]'>
          <div className='space-y-6'>
            <div className='overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(24,24,27,0.05)]'>
              <div className='relative h-[240px] overflow-hidden sm:h-[280px]'>
                <img src={plan.coverImage} alt={plan.title} className='h-full w-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent' />

                <div className='absolute left-4 right-4 top-4 flex items-center justify-between sm:left-5 sm:right-5 sm:top-5'>
                  <div className='inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-900 backdrop-blur'>
                    <Sparkles className='h-3.5 w-3.5 text-orange-500' />
                    {roadVariant === 'main' ? copy.mainRoad : copy.backupRoad}
                  </div>
                </div>

                <div className='absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80'>
                    {copy.discoverRoad}
                  </p>
                  <h3 className='mt-2 max-w-md text-2xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-3xl'>
                    {plan.title}
                  </h3>
                </div>
              </div>

              <div className='space-y-5 p-4 sm:p-5'>
                <p className='text-sm leading-7 text-zinc-600'>{plan.subtitle}</p>

                <div className='flex flex-wrap gap-2'>
                  {plan.tags.map((tag) => (
                    <span
                      key={tag}
                      className='rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600'
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  <button
                    onClick={() => setRoadVariant('main')}
                    className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold transition ${roadVariant === 'main'
                      ? 'border-orange-200 bg-orange-50 text-orange-600'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                  >
                    <Route className='h-4 w-4' />
                    {copy.mainRoad}
                  </button>

                  <button
                    onClick={() => setRoadVariant('backup')}
                    className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold transition ${roadVariant === 'backup'
                      ? 'border-orange-200 bg-orange-50 text-orange-600'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                  >
                    <RefreshCcw className='h-4 w-4' />
                    {copy.backupRoad}
                  </button>
                </div>
              </div>
            </div>

            <div className='rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_14px_40px_rgba(24,24,27,0.05)] sm:p-5'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <h3 className='text-lg font-semibold text-zinc-950'>{copy.roadFlow}</h3>
                <Link to='/user/trips' className='text-sm font-medium text-orange-600 hover:underline'>
                  {isFrench ? 'Voir tout' : 'View all'}
                </Link>
              </div>

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
                <button
                  key={day.day}
                  onClick={() => setPartialDay(day.day)}
                  className={`rounded-[20px] border p-4 text-left transition ${partialDay === day.day
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
                    className={`flex h-20 flex-col items-center justify-center gap-2 rounded-[22px] border text-sm font-semibold transition ${active
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

          <div className='rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 sm:p-5'>
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
              className='inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50'
            >
              {copy.close}
            </button>
            <button
              onClick={handleConfirmPartialTrip}
              disabled={partialStops.length === 0}
              className='inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {copy.confirmPartial}
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      </ModalShell>
    </>
  )
}
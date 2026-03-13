import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Flame,
  Heart,
  X,
  MapPin,
  Sparkles,
  Star,
  Wallet,
  Wifi,
  CheckCircle2,
  RefreshCcw,
  SlidersHorizontal,
} from 'lucide-react'

type PlaceCategory = 'coffee' | 'restaurant' | 'riad' | 'hotel' | 'jardin' | 'place'

type PreferenceForm = {
  budget?: string
  atmosphere?: string
  vibe?: string
  style?: string
  wifi?: string
  guests?: string
  language?: string
}

type HeroPromptContext = {
  prompt: string
  intent: 'match' | 'dashboard' | 'booking' | 'guide' | 'collab' | 'info'
  city: string
  category: PlaceCategory | 'general' | 'trip'
  preferences?: PreferenceForm
  durationDays?: number | null
  budgetDh?: number | null
  demoPrompts?: string[]
  matchTargetCount?: number
}

type PlaceCard = {
  id: string
  name: string
  city: string
  category: PlaceCategory
  image: string
  description: string
  rating: number
  budget: 'budget' | 'mid-range' | 'premium' | 'luxury'
  wifi: boolean
  atmosphere: string[]
  style: string[]
  tags: string[]
}

function getPromptContext(): HeroPromptContext | null {
  try {
    const raw = sessionStorage.getItem('heroPromptContext')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function getDisplayCategory(category: string) {
  if (category === 'coffee') return 'Coffee Spot'
  if (category === 'restaurant') return 'Restaurant'
  if (category === 'riad') return 'Riad'
  if (category === 'hotel') return 'Hotel'
  if (category === 'jardin') return 'Garden'
  return 'Place'
}

function buildSeries(
  items: Array<{
    id: string
    name: string
    city: string
    category: PlaceCategory
    image: string
    description: string
    rating: number
    budget: 'budget' | 'mid-range' | 'premium' | 'luxury'
    wifi: boolean
    atmosphere: string[]
    style: string[]
    tags: string[]
  }>,
) {
  return items
}

const allPlaces: PlaceCard[] = buildSeries([
  // FEZ COFFEE
  {
    id: 'fez-coffee-1',
    name: 'Foundouk Coffee Atelier',
    city: 'Fez',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=60',
    description: 'Quiet coffee stop near the medina with comfortable seating, pastries, and reliable wifi.',
    rating: 4.8,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet', 'cozy', 'local'],
    style: ['authentic'],
    tags: ['Wifi', 'Quiet', 'Medina'],
  },
  {
    id: 'fez-coffee-2',
    name: 'Rooftop Brew Fez',
    city: 'Fez',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&auto=format&fit=crop&q=60',
    description: 'Panoramic rooftop café with sunset views and a lively social vibe.',
    rating: 4.6,
    budget: 'premium',
    wifi: true,
    atmosphere: ['rooftop', 'social'],
    style: ['premium'],
    tags: ['Rooftop', 'Views', 'Photo Spot'],
  },
  {
    id: 'fez-coffee-3',
    name: 'Dar Mint Café',
    city: 'Fez',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=60',
    description: 'Cozy mint tea and coffee house with a warm local atmosphere.',
    rating: 4.7,
    budget: 'budget',
    wifi: false,
    atmosphere: ['cozy', 'local'],
    style: ['authentic', 'budget'],
    tags: ['Mint Tea', 'Local', 'Budget'],
  },
  {
    id: 'fez-coffee-4',
    name: 'Blue Tile Espresso',
    city: 'Fez',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&auto=format&fit=crop&q=60',
    description: 'Minimal café with good espresso, laptop-friendly tables, and fast internet.',
    rating: 4.5,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet', 'cozy'],
    style: ['premium'],
    tags: ['Laptop Friendly', 'Espresso', 'Fast Wifi'],
  },
  {
    id: 'fez-coffee-5',
    name: 'Medina Social Cup',
    city: 'Fez',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&auto=format&fit=crop&q=60',
    description: 'Busy central spot for meeting travelers and locals over coffee.',
    rating: 4.4,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['social', 'local'],
    style: ['authentic'],
    tags: ['Social', 'Central', 'Locals'],
  },
  {
    id: 'fez-coffee-6',
    name: 'Fez Courtyard Beans',
    city: 'Fez',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=60',
    description: 'A hidden courtyard café with soft music and a relaxed medina atmosphere.',
    rating: 4.7,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['cozy', 'quiet', 'local'],
    style: ['authentic'],
    tags: ['Courtyard', 'Relaxed', 'Hidden Gem'],
  },
  {
    id: 'fez-coffee-7',
    name: 'Craft Roast Fez',
    city: 'Fez',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1494314671902-399b18174975?w=1200&auto=format&fit=crop&q=60',
    description: 'Specialty coffee with a cleaner premium feel and good work tables.',
    rating: 4.6,
    budget: 'premium',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['premium'],
    tags: ['Specialty', 'Remote Work', 'Clean Design'],
  },
  {
    id: 'fez-coffee-8',
    name: 'Bab Boujloud Coffee House',
    city: 'Fez',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&auto=format&fit=crop&q=60',
    description: 'Busy entrance-side café with strong traffic, easy meetups, and quick service.',
    rating: 4.3,
    budget: 'budget',
    wifi: true,
    atmosphere: ['social', 'local'],
    style: ['budget'],
    tags: ['Meetups', 'Quick Stop', 'Central'],
  },

  // MEKNES COFFEE
  {
    id: 'meknes-coffee-1',
    name: 'Meknes Garden Café',
    city: 'Meknes',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=1200&auto=format&fit=crop&q=60',
    description: 'Relaxed garden café ideal for calm mornings and reading.',
    rating: 4.7,
    budget: 'budget',
    wifi: true,
    atmosphere: ['quiet', 'cozy'],
    style: ['budget', 'authentic'],
    tags: ['Garden', 'Quiet', 'Budget'],
  },
  {
    id: 'meknes-coffee-2',
    name: 'Heritage Roast Meknes',
    city: 'Meknes',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&auto=format&fit=crop&q=60',
    description: 'Stylish café with local design details and quality specialty drinks.',
    rating: 4.8,
    budget: 'premium',
    wifi: true,
    atmosphere: ['cozy', 'local'],
    style: ['premium', 'authentic'],
    tags: ['Specialty Coffee', 'Design', 'Wifi'],
  },
  {
    id: 'meknes-coffee-3',
    name: 'Quiet Bean Meknes',
    city: 'Meknes',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=60',
    description: 'Small quiet coffee shop good for focused work and private chats.',
    rating: 4.5,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['mid-range'],
    tags: ['Work Friendly', 'Quiet', 'Central'],
  },
  {
    id: 'meknes-coffee-4',
    name: 'Mint Alley Café',
    city: 'Meknes',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1200&auto=format&fit=crop&q=60',
    description: 'Casual local café popular for mint tea, coffee, and calm conversations.',
    rating: 4.4,
    budget: 'budget',
    wifi: false,
    atmosphere: ['local', 'cozy'],
    style: ['budget', 'authentic'],
    tags: ['Mint Tea', 'Local', 'Casual'],
  },
  {
    id: 'meknes-coffee-5',
    name: 'Volubilis Brew Point',
    city: 'Meknes',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1461988091159-192b6df7054f?w=1200&auto=format&fit=crop&q=60',
    description: 'Modern coffee stop with a clean look and easy daytime work atmosphere.',
    rating: 4.6,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['premium'],
    tags: ['Modern', 'Day Work', 'Comfort'],
  },

  // FEZ RIADS / HOTELS
  {
    id: 'fez-riad-1',
    name: 'Riad Noor Fez',
    city: 'Fez',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=60',
    description: 'Authentic riad with handcrafted interiors and romantic courtyard vibes.',
    rating: 4.9,
    budget: 'premium',
    wifi: true,
    atmosphere: ['cozy', 'quiet'],
    style: ['authentic', 'romantic'],
    tags: ['Courtyard', 'Authentic', 'Romantic'],
  },
  {
    id: 'fez-riad-2',
    name: 'Riad Medina Pearl',
    city: 'Fez',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=60',
    description: 'Elegant riad in the medina with rooftop breakfast and polished service.',
    rating: 4.8,
    budget: 'luxury',
    wifi: true,
    atmosphere: ['quiet', 'rooftop'],
    style: ['premium', 'romantic'],
    tags: ['Luxury', 'Rooftop', 'Breakfast'],
  },
  {
    id: 'fez-riad-3',
    name: 'Riad Zellige House',
    city: 'Fez',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=60',
    description: 'Traditional riad with detailed zellige décor and a peaceful indoor patio.',
    rating: 4.7,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet', 'cozy'],
    style: ['authentic'],
    tags: ['Zellige', 'Patio', 'Traditional'],
  },
  {
    id: 'fez-hotel-1',
    name: 'Atlas Stay Fez',
    city: 'Fez',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop&q=60',
    description: 'Reliable modern hotel with family rooms and practical amenities.',
    rating: 4.5,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['family', 'mid-range'],
    tags: ['Family', 'Reliable', 'Modern'],
  },
  {
    id: 'fez-hotel-2',
    name: 'Fez Panorama Hotel',
    city: 'Fez',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&auto=format&fit=crop&q=60',
    description: 'Comfortable hotel with broad city views and a practical premium stay.',
    rating: 4.6,
    budget: 'premium',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['premium', 'family'],
    tags: ['View', 'Comfort', 'Premium'],
  },

  // MEKNES RIADS -> 14
  {
    id: 'meknes-riad-1',
    name: 'Riad Olive Meknes',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=60',
    description: 'Charming riad with intimate rooms and a calm authentic ambiance.',
    rating: 4.7,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet', 'cozy'],
    style: ['authentic', 'budget'],
    tags: ['Authentic', 'Quiet', 'Charming'],
  },
  {
    id: 'meknes-riad-2',
    name: 'Riad Sultana Court',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=1200&auto=format&fit=crop&q=60',
    description: 'Courtyard riad with warm lighting and a more romantic evening feel.',
    rating: 4.8,
    budget: 'premium',
    wifi: true,
    atmosphere: ['cozy', 'quiet'],
    style: ['romantic', 'authentic'],
    tags: ['Courtyard', 'Romantic', 'Dinner Terrace'],
  },
  {
    id: 'meknes-riad-3',
    name: 'Riad Bab Mansour',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=1200&auto=format&fit=crop&q=60',
    description: 'Popular medina riad with reliable service and traditional room styling.',
    rating: 4.6,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['local', 'cozy'],
    style: ['authentic'],
    tags: ['Medina', 'Traditional', 'Reliable'],
  },
  {
    id: 'meknes-riad-4',
    name: 'Riad Cedar Light',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=60',
    description: 'Bright riad with lighter décor and a relaxed premium layout.',
    rating: 4.5,
    budget: 'premium',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['premium'],
    tags: ['Bright', 'Premium', 'Relaxed'],
  },
  {
    id: 'meknes-riad-5',
    name: 'Riad Palm Arch',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?w=1200&auto=format&fit=crop&q=60',
    description: 'Well-balanced riad for couples or solo travelers who want a quiet base.',
    rating: 4.7,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet', 'cozy'],
    style: ['romantic', 'authentic'],
    tags: ['Solo Friendly', 'Quiet', 'Couples'],
  },
  {
    id: 'meknes-riad-6',
    name: 'Riad Amber Gate',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&auto=format&fit=crop&q=60',
    description: 'Premium medina riad with polished rooms and an easy central location.',
    rating: 4.8,
    budget: 'premium',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['premium', 'authentic'],
    tags: ['Central', 'Premium', 'Medina'],
  },
  {
    id: 'meknes-riad-7',
    name: 'Riad Mosaic House',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=1200&auto=format&fit=crop&q=60',
    description: 'Traditional mosaic-rich riad with local breakfast and peaceful rooms.',
    rating: 4.6,
    budget: 'budget',
    wifi: true,
    atmosphere: ['local', 'quiet'],
    style: ['authentic', 'budget'],
    tags: ['Breakfast', 'Traditional', 'Quiet'],
  },
  {
    id: 'meknes-riad-8',
    name: 'Riad Lantern Meknes',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=60',
    description: 'Soft lantern-lit riad with a cozy evening mood and classic décor.',
    rating: 4.7,
    budget: 'mid-range',
    wifi: false,
    atmosphere: ['cozy', 'quiet'],
    style: ['romantic', 'authentic'],
    tags: ['Lanterns', 'Evening Mood', 'Classic'],
  },
  {
    id: 'meknes-riad-9',
    name: 'Riad Imperial Tile',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=1200&auto=format&fit=crop&q=60',
    description: 'Elegant tile-focused riad with upgraded suites and polished hospitality.',
    rating: 4.9,
    budget: 'luxury',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['premium', 'romantic'],
    tags: ['Luxury', 'Suites', 'Elegant'],
  },
  {
    id: 'meknes-riad-10',
    name: 'Riad Souk Harmony',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?w=1200&auto=format&fit=crop&q=60',
    description: 'A lively-authentic riad close to the souk with easy cultural access.',
    rating: 4.4,
    budget: 'budget',
    wifi: false,
    atmosphere: ['local', 'social'],
    style: ['authentic', 'budget'],
    tags: ['Souk', 'Local', 'Affordable'],
  },
  {
    id: 'meknes-riad-11',
    name: 'Riad Zaytouna',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=1200&auto=format&fit=crop&q=60',
    description: 'Balanced riad with family-friendly rooms and a calm central courtyard.',
    rating: 4.5,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['family', 'authentic'],
    tags: ['Family', 'Courtyard', 'Central'],
  },
  {
    id: 'meknes-riad-12',
    name: 'Riad Royal Mint',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&auto=format&fit=crop&q=60',
    description: 'Premium stay with refined local décor and comfortable room spacing.',
    rating: 4.6,
    budget: 'premium',
    wifi: true,
    atmosphere: ['cozy'],
    style: ['premium', 'authentic'],
    tags: ['Refined', 'Comfort', 'Premium'],
  },
  {
    id: 'meknes-riad-13',
    name: 'Riad Blue Cedar',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=1200&auto=format&fit=crop&q=60',
    description: 'Quiet riad with understated design and strong value for longer stays.',
    rating: 4.5,
    budget: 'budget',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['budget'],
    tags: ['Value', 'Long Stay', 'Quiet'],
  },
  {
    id: 'meknes-riad-14',
    name: 'Riad Andalus Secret',
    city: 'Meknes',
    category: 'riad',
    image: 'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?w=1200&auto=format&fit=crop&q=60',
    description: 'Small hidden riad with strong authentic charm and a romantic feel.',
    rating: 4.8,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['cozy', 'quiet'],
    style: ['romantic', 'authentic'],
    tags: ['Hidden Gem', 'Authentic', 'Romantic'],
  },

  // MEKNES HOTELS
  {
    id: 'meknes-hotel-1',
    name: 'Imperial Suites Meknes',
    city: 'Meknes',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&auto=format&fit=crop&q=60',
    description: 'Comfortable premium hotel for travelers who want convenience and polished rooms.',
    rating: 4.6,
    budget: 'premium',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['premium', 'family'],
    tags: ['Premium', 'Comfort', 'Central'],
  },
  {
    id: 'meknes-hotel-2',
    name: 'Meknes City Lodge',
    city: 'Meknes',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop&q=60',
    description: 'Practical hotel stay with fast check-in and dependable amenities.',
    rating: 4.4,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['family', 'mid-range'],
    tags: ['Practical', 'Fast Check-in', 'Reliable'],
  },

  // JARDINS
  {
    id: 'fez-jardin-1',
    name: 'Jnan Sbil Escape',
    city: 'Fez',
    category: 'jardin',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=60',
    description: 'Classic Fez garden experience with walking paths, shade, and calm energy.',
    rating: 4.9,
    budget: 'budget',
    wifi: false,
    atmosphere: ['quiet', 'local'],
    style: ['authentic'],
    tags: ['Nature', 'Walks', 'Calm'],
  },
  {
    id: 'fez-jardin-2',
    name: 'Andalus Garden Corner',
    city: 'Fez',
    category: 'jardin',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=60',
    description: 'Smaller garden stop perfect for a peaceful break in the city.',
    rating: 4.5,
    budget: 'budget',
    wifi: false,
    atmosphere: ['quiet', 'cozy'],
    style: ['budget'],
    tags: ['Relax', 'Green', 'Short Stop'],
  },
  {
    id: 'meknes-jardin-1',
    name: 'Meknes Palm Garden',
    city: 'Meknes',
    category: 'jardin',
    image: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1200&auto=format&fit=crop&q=60',
    description: 'Open green space with relaxed paths and a local family atmosphere.',
    rating: 4.4,
    budget: 'budget',
    wifi: false,
    atmosphere: ['quiet', 'local'],
    style: ['family'],
    tags: ['Family', 'Nature', 'Relaxed'],
  },
  {
    id: 'meknes-jardin-2',
    name: 'Meknes Quiet Grove',
    city: 'Meknes',
    category: 'jardin',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1200&auto=format&fit=crop&q=60',
    description: 'A calmer green break suited for reading and slower afternoons.',
    rating: 4.5,
    budget: 'budget',
    wifi: false,
    atmosphere: ['quiet', 'cozy'],
    style: ['budget'],
    tags: ['Reading', 'Green Break', 'Afternoon'],
  },

  // RESTAURANTS
  {
    id: 'fez-restaurant-1',
    name: 'Dar Taste Fez',
    city: 'Fez',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=60',
    description: 'Traditional dining with refined plating and local classics.',
    rating: 4.8,
    budget: 'premium',
    wifi: false,
    atmosphere: ['cozy', 'local'],
    style: ['authentic', 'premium'],
    tags: ['Traditional', 'Dinner', 'Local Cuisine'],
  },
  {
    id: 'fez-restaurant-2',
    name: 'Medina Grill House',
    city: 'Fez',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&auto=format&fit=crop&q=60',
    description: 'Lively food spot for groups, quick meals, and a social atmosphere.',
    rating: 4.3,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['social'],
    style: ['mid-range'],
    tags: ['Groups', 'Fast Service', 'Social'],
  },
  {
    id: 'fez-restaurant-3',
    name: 'Riad Table Fez',
    city: 'Fez',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=60',
    description: 'More intimate restaurant for a slower dinner in a refined riad setting.',
    rating: 4.7,
    budget: 'premium',
    wifi: false,
    atmosphere: ['quiet', 'cozy'],
    style: ['authentic', 'romantic'],
    tags: ['Intimate', 'Riad Dining', 'Dinner'],
  },
  {
    id: 'meknes-restaurant-1',
    name: 'Heritage Table Meknes',
    city: 'Meknes',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=60',
    description: 'Elegant heritage restaurant good for a slower cultural dinner.',
    rating: 4.7,
    budget: 'premium',
    wifi: false,
    atmosphere: ['quiet', 'cozy'],
    style: ['premium', 'authentic'],
    tags: ['Elegant', 'Dinner', 'Heritage'],
  },
  {
    id: 'meknes-restaurant-2',
    name: 'Square Market Kitchen',
    city: 'Meknes',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&auto=format&fit=crop&q=60',
    description: 'Social restaurant with easy lunch options and a lighter urban feel.',
    rating: 4.4,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['social'],
    style: ['mid-range'],
    tags: ['Lunch', 'Urban', 'Easy Stop'],
  },

  // TANGIER
  {
    id: 'tangier-coffee-1',
    name: 'Tangier Bay Café',
    city: 'Tangier',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&auto=format&fit=crop&q=60',
    description: 'Bright café near the bay with strong coffee and a social urban feel.',
    rating: 4.6,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['social', 'rooftop'],
    style: ['premium'],
    tags: ['Bay View', 'Urban', 'Wifi'],
  },
  {
    id: 'tangier-hotel-1',
    name: 'Tangier Port Stay',
    city: 'Tangier',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&auto=format&fit=crop&q=60',
    description: 'Modern hotel close to the port, ideal for efficient city stays.',
    rating: 4.5,
    budget: 'mid-range',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['family', 'mid-range'],
    tags: ['Port', 'Modern', 'Convenient'],
  },
  {
    id: 'tangier-hotel-2',
    name: 'Kasbah Horizon Hotel',
    city: 'Tangier',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&auto=format&fit=crop&q=60',
    description: 'Premium stay with a calmer atmosphere and strong city access.',
    rating: 4.7,
    budget: 'premium',
    wifi: true,
    atmosphere: ['quiet'],
    style: ['premium'],
    tags: ['Kasbah', 'Premium', 'City Access'],
  },
])

function scorePlace(place: PlaceCard, context: HeroPromptContext | null) {
  if (!context) return 0

  let score = 0
  const prefs = context.preferences

  if (place.city === context.city) score += 4
  if (place.category === context.category) score += 4

  if (prefs?.budget && prefs.budget === place.budget) score += 3
  if (prefs?.atmosphere && place.atmosphere.includes(prefs.atmosphere)) score += 3
  if (prefs?.style && place.style.includes(prefs.style)) score += 3
  if (prefs?.wifi === 'yes' && place.wifi) score += 2
  if (prefs?.wifi === 'no') score += 1
  if (place.rating >= 4.7) score += 1

  return score
}

function matchesBaseIntent(place: PlaceCard, context: HeroPromptContext | null) {
  if (!context) return true

  const cityOk = context.city ? place.city === context.city : true
  const categoryOk =
    context.category && context.category !== 'general' && context.category !== 'trip'
      ? place.category === context.category
      : true

  if (cityOk && categoryOk) return true
  if (cityOk && context.category === 'general') return true

  return false
}

function matchesPreferences(place: PlaceCard, context: HeroPromptContext | null) {
  if (!context?.preferences) return true

  const prefs = context.preferences

  if (prefs.budget && place.budget !== prefs.budget) return false
  if (prefs.atmosphere && !place.atmosphere.includes(prefs.atmosphere)) return false
  if (prefs.style && !place.style.includes(prefs.style)) return false
  if (prefs.wifi === 'yes' && !place.wifi) return false

  return true
}

function getMatchPlaces(context: HeroPromptContext | null, strictFilters: boolean) {
  const baseMatches = allPlaces.filter((place) => matchesBaseIntent(place, context))
  const source = baseMatches.length ? baseMatches : allPlaces

  const filtered = strictFilters ? source.filter((place) => matchesPreferences(place, context)) : source
  const finalSource = filtered.length ? filtered : source

  return [...finalSource].sort((a, b) => scorePlace(b, context) - scorePlace(a, context))
}

function getActiveFilterChips(context: HeroPromptContext | null) {
  if (!context?.preferences) return []

  const chips: string[] = []

  if (context.preferences.budget) chips.push(`Budget: ${context.preferences.budget}`)
  if (context.preferences.atmosphere) chips.push(`Atmosphere: ${context.preferences.atmosphere}`)
  if (context.preferences.style) chips.push(`Style: ${context.preferences.style}`)
  if (context.preferences.wifi === 'yes') chips.push('Wi-Fi required')

  return chips
}

export default function UserMatch() {
  const context = useMemo(() => getPromptContext(), [])
  const [strictFilters, setStrictFilters] = useState(true)

  const initialDeck = useMemo(() => getMatchPlaces(context, strictFilters), [context, strictFilters])

  const [round, setRound] = useState(1)
  const [deck, setDeck] = useState<PlaceCard[]>(initialDeck)
  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState<PlaceCard[]>([])
  const [rejected, setRejected] = useState<string[]>([])
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)

  const current = deck[index]
  const next = deck[index + 1]
  const activeFilterChips = useMemo(() => getActiveFilterChips(context), [context])

  useEffect(() => {
    setDeck(initialDeck)
    setIndex(0)
    setLiked([])
    setRejected([])
    setRound(1)
    setDrag({ x: 0, y: 0 })
    setSwipeDir(null)
  }, [initialDeck])

  const progress = useMemo(() => {
    if (!deck.length) return 100
    return Math.min(((index + 1) / deck.length) * 100, 100)
  }, [deck.length, index])

  const finalPool = liked.length ? liked : deck
  const finalMain = finalPool[0] ?? null
  const finalBackup = finalPool[1] ?? null

  const startNextRoundOrFinish = (nextLiked: PlaceCard[]) => {
    if (nextLiked.length > 1) {
      setDeck(nextLiked)
      setLiked([])
      setRejected([])
      setIndex(0)
      setRound((prev) => prev + 1)
      setDrag({ x: 0, y: 0 })
      setSwipeDir(null)
      return
    }

    setDeck(nextLiked.length ? nextLiked : [])
    setLiked(nextLiked)
    setIndex(0)
    setDrag({ x: 0, y: 0 })
    setSwipeDir(null)
  }

  const processDecision = (direction: 'left' | 'right') => {
    if (!current) return

    const nextLiked = direction === 'right' ? [...liked, current] : liked
    const isLastCard = index >= deck.length - 1

    if (direction === 'right') {
      setLiked(nextLiked)
    } else {
      setRejected((prev) => [...prev, current.id])
    }

    if (isLastCard) {
      window.setTimeout(() => {
        startNextRoundOrFinish(nextLiked)
      }, 280)
      return
    }

    window.setTimeout(() => {
      setIndex((prev) => prev + 1)
      setDrag({ x: 0, y: 0 })
      setSwipeDir(null)
    }, 280)
  }

  const commitSwipe = (direction: 'left' | 'right') => {
    setSwipeDir(direction)
    processDecision(direction)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!current) return
    setIsDragging(true)
    startRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !startRef.current) return
    const dx = event.clientX - startRef.current.x
    const dy = event.clientY - startRef.current.y
    setDrag({ x: dx, y: dy })
  }

  const resetDrag = () => {
    setDrag({ x: 0, y: 0 })
    setIsDragging(false)
    startRef.current = null
  }

  const handlePointerUp = () => {
    if (!isDragging) return

    if (Math.abs(drag.x) > 110) {
      setIsDragging(false)
      startRef.current = null
      commitSwipe(drag.x > 0 ? 'right' : 'left')
    } else {
      resetDrag()
    }
  }

  const restartMatches = () => {
    setDeck(initialDeck)
    setIndex(0)
    setLiked([])
    setRejected([])
    setRound(1)
    setDrag({ x: 0, y: 0 })
    setSwipeDir(null)
  }

  const isFinished = !current && (liked.length > 0 || deck.length <= 1)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
          Match Places
        </h2>
        <p className="text-sm text-zinc-500">
          {context?.city && context?.category && context.category !== 'general'
            ? `Swipe through ${context.category} recommendations in ${context.city} and find your best fit.`
            : 'Swipe through place recommendations and find your best fit.'}
        </p>
      </div>

      <div className="rounded-full bg-zinc-100">
        <div className="h-2 rounded-full bg-orange-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-col gap-3 rounded-[24px] border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {strictFilters ? 'Using your preferences' : 'Showing all suggestions'}
          </span>

          {activeFilterChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
            >
              {chip}
            </span>
          ))}
        </div>

        <button
          onClick={() => setStrictFilters((prev) => !prev)}
          className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          {strictFilters ? 'Remove filters' : 'Use my filters again'}
        </button>
      </div>

      {!isFinished ? (
        <>
          <div className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span>Round {round}</span>
            </div>
            <div>
              Suggestions:{' '}
              <span className="font-semibold text-zinc-900">{deck.length}</span>
            </div>
          </div>

          <div className="relative mx-auto h-[500px] max-w-[360px] sm:h-[520px] sm:max-w-[380px] xl:h-[540px] xl:max-w-[390px]">
            {next && (
              <div className="absolute inset-0 translate-y-1 scale-[0.965] rounded-[28px] bg-white shadow-[0_16px_34px_rgba(15,23,42,0.10)]" />
            )}

            {current ? (
              <div
                className="relative h-full overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
                style={{
                  transform: swipeDir
                    ? `translateX(${swipeDir === 'right' ? 560 : -560}px) rotate(${swipeDir === 'right' ? 16 : -16}deg)`
                    : `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.x / 18}deg)`,
                  transition: isDragging ? 'none' : 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                  touchAction: 'pan-y',
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <img src={current.image} alt={current.name} className="h-[55%] w-full object-cover" />
                <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-t from-black/45 to-transparent" />

                <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-zinc-700">
                  {current.city}, Morocco
                </div>

                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                  <Sparkles className="h-3 w-3" />
                  {getDisplayCategory(current.category)}
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-[28px] leading-tight font-semibold text-zinc-900 sm:text-[30px]">
                      {current.name}
                    </div>

                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {current.rating.toFixed(1)}
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-zinc-500">{current.description}</p>

                  <div className="mt-4 grid gap-2 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {current.city}, Morocco
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      {current.budget}
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      {current.wifi ? 'Wi-Fi available' : 'No Wi-Fi'}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {current.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-[28px] border border-zinc-200 bg-white text-sm text-zinc-500">
                No more places to match right now.
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => current && commitSwipe('left')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition hover:bg-zinc-50"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={() => current && commitSwipe('right')}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_14px_30px_rgba(249,115,22,0.35)] transition hover:scale-[1.03]"
            >
              <Heart className="h-6 w-6" />
            </button>

            <button
              onClick={() => current && commitSwipe('right')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-200 bg-orange-500/10 text-orange-500 shadow-sm transition hover:bg-orange-500/15"
            >
              <Flame className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-5">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-orange-500">
              <CheckCircle2 className="h-4 w-4" />
              Best Match Found
            </div>

            {finalMain ? (
              <div className="grid gap-4 md:grid-cols-[170px_1fr]">
                <img
                  src={finalMain.image}
                  alt={finalMain.name}
                  className="h-[170px] w-full rounded-2xl object-cover"
                />

                <div>
                  <h3 className="text-2xl font-semibold text-zinc-900">{finalMain.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{finalMain.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {finalMain.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-zinc-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {finalMain.city}, Morocco
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      {finalMain.budget}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-current text-amber-500" />
                      {finalMain.rating.toFixed(1)} rating
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No main match found.</p>
            )}
          </div>

          {finalBackup && (
            <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <Sparkles className="h-4 w-4 text-orange-500" />
                Backup Option
              </div>

              <div className="grid gap-4 md:grid-cols-[150px_1fr]">
                <img
                  src={finalBackup.image}
                  alt={finalBackup.name}
                  className="h-[150px] w-full rounded-2xl object-cover"
                />

                <div>
                  <h3 className="text-xl font-semibold text-zinc-900">{finalBackup.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{finalBackup.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {finalBackup.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={restartMatches}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Restart Matching
          </button>
        </div>
      )}
    </div>
  )
}
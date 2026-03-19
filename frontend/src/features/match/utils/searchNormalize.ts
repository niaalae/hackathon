import type { TripSwipeItem, TripType } from '@/types/match'

function normalizeText(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function normalizeCity(input: string): string | null {
  const value = normalizeText(input)

  if (value.includes('fez') || value.includes('fes')) return 'Fez'
  if (value.includes('meknes')) return 'Meknes'
  if (value.includes('tangier') || value.includes('tanger')) return 'Tangier'
  if (value.includes('marrakech')) return 'Marrakech'
  if (value.includes('agadir')) return 'Agadir'
  if (value.includes('essaouira')) return 'Essaouira'
  if (value.includes('rabat')) return 'Rabat'
  if (value.includes('chefchaouen')) return 'Chefchaouen'
  if (value.includes('merzouga')) return 'Merzouga'
  if (value.includes('azrou')) return 'Azrou'

  return null
}

export function normalizeTripType(input: string): TripType | null {
  const value = normalizeText(input)

  if (value.includes('city') || value.includes('urban')) return 'city-break'
  if (value.includes('culture') || value.includes('heritage') || value.includes('medina')) return 'culture'
  if (value.includes('food') || value.includes('restaurant') || value.includes('taste')) return 'food'
  if (value.includes('nature') || value.includes('forest') || value.includes('mountain')) return 'nature'
  if (value.includes('beach') || value.includes('coast') || value.includes('sea')) return 'beach'
  if (value.includes('adventure') || value.includes('desert') || value.includes('trek')) return 'adventure'

  return null
}

export function matchesTripSearch(trip: TripSwipeItem, query: string) {
  const normalizedQuery = normalizeText(query)
  const detectedType = normalizeTripType(normalizedQuery)
  const detectedCity = normalizeCity(normalizedQuery)

  const byType = detectedType ? trip.tripType === detectedType : true
  const byCity = detectedCity ? trip.city === detectedCity : true

  const byText =
    normalizeText(trip.title).includes(normalizedQuery) ||
    normalizeText(trip.city).includes(normalizedQuery) ||
    normalizeText(trip.description).includes(normalizedQuery) ||
    trip.tags.some((tag) => normalizeText(tag).includes(normalizedQuery)) ||
    trip.vibes.some((vibe) => normalizeText(vibe).includes(normalizedQuery))

  return detectedType || detectedCity ? byType && byCity : byText
}


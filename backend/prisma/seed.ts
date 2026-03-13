import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { randomUUID } from 'node:crypto'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

const DEFAULT_SCALE = 10
const SCALE = Math.max(1, Number.parseInt(process.env.SEED_SCALE ?? `${DEFAULT_SCALE}`, 10) || DEFAULT_SCALE)
const CHUNK_SIZE = 500

const COUNTS = {
  regions: 6 * SCALE,
  cities: 18 * SCALE,
  attractions: 120 * SCALE,
  tags: 30 * SCALE,
  users: 120 * SCALE,
  guides: 18 * SCALE,
  trips: 60 * SCALE,
  tripItems: 300 * SCALE,
  bookings: 120 * SCALE,
  ratings: 120 * SCALE,
  messages: 120 * SCALE,
  swipes: 240 * SCALE,
  matches: 90 * SCALE,
  infoBlocks: 150 * SCALE,
  translations: 120 * SCALE,
  guideMediaPerGuide: 2,
  guidePastTripsPerGuide: 1,
  attractionMediaPerAttraction: 1
}

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=1200&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop&q=60'
]

const COUNTRIES = ['Portugal', 'Spain', 'Italy', 'France', 'Greece', 'Turkey', 'USA', 'Mexico', 'Japan', 'Thailand']
const TIMEZONES = ['Europe/Lisbon', 'Europe/Madrid', 'Europe/Paris', 'America/New_York', 'Asia/Tokyo', 'Africa/Casablanca']
const ATTRACTION_TYPES = ['Landmark', 'Museum', 'Beach', 'Market', 'Trail', 'Gallery', 'Fort', 'Park', 'Viewpoint', 'Palace']
const BOOKING_TYPES = ['FLIGHT', 'STAY', 'EXPERIENCE', 'RENTAL', 'GUIDE'] as const
const BOOKING_STATUS = ['PENDING', 'CONFIRMED', 'CANCELED'] as const
const TRIP_STATUS = ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELED'] as const
const COLLAB_ROLES = ['EDITOR', 'VIEWER'] as const
const MEDIA_TYPES = ['PHOTO', 'VIDEO'] as const
const SWIPE_DIRECTIONS = ['LIKE', 'PASS'] as const
const MATCH_STATUS = ['ACTIVE', 'BLOCKED'] as const
const INFO_CATEGORIES = ['tips', 'transport', 'budget', 'food', 'safety', 'weather', 'events']

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)

function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min
}

function pick<T>(items: readonly T[]): T {
  return items[randInt(0, items.length - 1)]
}

function pickManyUnique<T>(items: readonly T[], count: number) {
  const result = new Set<T>()
  const max = Math.min(count, items.length)
  while (result.size < max) {
    result.add(pick(items))
  }
  return Array.from(result)
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

async function createManyInBatches<T>(label: string, items: T[], action: (data: T[]) => Promise<unknown>) {
  for (const batch of chunk(items, CHUNK_SIZE)) {
    await action(batch)
  }
  console.log(`${label}: ${items.length}`)
}

function imageFor(index: number) {
  return IMAGE_POOL[index % IMAGE_POOL.length]
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86400000)
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 3600000)
}

async function clearData() {
  await prisma.match.deleteMany()
  await prisma.swipe.deleteMany()
  await prisma.message.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.tripItem.deleteMany()
  await prisma.tripCollaborator.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.guidePastTrip.deleteMany()
  await prisma.guideMedia.deleteMany()
  await prisma.guide.deleteMany()
  await prisma.attractionTagMap.deleteMany()
  await prisma.attractionMedia.deleteMany()
  await prisma.infoBlock.deleteMany()
  await prisma.translation.deleteMany()
  await prisma.attraction.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.city.deleteMany()
  await prisma.region.deleteMany()
  await prisma.user.deleteMany()
}

async function main() {
  await clearData()

  const regionData = Array.from({ length: COUNTS.regions }, (_, index) => ({
    id: randomUUID(),
    name: `Region ${index + 1}`,
    country: pick(COUNTRIES),
    slug: `region-${String(index + 1).padStart(4, '0')}`,
    description: `Region ${index + 1} travel highlights and local culture.`,
    coverImage: imageFor(index)
  }))

  await createManyInBatches('regions', regionData, (data) => prisma.region.createMany({ data }))

  const regionIds = regionData.map((region) => region.id)

  const cityData = Array.from({ length: COUNTS.cities }, (_, index) => {
    const regionId = regionIds[index % regionIds.length]
    return {
      id: randomUUID(),
      regionId,
      name: `City ${index + 1}`,
      slug: `city-${String(index + 1).padStart(5, '0')}`,
      lat: Number((rand() * 140 - 70).toFixed(6)),
      lng: Number((rand() * 360 - 180).toFixed(6)),
      timezone: pick(TIMEZONES),
      description: `City ${index + 1} is known for food, views, and neighborhoods.`,
      coverImage: imageFor(index + 1)
    }
  })

  await createManyInBatches('cities', cityData, (data) => prisma.city.createMany({ data }))

  const cityIds = cityData.map((city) => city.id)

  const tagData = Array.from({ length: COUNTS.tags }, (_, index) => ({
    id: randomUUID(),
    name: `tag-${String(index + 1).padStart(4, '0')}`
  }))

  await createManyInBatches('tags', tagData, (data) => prisma.tag.createMany({ data }))

  const tagIds = tagData.map((tag) => tag.id)

  const attractionData = Array.from({ length: COUNTS.attractions }, (_, index) => {
    const cityId = cityIds[index % cityIds.length]
    return {
      id: randomUUID(),
      cityId,
      name: `Attraction ${index + 1}`,
      slug: `attraction-${String(index + 1).padStart(6, '0')}`,
      type: pick(ATTRACTION_TYPES),
      lat: Number((rand() * 140 - 70).toFixed(6)),
      lng: Number((rand() * 360 - 180).toFixed(6)),
      description: `Attraction ${index + 1} is a popular stop for visitors.`,
      avgPrice: Number((rand() * 45 + 5).toFixed(2)),
      durationMinutes: randInt(30, 240),
      coverImage: imageFor(index + 2)
    }
  })

  await createManyInBatches('attractions', attractionData, (data) => prisma.attraction.createMany({ data }))

  const attractionIds = attractionData.map((attraction) => attraction.id)

  const attractionMediaData = attractionData.flatMap((attraction, index) =>
    Array.from({ length: COUNTS.attractionMediaPerAttraction }, (_, mediaIndex) => ({
      id: randomUUID(),
      attractionId: attraction.id,
      type: pick(MEDIA_TYPES),
      url: imageFor(index + mediaIndex),
      caption: `Attraction ${index + 1} media ${mediaIndex + 1}`,
      position: mediaIndex
    }))
  )

  await createManyInBatches('attraction media', attractionMediaData, (data) => prisma.attractionMedia.createMany({ data }))

  const attractionTagData = attractionData.flatMap((attraction) => {
    const tags = pickManyUnique(tagIds, randInt(2, 4))
    return tags.map((tagId) => ({
      attractionId: attraction.id,
      tagId
    }))
  })

  await createManyInBatches('attraction tags', attractionTagData, (data) => prisma.attractionTagMap.createMany({ data }))

  const adminCount = Math.min(2, COUNTS.users)
  const guideCount = Math.min(COUNTS.guides, Math.max(0, COUNTS.users - adminCount))
  const travelerCount = Math.max(0, COUNTS.users - adminCount - guideCount)

  const adminUsers = Array.from({ length: adminCount }, (_, index) => ({
    id: randomUUID(),
    email: `admin${index + 1}@example.com`,
    passwordHash: bcrypt.hashSync('demo_hash_admin',12),
    name: `Admin ${index + 1}`,
    role: 'ADMIN' as const
  }))

  const guideUsers = Array.from({ length: guideCount }, (_, index) => ({
    id: randomUUID(),
    email: `guide${String(index + 1).padStart(5, '0')}@example.com`,
    passwordHash: 'demo_hash_guide',
    name: `Guide User ${index + 1}`,
    avatarUrl: imageFor(index),
    role: 'GUIDE' as const,
    preferences: {
      focus: pick(['history', 'food', 'nature', 'nightlife', 'culture']),
      pace: pick(['slow', 'moderate', 'fast']),
      languages: ['en']
    }
  }))

  const travelerUsers = Array.from({ length: travelerCount }, (_, index) => ({
    id: randomUUID(),
    email: `traveler${String(index + 1).padStart(6, '0')}@example.com`,
    passwordHash: 'demo_hash_traveler',
    name: `Traveler ${index + 1}`,
    avatarUrl: imageFor(index + 3),
    role: 'TRAVELER' as const,
    preferences: {
      travelStyle: pickManyUnique(['food', 'history', 'nature', 'art', 'beach', 'nightlife'], randInt(1, 3)),
      pace: pick(['slow', 'moderate', 'fast']),
      budget: pick(['low', 'mid', 'high']),
      currency: 'USD'
    }
  }))

  const userData = [...adminUsers, ...guideUsers, ...travelerUsers]
  await createManyInBatches('users', userData, (data) => prisma.user.createMany({ data }))

  const guideData = guideUsers.map((user, index) => ({
    id: randomUUID(),
    userId: user.id,
    headline: `Expert guide ${index + 1}`,
    bio: `Guide ${index + 1} specializes in custom itineraries and local tips.`,
    rateHourly: Number((rand() * 60 + 20).toFixed(2)),
    rateDaily: Number((rand() * 350 + 120).toFixed(2)),
    locationCityId: cityIds[index % cityIds.length],
    contactEmail: user.email,
    contactPhone: `+100000${String(index + 1).padStart(4, '0')}`,
    verified: rand() > 0.4,
    ratingAvg: Number((rand() * 1.5 + 3.5).toFixed(2)),
    ratingCount: randInt(3, 150)
  }))

  await createManyInBatches('guides', guideData, (data) => prisma.guide.createMany({ data }))

  const guideIds = guideData.map((guide) => guide.id)

  const guideMediaData = guideData.flatMap((guide, index) =>
    Array.from({ length: COUNTS.guideMediaPerGuide }, (_, mediaIndex) => ({
      id: randomUUID(),
      guideId: guide.id,
      type: pick(MEDIA_TYPES),
      url: imageFor(index + mediaIndex),
      caption: `Guide ${index + 1} media ${mediaIndex + 1}`,
      position: mediaIndex
    }))
  )

  await createManyInBatches('guide media', guideMediaData, (data) => prisma.guideMedia.createMany({ data }))

  const guidePastTripData = guideData.flatMap((guide, index) =>
    Array.from({ length: COUNTS.guidePastTripsPerGuide }, (_, tripIndex) => ({
      id: randomUUID(),
      guideId: guide.id,
      title: `Past trip ${index + 1}-${tripIndex + 1}`,
      location: `Region ${randInt(1, COUNTS.regions)}`,
      startDate: addDays(new Date('2025-01-01T08:00:00Z'), randInt(1, 250)),
      endDate: addDays(new Date('2025-01-01T08:00:00Z'), randInt(251, 350)),
      summary: `Highlights from past trip ${index + 1}-${tripIndex + 1}.`,
      mediaUrl: imageFor(index + 1)
    }))
  )

  await createManyInBatches('guide past trips', guidePastTripData, (data) => prisma.guidePastTrip.createMany({ data }))

  const travelerIds = travelerUsers.map((user) => user.id)
  const tripBaseDate = new Date('2026-01-01T09:00:00Z')

  const tripData = Array.from({ length: COUNTS.trips }, (_, index) => {
    const ownerUserId = travelerIds[index % travelerIds.length]
    const startDate = addDays(tripBaseDate, randInt(1, 330))
    const endDate = addDays(startDate, randInt(3, 12))
    return {
      id: randomUUID(),
      ownerUserId,
      title: `Trip ${index + 1}`,
      status: pick(TRIP_STATUS),
      startDate,
      endDate,
      budgetTotal: Number((rand() * 4000 + 500).toFixed(2)),
      currency: 'USD'
    }
  })

  await createManyInBatches('trips', tripData, (data) => prisma.trip.createMany({ data }))

  const tripIds = tripData.map((trip) => trip.id)

  const tripCollaboratorData = tripData.flatMap((trip) => {
    const collaborators = pickManyUnique(travelerIds, randInt(1, 3)).filter((id) => id !== trip.ownerUserId)
    return collaborators.map((userId) => ({
      tripId: trip.id,
      userId,
      role: pick(COLLAB_ROLES)
    }))
  })

  await createManyInBatches('trip collaborators', tripCollaboratorData, (data) =>
    prisma.tripCollaborator.createMany({ data })
  )

  const tripItemsData = Array.from({ length: COUNTS.tripItems }, (_, index) => {
    const trip = tripData[index % tripData.length]
    const day = randInt(1, 8)
    const time = addHours(addDays(trip.startDate ?? tripBaseDate, day - 1), randInt(8, 20))
    return {
      id: randomUUID(),
      tripId: trip.id,
      day,
      title: `Activity ${index + 1}`,
      location: `Area ${randInt(1, 50)}`,
      time,
      notes: `Notes for activity ${index + 1}.`,
      type: pick(['arrival', 'sightseeing', 'excursion', 'food', 'relax'])
    }
  })

  await createManyInBatches('trip items', tripItemsData, (data) => prisma.tripItem.createMany({ data }))

  const bookingsData = Array.from({ length: COUNTS.bookings }, (_, index) => {
    const trip = tripData[index % tripData.length]
    const startDate = addDays(trip.startDate ?? tripBaseDate, randInt(0, 5))
    const endDate = addDays(startDate, randInt(1, 6))
    return {
      id: randomUUID(),
      tripId: trip.id,
      userId: trip.ownerUserId,
      type: pick(BOOKING_TYPES),
      provider: `Provider ${randInt(1, 30)}`,
      externalRef: `REF-${randInt(100000, 999999)}`,
      price: Number((rand() * 900 + 50).toFixed(2)),
      currency: 'USD',
      status: pick(BOOKING_STATUS),
      startDate,
      endDate
    }
  })

  await createManyInBatches('bookings', bookingsData, (data) => prisma.booking.createMany({ data }))

  const ratingsData = Array.from({ length: COUNTS.ratings }, (_, index) => ({
    id: randomUUID(),
    fromUserId: travelerIds[index % travelerIds.length],
    guideId: guideIds[index % guideIds.length],
    tripId: tripIds[index % tripIds.length],
    score: randInt(3, 5),
    comment: `Review ${index + 1} from traveler feedback.`
  }))

  await createManyInBatches('ratings', ratingsData, (data) => prisma.rating.createMany({ data }))

  const messagesData = Array.from({ length: COUNTS.messages }, (_, index) => ({
    id: randomUUID(),
    fromUserId: travelerIds[index % travelerIds.length],
    toGuideId: guideIds[index % guideIds.length],
    tripId: tripIds[index % tripIds.length],
    message: `Message ${index + 1} about trip details.`,
    status: pick(['sent', 'read', 'archived'])
  }))

  await createManyInBatches('messages', messagesData, (data) => prisma.message.createMany({ data }))

  const swipesData = Array.from({ length: COUNTS.swipes }, (_, index) => ({
    id: randomUUID(),
    fromUserId: travelerIds[index % travelerIds.length],
    targetGuideId: guideIds[index % guideIds.length],
    direction: pick(SWIPE_DIRECTIONS)
  }))

  await createManyInBatches('swipes', swipesData, (data) => prisma.swipe.createMany({ data }))

  const matchesData = Array.from({ length: COUNTS.matches }, (_, index) => ({
    id: randomUUID(),
    userId: travelerIds[index % travelerIds.length],
    guideId: guideIds[index % guideIds.length],
    status: pick(MATCH_STATUS)
  }))

  await createManyInBatches('matches', matchesData, (data) => prisma.match.createMany({ data }))

  const infoBlocks: Array<{
    id: string
    scope: 'REGION' | 'CITY' | 'ATTRACTION'
    regionId?: string
    cityId?: string
    attractionId?: string
    title: string
    content: string
    category: string
    language: string
  }> = []

  const perScope = Math.floor(COUNTS.infoBlocks / 3)
  for (let i = 0; i < perScope; i += 1) {
    infoBlocks.push({
      id: randomUUID(),
      scope: 'REGION',
      regionId: regionIds[i % regionIds.length],
      title: `Region tip ${i + 1}`,
      content: `Helpful region tip ${i + 1} for visitors.`,
      category: pick(INFO_CATEGORIES),
      language: 'en'
    })
  }

  for (let i = 0; i < perScope; i += 1) {
    infoBlocks.push({
      id: randomUUID(),
      scope: 'CITY',
      cityId: cityIds[i % cityIds.length],
      title: `City tip ${i + 1}`,
      content: `Helpful city tip ${i + 1} for visitors.`,
      category: pick(INFO_CATEGORIES),
      language: 'en'
    })
  }

  for (let i = 0; i < COUNTS.infoBlocks - perScope * 2; i += 1) {
    infoBlocks.push({
      id: randomUUID(),
      scope: 'ATTRACTION',
      attractionId: attractionIds[i % attractionIds.length],
      title: `Attraction tip ${i + 1}`,
      content: `Helpful attraction tip ${i + 1} for visitors.`,
      category: pick(INFO_CATEGORIES),
      language: 'en'
    })
  }

  await createManyInBatches('info blocks', infoBlocks, (data) => prisma.infoBlock.createMany({ data }))

  const translations = Array.from({ length: COUNTS.translations }, (_, index) => {
    const type = pick(['region', 'city', 'attraction'] as const)
    const entityId =
      type === 'region'
        ? regionIds[index % regionIds.length]
        : type === 'city'
          ? cityIds[index % cityIds.length]
          : attractionIds[index % attractionIds.length]

    return {
      id: randomUUID(),
      entityType: type,
      entityId,
      language: pick(['es', 'fr', 'pt']),
      field: pick(['name', 'description']),
      value: `Translated ${type} ${index + 1}`
    }
  })

  await createManyInBatches('translations', translations, (data) => prisma.translation.createMany({ data }))

  console.log('Seed completed', {
    scale: SCALE,
    users: userData.length,
    guides: guideData.length,
    regions: regionData.length,
    cities: cityData.length,
    attractions: attractionData.length,
    trips: tripData.length
  })
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

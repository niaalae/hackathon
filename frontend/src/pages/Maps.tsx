/**
 * Maps.tsx — Google Maps-like POI search
 *
 * Search strategy:
 *  1. Overpass API  — ALL amenities/tourism/shops near map center (10km radius)
 *     This is what powers real POI search: cafes, hotels, restaurants, museums etc.
 *  2. Nominatim     — cities, streets, addresses (fallback for place names)
 *
 * Key fixes vs previous version:
 *  - Radius increased to 10km (was 3km — too small)
 *  - Overpass query covers ALL amenity + tourism + shop tags, not just guessed ones
 *  - Name filter: fuzzy match on the actual query string
 *  - No keyword guessing needed — query goes directly into name~"..." filter
 *  - Results limit raised to 20
 */

import {
  useState, useCallback, useEffect,
  useRef, memo, Fragment,
} from 'react'
import {
  MapContainer, TileLayer, Marker,
  Polyline, useMapEvents, useMap,
  ZoomControl, Circle,
} from 'react-leaflet'
import { DivIcon } from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import {
  Search, X, Navigation, Trash2,
  ChevronUp, ChevronDown, MapPin, Clock,
  Footprints, LocateFixed, Plus, Minus,
  AlertTriangle, Coffee, Utensils, Hotel, Landmark, ShoppingBag,
} from 'lucide-react'
import MapLayout from '../components/layouts/Maplayout'
import 'leaflet/dist/leaflet.css'

// ─── Constants ────────────────────────────────────────────────────────────────
const BRAND = '#FC4C02'
const BLUE  = '#4285f4'
const DEFAULT_CENTER: LatLngExpression = [34.0615, -4.981]
const DEFAULT_ZOOM = 14

const TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark:  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  osm:   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
} as const

const POI_CATEGORIES = [
  { key: 'all',         label: 'All'         },
  { key: 'hotel',       label: '🏨 Hotels'   },
  { key: 'restaurant',  label: '🍽️ Food'     },
  { key: 'cafe',        label: '☕ Cafes'     },
  { key: 'attraction',  label: '🏛️ Sights'   },
  { key: 'shop',        label: '🛍️ Shopping' },
] as const
type PoiCategory = typeof POI_CATEGORIES[number]['key']

// ─── Types ────────────────────────────────────────────────────────────────────
interface Pin { id: number; lat: number; lng: number; label: string }

interface SearchResult {
  id: string
  name: string
  subtitle: string
  lat: number; lng: number
  type: 'place' | 'hotel' | 'restaurant' | 'cafe' | 'attraction' | 'shop'
  tags?: Record<string, string>
}

interface RouteResult {
  points: LatLngExpression[]
  distanceM: number; durationS: number
  failed: boolean; legs: number[]
}
interface UserLocation { lat: number; lng: number; accuracy: number }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = {
  dist: (m: number) => m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)} km`,
  time: (s: number) => {
    const m = Math.round(s / 60)
    return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`
  },
}
function straightDist(a: Pin, b: Pin) {
  return Math.round(Math.sqrt((b.lat - a.lat) ** 2 + (b.lng - a.lng) ** 2) * 111_000)
}
function pinColor(i: number, total: number) {
  if (i === 0) return BRAND
  if (i === total - 1) return '#18181b'
  return '#6366f1'
}

// ─── POI type classifier ──────────────────────────────────────────────────────
function classifyPoi(tags: Record<string, string>): SearchResult['type'] {
  const a = tags.amenity || ''
  const t = tags.tourism || ''
  const s = tags.shop    || ''

  if (t.match(/hotel|hostel|guest_house|motel|riad|apartment/)) return 'hotel'
  if (a.match(/restaurant|fast_food|food_court|bbq|ice_cream/))  return 'restaurant'
  if (a.match(/cafe|bar|pub|biergarten|tea_house|coffee/))        return 'cafe'
  if (t.match(/attraction|museum|monument|viewpoint|gallery|zoo|theme_park/) ||
      a.match(/theatre|cinema|library|place_of_worship|nightclub/)) return 'attraction'
  if (s || a.match(/marketplace|supermarket/))                    return 'shop'
  return 'place'
}

function poiSubtitle(tags: Record<string, string>, type: SearchResult['type']): string {
  const parts: string[] = []

  // Type label
  const typeLabels: Record<string, string> = {
    hotel: tags.tourism?.replace(/_/g, ' ') || 'Hotel',
    restaurant: tags.cuisine?.split(';')[0] || 'Restaurant',
    cafe: tags.amenity === 'cafe' ? 'Café' : (tags.amenity || 'Café'),
    attraction: tags.tourism?.replace(/_/g, ' ') || tags.amenity || 'Attraction',
    shop: tags.shop?.replace(/_/g, ' ') || 'Shop',
    place: tags.amenity || tags.tourism || 'Place',
  }
  parts.push(typeLabels[type] || 'Place')

  // Stars rating
  if (tags.stars) parts.push(`⭐ ${tags.stars}`)

  // Address
  const addr = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ')
  if (addr) parts.push(addr)

  // Opening hours (short)
  if (tags.opening_hours && tags.opening_hours.length < 30) parts.push(tags.opening_hours)

  return parts.join(' · ')
}

// ─── Overpass search — THE MAIN SEARCH ENGINE ─────────────────────────────────
// Uses name~"query",i to fuzzy-match any named POI within 10km
// Also supports browsing by category (no query, just tag filter)
async function overpassSearch(
  query: string,
  lat: number, lng: number,
  signal: AbortSignal,
  radiusM = 10_000,
): Promise<SearchResult[]> {

  // Build the Overpass QL query
  // Strategy: search by name fuzzy match across ALL relevant tag types
  const safeQuery = query.replace(/['"\\]/g, '') // sanitize

  let filter: string
  if (safeQuery.length > 0) {
    // Name-based search — covers everything with a matching name
    filter = `["name"~"${safeQuery}",i]`
  } else {
    // No query — return nothing (category search handled separately)
    return []
  }

  const around = `(around:${radiusM},${lat},${lng})`

  const oql = `
[out:json][timeout:15];
(
  node${filter}["amenity"]${around};
  node${filter}["tourism"]${around};
  node${filter}["shop"]${around};
  node${filter}["leisure"]${around};
  way${filter}["amenity"]${around};
  way${filter}["tourism"]${around};
  way${filter}["shop"]${around};
);
out body center 25;
`

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(oql)}`,
    signal,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  if (!res.ok) return []
  const data = await res.json()

  return (data.elements || [])
    .filter((el: { tags?: { name?: string } }) => el.tags?.name)
    .slice(0, 20)
    .map((el: {
      id: number
      lat?: number; lon?: number
      center?: { lat: number; lon: number }
      tags: Record<string, string>
    }) => {
      const elLat = el.lat ?? el.center?.lat ?? lat
      const elLng = el.lon ?? el.center?.lon ?? lng
      const tags  = el.tags
      const type  = classifyPoi(tags)

      return {
        id:       `ovp-${el.id}`,
        name:     tags.name,
        subtitle: poiSubtitle(tags, type),
        lat:      elLat,
        lng:      elLng,
        type,
        tags,
      } as SearchResult
    })
}

// Category browse — no name filter, just tag filter near map center
async function browsePois(
  category: PoiCategory,
  lat: number, lng: number,
  signal: AbortSignal,
): Promise<SearchResult[]> {
  if (category === 'all') return []

  const tagFilters: Record<string, string[]> = {
    hotel:      ['["tourism"~"hotel|hostel|guest_house|motel|riad"]'],
    restaurant: ['["amenity"~"restaurant|fast_food|food_court"]'],
    cafe:       ['["amenity"~"cafe|bar|pub|tea_house"]'],
    attraction: ['["tourism"~"attraction|museum|monument|viewpoint|gallery|zoo"]',
                 '["amenity"~"theatre|cinema|place_of_worship"]'],
    shop:       ['["shop"]', '["amenity"="marketplace"]'],
  }

  const filters = tagFilters[category] || []
  const around  = `(around:5000,${lat},${lng})`

  const parts = filters.map(f => `node${f}${around};\nway${f}${around};`).join('\n')

  const oql = `
[out:json][timeout:15];
(
  ${parts}
);
out body center 30;
`

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(oql)}`,
    signal,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  if (!res.ok) return []
  const data = await res.json()

  return (data.elements || [])
    .filter((el: { tags?: { name?: string } }) => el.tags?.name)
    .slice(0, 30)
    .map((el: {
      id: number
      lat?: number; lon?: number
      center?: { lat: number; lon: number }
      tags: Record<string, string>
    }) => {
      const elLat = el.lat ?? el.center?.lat ?? lat
      const elLng = el.lon ?? el.center?.lon ?? lng
      const tags  = el.tags
      const type  = classifyPoi(tags)
      return {
        id: `ovp-${el.id}`, name: tags.name,
        subtitle: poiSubtitle(tags, type),
        lat: elLat, lng: elLng, type, tags,
      } as SearchResult
    })
}

// ─── Nominatim — for addresses and cities ─────────────────────────────────────
async function nominatimSearch(query: string, signal: AbortSignal): Promise<SearchResult[]> {
  const params = new URLSearchParams({
    q: query, format: 'json', limit: '4',
    addressdetails: '1', 'accept-language': 'en',
  })
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      signal,
      headers: { 'User-Agent': 'Trippple/1.0 (travel-planner)' },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.map((r: {
      place_id: number; display_name: string; lat: string; lon: string
      address?: { road?: string; city?: string; town?: string; village?: string }
    }) => ({
      id:       `nom-${r.place_id}`,
      name:     r.address?.road || r.address?.city || r.address?.town ||
                r.address?.village || r.display_name.split(',')[0],
      subtitle: r.display_name.split(', ').slice(1, 3).join(', '),
      lat:      parseFloat(r.lat),
      lng:      parseFloat(r.lon),
      type:     'place' as const,
    }))
  } catch { return [] }
}

// ─── Combined search hook ─────────────────────────────────────────────────────
function useSearch(mapCenter: React.RefObject<{ lat: number; lng: number }>) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [busy,    setBusy]    = useState(false)
  const [open,    setOpen]    = useState(false)
  const [tab,     setTab]     = useState<PoiCategory>('all')
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const abort = useRef<AbortController>()

  useEffect(() => {
    clearTimeout(timer.current)
    if (query.trim().length < 2) { setResults([]); setOpen(false); return }

    timer.current = setTimeout(async () => {
      abort.current?.abort()
      abort.current = new AbortController()
      const sig = abort.current.signal
      const { lat, lng } = mapCenter.current!
      setBusy(true)
      try {
        // Run both in parallel
        const [ovp, nom] = await Promise.allSettled([
          overpassSearch(query.trim(), lat, lng, sig, 10_000),
          nominatimSearch(query.trim(), sig),
        ])
        const ovpRes = ovp.status === 'fulfilled' ? ovp.value : []
        const nomRes = nom.status === 'fulfilled' ? nom.value : []

        // Overpass results first (actual POIs), then Nominatim (cities/addresses)
        // Deduplicate by name
        const seen = new Set<string>()
        const merged = [...ovpRes, ...nomRes].filter(r => {
          const k = r.name.toLowerCase()
          if (seen.has(k)) return false
          seen.add(k); return true
        }).slice(0, 20)

        setResults(merged)
        setOpen(true)
      } catch (e: unknown) {
        if ((e as Error).name !== 'AbortError') setResults([])
      } finally {
        setBusy(false)
      }
    }, 350)

    return () => clearTimeout(timer.current)
  }, [query]) // eslint-disable-line

  const filtered = tab === 'all' ? results : results.filter(r => r.type === tab)

  const clear = useCallback(() => {
    abort.current?.abort()
    setQuery(''); setResults([]); setOpen(false); setTab('all')
  }, [])

  return { query, setQuery, results: filtered, busy, open, setOpen, tab, setTab, clear }
}

// ─── Route fetcher ────────────────────────────────────────────────────────────
async function fetchRoute(pins: Pin[]): Promise<RouteResult> {
  const legsFallback = pins.slice(0, -1).map((p, i) => straightDist(p, pins[i + 1]))
  const fallback: RouteResult = {
    points: pins.map(p => [p.lat, p.lng]),
    distanceM: legsFallback.reduce((a, b) => a + b, 0),
    durationS: legsFallback.reduce((a, b) => a + b, 0) / 1_000 * 720,
    failed: true, legs: legsFallback,
  }
  if (pins.length < 2) return { ...fallback, distanceM: 0, durationS: 0, legs: [] }
  try {
    const coords = pins.map(p => `${p.lng},${p.lat}`).join(';')
    for (const profile of ['foot', 'driving']) {
      const r = await fetch(
        `/osrm/route/v1/${profile}/${coords}?overview=full&geometries=geojson&steps=false`,
        { signal: AbortSignal.timeout(8_000) },
      )
      if (!r.ok) continue
      const d = await r.json()
      if (d.code !== 'Ok' || !d.routes?.length) continue
      const route = d.routes[0]
      return {
        points:    route.geometry.coordinates.map(([lng, lat]: number[]) => [lat, lng]),
        distanceM: Math.round(route.distance),
        durationS: Math.round(route.duration),
        failed:    false,
        legs:      (route.legs ?? []).map((l: { distance: number }) => Math.round(l.distance)),
      }
    }
    return fallback
  } catch { return fallback }
}

function useRoute(pins: Pin[]) {
  const EMPTY: RouteResult = { points: [], distanceM: 0, durationS: 0, failed: false, legs: [] }
  const [route,   setRoute]   = useState<RouteResult>(EMPTY)
  const [loading, setLoading] = useState(false)
  const key = pins.map(p => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join('|')
  useEffect(() => {
    let dead = false
    if (pins.length < 2) { setRoute(EMPTY); return }
    setLoading(true)
    fetchRoute(pins).then(r => { if (!dead) { setRoute(r); setLoading(false) } })
    return () => { dead = true }
  }, [key]) // eslint-disable-line
  return { route, loading }
}

function useGeolocation(onLocated: (lat: number, lng: number) => void) {
  const [locating, setLocating] = useState(false)
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)
  const cbRef = useRef(onLocated)
  useEffect(() => { cbRef.current = onLocated }, [onLocated])
  const locate = useCallback(() => {
    if (!navigator.geolocation) { setGeoError('Not supported'); return }
    setLocating(true); setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }
        setLocation(loc); setLocating(false); cbRef.current(loc.lat, loc.lng)
      },
      err => {
        setLocating(false)
        setGeoError(err.code === 1 ? 'Location access denied.' : 'Could not get your location.')
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 },
    )
  }, [])
  return { locate, locating, location, geoError }
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function makeWaypointIcon(n: number, color: string) {
  return new DivIcon({
    className: '', iconSize: [32, 42], iconAnchor: [16, 42],
    html: `<div style="display:flex;flex-direction:column;align-items:center;width:32px;">
      <div style="width:30px;height:30px;border-radius:50%;background:${color};border:2.5px solid #fff;
        box-shadow:0 3px 14px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;
        font-size:12px;font-weight:900;color:#fff;font-family:system-ui,sans-serif;">${n}</div>
      <div style="width:2px;height:10px;background:${color};border-radius:0 0 2px 2px;opacity:.9;margin-top:-1px;"></div>
    </div>`,
  })
}

const POI_COLORS: Record<string, string> = {
  hotel: '#0ea5e9', restaurant: '#f59e0b', cafe: '#8b5cf6',
  attraction: '#10b981', shop: '#ec4899', place: '#4f46e5',
}
const POI_EMOJI: Record<string, string> = {
  hotel: '🏨', restaurant: '🍽️', cafe: '☕', attraction: '🏛️', shop: '🛍️', place: '📍',
}

function makePoiIcon(type: SearchResult['type'], small = false) {
  const c = POI_COLORS[type] || '#4f46e5'
  const e = POI_EMOJI[type]  || '📍'
  const sz = small ? 28 : 36
  return new DivIcon({
    className: '', iconSize: [sz + 4, sz + 12], iconAnchor: [(sz + 4) / 2, sz + 12],
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="width:${sz}px;height:${sz}px;border-radius:${sz / 4}px;background:${c};
        border:2px solid #fff;box-shadow:0 3px 12px ${c}55;
        display:flex;align-items:center;justify-content:center;font-size:${sz * 0.45}px;">
        ${e}
      </div>
      <div style="width:2px;height:8px;background:${c};border-radius:0 0 2px 2px;margin-top:-1px;"></div>
    </div>`,
  })
}

function makeUserDotIcon() {
  return new DivIcon({
    className: '', iconSize: [24, 24], iconAnchor: [12, 12],
    html: `<div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;inset:0;border-radius:50%;background:rgba(66,133,244,.25);animation:userpulse 2.2s ease-out infinite;"></div>
      <div style="width:14px;height:14px;border-radius:50%;background:${BLUE};border:2.5px solid #fff;
        box-shadow:0 2px 10px rgba(66,133,244,.7);position:relative;z-index:1;"></div>
    </div>`,
  })
}

// ─── Result icon (sidebar) ────────────────────────────────────────────────────
function ResultIcon({ type }: { type: SearchResult['type'] }) {
  const cls = 'h-4 w-4'
  if (type === 'hotel')      return <Hotel       className={cls} />
  if (type === 'restaurant') return <Utensils    className={cls} />
  if (type === 'cafe')       return <Coffee      className={cls} />
  if (type === 'attraction') return <Landmark    className={cls} />
  if (type === 'shop')       return <ShoppingBag className={cls} />
  return <MapPin className={cls} />
}
const RESULT_BG: Record<string, string> = {
  hotel:      'bg-sky-100 text-sky-600',
  restaurant: 'bg-amber-100 text-amber-600',
  cafe:       'bg-violet-100 text-violet-600',
  attraction: 'bg-emerald-100 text-emerald-600',
  shop:       'bg-pink-100 text-pink-600',
  place:      'bg-indigo-100 text-indigo-600',
}

// ─── Map internals ────────────────────────────────────────────────────────────
function ClickHandler({ cbRef }: { cbRef: React.RefObject<((lat: number, lng: number) => void) | null> }) {
  useMapEvents({ click: e => cbRef.current?.(e.latlng.lat, e.latlng.lng) })
  return null
}

function MapBridge({
  flyRef, centerRef,
}: {
  flyRef:    React.RefObject<((lat: number, lng: number, zoom?: number) => void) | null>
  centerRef: React.RefObject<{ lat: number; lng: number }>
}) {
  const map = useMap()
  useEffect(() => {
    flyRef.current = (lat, lng, zoom = 16) =>
      map.flyTo([lat, lng], zoom, { animate: true, duration: 1.0 })
    const update = () => {
      const c = map.getCenter()
      centerRef.current = { lat: c.lat, lng: c.lng }
    }
    map.on('moveend', update); update()
    return () => { map.off('moveend', update) }
  }, [map, flyRef, centerRef])
  return null
}

function FitBounds({ pins }: { pins: Pin[] }) {
  const map = useMap()
  const prevKey = useRef('')
  useEffect(() => {
    if (pins.length < 2) return
    const key = pins.map(p => p.id).join(',')
    if (key === prevKey.current) return
    prevKey.current = key
    map.fitBounds(pins.map(p => [p.lat, p.lng] as [number, number]), { padding: [56, 56], maxZoom: 17 })
  }, [pins, map])
  return null
}

const RouteLayer = memo(function RouteLayer({ route, show }: { route: RouteResult; show: boolean }) {
  if (!show || route.points.length < 2) return null
  return (
    <Fragment>
      <Polyline positions={route.points} pathOptions={{ color: BRAND, weight: 18, opacity: 0.07 }} />
      <Polyline positions={route.points} pathOptions={{ color: BRAND, weight: 10, opacity: 0.17 }} />
      <Polyline positions={route.points} pathOptions={route.failed
        ? { color: '#f59e0b', weight: 3.5, opacity: .9, dashArray: '8 11' }
        : { color: BRAND, weight: 4.5, opacity: 1, lineCap: 'round', lineJoin: 'round' }
      } />
    </Fragment>
  )
})

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Maps() {
  const [pins,       setPins]       = useState<Pin[]>([])
  const [nextId,     setNextId]     = useState(1)
  const [editId,     setEditId]     = useState<number | null>(null)
  const [showRoute,  setShowRoute]  = useState(true)
  const [tileKey,    setTileKey]    = useState<keyof typeof TILES>('light')
  const [panelOpen,  setPanelOpen]  = useState(false)
  const [addMode,    setAddMode]    = useState(true)
  const [previewPin, setPreviewPin] = useState<SearchResult | null>(null)
  const [browseResults, setBrowseResults] = useState<SearchResult[]>([])
  const [browsingCat,   setBrowsingCat]   = useState<PoiCategory | null>(null)
  const [browseBusy,    setBrowseBusy]    = useState(false)
  const [toast,      setToast]      = useState<string | null>(null)

  const flyRef    = useRef<((lat: number, lng: number, zoom?: number) => void) | null>(null)
  const centerRef = useRef<{ lat: number; lng: number }>({
    lat: (DEFAULT_CENTER as number[])[0],
    lng: (DEFAULT_CENTER as number[])[1],
  })
  const clickCbRef  = useRef<((lat: number, lng: number) => void) | null>(null)
  const searchWrap  = useRef<HTMLDivElement>(null)
  const browseAbort = useRef<AbortController>()

  const { route, loading: routeLoading } = useRoute(pins)
  const { query, setQuery, results, busy, open, setOpen, tab, setTab, clear } = useSearch(centerRef)

  const showToast = useCallback((msg: string) => {
    setToast(msg); setTimeout(() => setToast(null), 2500)
  }, [])

  const handleLocated = useCallback((lat: number, lng: number) => {
    flyRef.current?.(lat, lng, 17); showToast('Showing your location')
  }, [showToast])

  const { locate, locating, location: userLoc, geoError } = useGeolocation(handleLocated)

  // Sync click callback
  useEffect(() => {
    clickCbRef.current = addMode ? (lat, lng) => {
      const id = nextId
      setPins(p => [...p, { id, lat, lng, label: `Stop ${id}` }])
      setNextId(n => n + 1); setPanelOpen(true)
    } : null
  }, [addMode, nextId])

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchWrap.current && !searchWrap.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [setOpen])

  // ── Mutations ──
  const addPin = useCallback((lat: number, lng: number, label?: string) => {
    const id = nextId
    setPins(p => [...p, { id, lat, lng, label: label || `Stop ${id}` }])
    setNextId(n => n + 1); setPanelOpen(true)
  }, [nextId])

  const removePin = useCallback((id: number) => setPins(p => p.filter(x => x.id !== id)), [])
  const rename    = useCallback((id: number, label: string) =>
    setPins(p => p.map(x => x.id === id ? { ...x, label } : x)), [])
  const clearAll  = useCallback(() => {
    setPins([]); setNextId(1); setPreviewPin(null)
    setBrowseResults([]); setBrowsingCat(null); clear()
    showToast('All stops cleared')
  }, [clear, showToast])

  // ── Pick search result ──
  const pickResult = useCallback((r: SearchResult) => {
    setPreviewPin(r); setQuery(r.name); setOpen(false)
    flyRef.current?.(r.lat, r.lng, 17)
  }, [setQuery, setOpen])

  const addPreview = useCallback(() => {
    if (!previewPin) return
    addPin(previewPin.lat, previewPin.lng, previewPin.name)
    setPreviewPin(null); clear()
    showToast(`"${previewPin.name}" added`)
  }, [previewPin, addPin, clear, showToast])

  // ── Category browse ──
  const handleBrowse = useCallback(async (cat: PoiCategory) => {
    if (browsingCat === cat) { setBrowseResults([]); setBrowsingCat(null); return }
    browseAbort.current?.abort()
    browseAbort.current = new AbortController()
    setBrowseBusy(true); setBrowsingCat(cat)
    try {
      const res = await browsePois(cat, centerRef.current.lat, centerRef.current.lng, browseAbort.current.signal)
      setBrowseResults(res)
      showToast(`${res.length} ${cat}s found nearby`)
    } catch { /* ignore */ } finally { setBrowseBusy(false) }
  }, [browsingCat, showToast])

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <MapLayout>
      <div className="relative flex h-full w-full overflow-hidden bg-zinc-100">
        <style>{`
          @keyframes userpulse {
            0%  { transform:scale(1); opacity:.55; }
            70% { transform:scale(3.2); opacity:0; }
            100%{ opacity:0; }
          }
          @keyframes toastIn {
            from { opacity:0; transform:translateY(6px) scale(.97); }
            to   { opacity:1; transform:translateY(0) scale(1); }
          }
          .leaflet-popup-content-wrapper,
          .leaflet-popup-tip-container { display:none !important; }
          .map-add .leaflet-container    { cursor:crosshair !important; }
          .map-pan .leaflet-container    { cursor:grab !important; }
          .map-pan .leaflet-container:active { cursor:grabbing !important; }
          .leaflet-control-zoom {
            border:none !important;
            box-shadow:0 4px 24px rgba(0,0,0,.13) !important;
            border-radius:14px !important; overflow:hidden;
            margin:0 12px 12px 0 !important;
          }
          .leaflet-control-zoom a {
            border:none !important; background:#fff !important;
            color:#18181b !important; font-weight:900 !important;
            width:40px !important; height:40px !important;
            line-height:40px !important; font-size:20px !important;
          }
          .leaflet-control-zoom a:hover { background:#f4f4f5 !important; }
          .leaflet-control-attribution  { display:none !important; }
          @media(max-width:1024px){
            .leaflet-control-zoom { margin-bottom:90px !important; }
          }
          .scrollbar-none::-webkit-scrollbar { display:none; }
          .scrollbar-none { -ms-overflow-style:none; scrollbar-width:none; }
        `}</style>

        {/* Toast */}
        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[3000]
            bg-zinc-900/90 backdrop-blur-sm text-white text-[12px] font-semibold
            px-4 py-2.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none"
            style={{ animation: 'toastIn .2s ease both' }}>
            {toast}
          </div>
        )}

        {/* ══ SEARCH BAR ════════════════════════════════════════════════════ */}
        <div
          ref={searchWrap}
          className="absolute z-[2500]
            top-20 left-3 right-16
            lg:left-[316px] lg:right-auto lg:w-[420px]"
        >
          {/* Search card */}
          <div className={`bg-white rounded-2xl overflow-hidden
            shadow-[0_4px_28px_rgba(0,0,0,.16)]
            ${open && results.length > 0 ? 'shadow-[0_8px_40px_rgba(0,0,0,.22)]' : ''}`}>

            {/* Input row */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              {busy
                ? <div className="h-4 w-4 border-2 border-zinc-200 border-t-[#FC4C02] rounded-full animate-spin shrink-0" />
                : <Searc className="h-[18px] w-[18px] text-zinc-400 shrink-0" />
              }
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setPreviewPin(null) }}
                onFocus={() => results.length > 0 && setOpen(true)}
                placeholder="Search cafes, hotels, restaurants…"
                autoComplete="off" spellCheck={false}
                className="flex-1 bg-transparent text-[14px] font-medium text-zinc-900
                  placeholder-zinc-400 outline-none min-w-0"
              />
              {query && (
                <button
                  onClick={() => { clear(); setPreviewPin(null) }}
                  className="h-6 w-6 flex items-center justify-center rounded-full
                    bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Type filter tabs (shown when results exist) */}
            {open && results.length > 0 && (
              <div className="flex gap-1.5 px-3 pb-2.5 overflow-x-auto scrollbar-none">
                {POI_CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setTab(cat.key)}
                    className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap
                      ${tab === cat.key
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* Results list */}
            {open && results.length > 0 && (
              <div className="border-t border-zinc-100 max-h-[300px] overflow-y-auto">
                {results.map((r, i) => (
                  <button
                    key={r.id}
                    onMouseDown={e => { e.preventDefault(); pickResult(r) }}
                    className={`w-full flex items-center gap-3 px-4 py-3
                      hover:bg-zinc-50 active:bg-zinc-100 text-left transition-colors
                      ${i < results.length - 1 ? 'border-b border-zinc-50' : ''}`}
                  >
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0
                      ${RESULT_BG[r.type] || RESULT_BG.place}`}>
                      <ResultIcon type={r.type} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-zinc-900 truncate">{r.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{r.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {open && !busy && query.trim().length >= 2 && results.length === 0 && (
              <div className="border-t border-zinc-100 px-4 py-5 text-center">
                <p className="text-[13px] text-zinc-400 font-medium">No results for "{query}"</p>
                <p className="text-[11px] text-zinc-400 mt-1">Try moving the map closer to where you're looking</p>
              </div>
            )}
          </div>

          {/* Category browse chips (shown when search is empty) */}
          {!query && (
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {POI_CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                <button
                  key={cat.key}
                  onClick={() => handleBrowse(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full
                    text-[12px] font-semibold shadow-sm border transition-all
                    ${browsingCat === cat.key
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-700 border-zinc-100 hover:bg-zinc-50'}`}
                >
                  {browseBusy && browsingCat === cat.key
                    ? <div className="h-3 w-3 border border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                    : null
                  }
                  {cat.label}
                </button>
              ))}
              {browsingCat && (
                <button
                  onClick={() => { setBrowseResults([]); setBrowsingCat(null) }}
                  className="flex items-center gap-1 px-3 py-2 rounded-full text-[12px]
                    font-semibold bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
          )}

          {/* Add-as-stop button */}
          {previewPin && !open && (
            <button
              onClick={addPreview}
              className="mt-2 w-full flex items-center justify-center gap-2
                bg-[#FC4C02] text-white text-[13px] font-bold px-4 py-3 rounded-xl
                shadow-[0_4px_20px_rgba(252,76,2,.35)]
                hover:bg-orange-600 active:scale-[.98] transition-all"
            >
              <Plus className="h-4 w-4" />
              Add "{previewPin.name}" as a stop
            </button>
          )}

          {/* Geo error */}
          {geoError && (
            <div className="mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex gap-2 items-start">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[12px] text-red-600 font-medium">{geoError}</p>
            </div>
          )}
        </div>

        {/* Locate me — mobile top-right */}
        <button
          onClick={locate} disabled={locating}
          className="lg:hidden absolute z-[2500] top-3 right-3
            h-12 w-12 flex items-center justify-center
            bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,.15)]
            hover:bg-zinc-50 active:scale-95 transition-all"
        >
          {locating
            ? <div className="h-4 w-4 border-2 border-zinc-200 border-t-[#4285f4] rounded-full animate-spin" />
            : <LocateFixed style={{ width: 18, height: 18 }} className="text-zinc-600" />
          }
        </button>

        {/* ══ DESKTOP SIDEBAR ══════════════════════════════════════════════ */}
        <aside className="hidden lg:flex flex-col w-[300px] shrink-0 bg-white border-r border-zinc-100 z-[1000] shadow-sm">

          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[15px] font-black text-zinc-900 tracking-tight">Route Planner</h1>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {pins.length === 0 ? 'Search or tap map' : `${pins.length} stop${pins.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={locate} disabled={locating}
                  className="h-8 w-8 flex items-center justify-center rounded-full
                    text-zinc-400 hover:text-blue-500 hover:bg-blue-50 transition">
                  {locating
                    ? <div className="h-3.5 w-3.5 border-2 border-zinc-200 border-t-[#4285f4] rounded-full animate-spin" />
                    : <LocateFixed className="h-4 w-4" />
                  }
                </button>
                {pins.length > 0 && (
                  <button onClick={clearAll}
                    className="h-8 w-8 flex items-center justify-center rounded-full
                      text-zinc-400 hover:text-red-500 hover:bg-red-50 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Add-pin toggle */}
          <div className="px-4 py-3 border-b border-zinc-100">
            <button
              onClick={() => { setAddMode(m => !m); showToast(addMode ? 'Pan mode' : 'Tap map to drop a pin') }}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                text-[12px] font-bold uppercase tracking-wider transition-all
                ${addMode
                  ? 'bg-[#FC4C02] text-white shadow-[0_4px_16px_rgba(252,76,2,.3)]'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
            >
              {addMode ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {addMode ? 'Tap map to add stop' : 'Enable add-pin mode'}
            </button>
          </div>

          {/* Route stats */}
          {routeLoading && pins.length >= 2 && (
            <div className="flex items-center justify-center gap-2 py-4 border-b border-zinc-100">
              {[0,100,200].map(d => (
                <div key={d} style={{ animationDelay:`${d}ms` }}
                  className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce" />
              ))}
              <span className="text-[11px] text-zinc-400 ml-1 font-medium">Calculating…</span>
            </div>
          )}
          {!routeLoading && pins.length >= 2 && (
            <div className="flex border-b border-zinc-100">
              <div className="flex-1 flex flex-col items-center py-3.5 gap-1">
                <Footprints className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-[18px] font-black text-zinc-900 leading-none">{fmt.dist(route.distanceM)}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Distance</span>
              </div>
              <div className="w-px bg-zinc-100" />
              <div className="flex-1 flex flex-col items-center py-3.5 gap-1">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-[18px] font-black text-zinc-900 leading-none">{fmt.time(route.durationS)}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Est. Time</span>
              </div>
            </div>
          )}

          {/* Empty state */}
          {pins.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                <MapPin className="h-7 w-7 text-[#FC4C02]" />
              </div>
              <div>
                <p className="text-[14px] font-black text-zinc-800">No route yet</p>
                <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
                  Search above or tap the category chips to browse nearby places
                </p>
              </div>
              <div className="flex flex-col gap-2 text-left w-full">
                {['🏨 Search "riad" or "hotel"', '🍽️ Search "restaurant"', '☕ Search "cafe" or "coffee"', '🏛️ Search "museum" or "medina"'].map(t => (
                  <p key={t} className="text-[11px] text-zinc-400 font-medium">{t}</p>
                ))}
              </div>
            </div>
          )}

          {pins.length > 0 && (
            <div className="flex-1 overflow-y-auto py-2 px-2">
              <StopList
                pins={pins} editId={editId} setEditId={setEditId}
                rename={rename} removePin={removePin}
                routeLegs={route.legs} routeLoading={routeLoading} routeFailed={route.failed}
              />
            </div>
          )}

          {/* Map style */}
          <div className="border-t border-zinc-100 px-4 py-3 flex gap-1.5">
            {(Object.keys(TILES) as Array<keyof typeof TILES>).map(k => (
              <button key={k} onClick={() => setTileKey(k)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition capitalize
                  ${tileKey === k ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>
                {k}
              </button>
            ))}
            <button onClick={() => setShowRoute(r => !r)}
              className={`px-3 py-1.5 rounded-lg flex items-center justify-center transition
                ${showRoute ? 'bg-[#FC4C02] text-white' : 'bg-zinc-100 text-zinc-500'}`}>
              <Navigation className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>

        {/* ══ MAP ══════════════════════════════════════════════════════════ */}
        <div className={`flex-1 relative ${addMode ? 'map-add' : 'map-pan'}`}>
          <MapContainer
            center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}
            className="h-full w-full" zoomControl={false} preferCanvas
          >
            <TileLayer key={tileKey} url={TILES[tileKey]} />
            <ZoomControl position="bottomright" />
            <MapBridge flyRef={flyRef} centerRef={centerRef} />
            <ClickHandler cbRef={clickCbRef} />
            <FitBounds pins={pins} />

            {/* User blue dot */}
            {userLoc && (
              <>
                <Circle
                  center={[userLoc.lat, userLoc.lng]}
                  radius={Math.max(userLoc.accuracy, 15)}
                  pathOptions={{ color: BLUE, fillColor: BLUE, fillOpacity: .12, weight: 1, opacity: .3 }}
                />
                <Marker position={[userLoc.lat, userLoc.lng]} icon={makeUserDotIcon()} zIndexOffset={1000} />
              </>
            )}

            {/* Browse category markers */}
            {browseResults.map(r => (
              <Marker
                key={r.id}
                position={[r.lat, r.lng]}
                icon={makePoiIcon(r.type, true)}
                zIndexOffset={600}
                eventHandlers={{ click: () => pickResult(r) }}
              />
            ))}

            {/* Search preview pin */}
            {previewPin && (
              <Marker position={[previewPin.lat, previewPin.lng]} icon={makePoiIcon(previewPin.type)} zIndexOffset={900} />
            )}

            {/* Route waypoints */}
            {pins.map((pin, i) => (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={makeWaypointIcon(i + 1, pinColor(i, pins.length))}
                zIndexOffset={800}
              />
            ))}

            <RouteLayer route={route} show={showRoute} />
          </MapContainer>

          {/* Add mode badge mobile */}
          {addMode && (
            <div className="lg:hidden absolute top-[72px] left-1/2 -translate-x-1/2 z-[2000]
              bg-[#FC4C02] text-white text-[11px] font-bold px-3 py-1.5 rounded-full
              shadow-lg pointer-events-none">
              📍 Tap map to drop a pin
            </div>
          )}

          {/* Locate me desktop */}
          <button onClick={locate} disabled={locating}
            className="hidden lg:flex absolute z-[1500] right-3 bottom-[130px]
              h-10 w-10 items-center justify-center
              bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,.14)]
              hover:bg-zinc-50 active:scale-95 transition-all">
            {locating
              ? <div className="h-4 w-4 border-2 border-zinc-200 border-t-[#4285f4] rounded-full animate-spin" />
              : <LocateFixed style={{ width: 18, height: 18 }} className="text-zinc-600" />
            }
          </button>

          {/* Mobile floating controls */}
          <div className="lg:hidden absolute z-[1500] bottom-[84px] left-3
            flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-xl
            shadow-[0_4px_20px_rgba(0,0,0,.13)] border border-zinc-100 p-1.5">
            <button
              onClick={() => { setAddMode(m => !m); showToast(addMode ? 'Pan mode' : 'Tap map to drop a pin') }}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
                transition flex items-center gap-1
                ${addMode ? 'bg-[#FC4C02] text-white' : 'bg-zinc-100 text-zinc-500'}`}>
              <Plus className="h-3 w-3" />
              {addMode ? 'Adding' : 'Add pin'}
            </button>
            <div className="w-px h-5 bg-zinc-200" />
            {(Object.keys(TILES) as Array<keyof typeof TILES>).map(k => (
              <button key={k} onClick={() => setTileKey(k)}
                className={`px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition capitalize
                  ${tileKey === k ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}>
                {k}
              </button>
            ))}
            <div className="w-px h-5 bg-zinc-200" />
            <button onClick={() => setShowRoute(r => !r)}
              className={`px-2 py-1.5 rounded-lg transition flex items-center
                ${showRoute ? 'bg-[#FC4C02] text-white' : 'text-zinc-500'}`}>
              <Navigation className="h-3.5 w-3.5" />
            </button>
            {pins.length > 0 && (
              <>
                <div className="w-px h-5 bg-zinc-200" />
                <button onClick={clearAll} className="px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-50 transition">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ══ MOBILE BOTTOM SHEET ══════════════════════════════════════════ */}
        <div
          className="lg:hidden absolute bottom-0 left-0 right-0 z-[2000]
            bg-white rounded-t-2xl border-t border-zinc-100
            shadow-[0_-4px_32px_rgba(0,0,0,.10)]
            transition-transform duration-300 ease-out"
          style={{ maxHeight: '65vh', transform: panelOpen ? 'translateY(0)' : 'translateY(calc(100% - 74px))' }}
        >
          <button className="w-full focus:outline-none select-none" onClick={() => setPanelOpen(o => !o)}>
            <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full bg-zinc-200" />
            <div className="px-4 pb-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: BRAND }}>
                <Navigation className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[13px] font-black text-zinc-900">
                  {pins.length === 0 ? 'No stops yet' : `${pins.length} stop${pins.length !== 1 ? 's' : ''}`}
                </p>
                {pins.length >= 2 && !routeLoading && (
                  <p className="text-[11px] text-zinc-400 font-medium">
                    {fmt.dist(route.distanceM)} · {fmt.time(route.durationS)}{route.failed ? ' (approx)' : ''}
                  </p>
                )}
                {routeLoading && <p className="text-[11px] text-[#FC4C02] animate-pulse font-medium">Calculating…</p>}
                {pins.length < 2 && !routeLoading && <p className="text-[11px] text-zinc-400">Search above or tap map</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {pins.length > 0 && (
                  <button onClick={e => { e.stopPropagation(); clearAll() }}
                    className="h-8 w-8 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-400 active:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                {panelOpen ? <ChevronDown className="h-4 w-4 text-zinc-400" /> : <ChevronUp className="h-4 w-4 text-zinc-400" />}
              </div>
            </div>
          </button>

          <div className="overflow-y-auto px-2 pb-10" style={{ maxHeight: 'calc(65vh - 84px)' }}>
            <StopList
              pins={pins} editId={editId} setEditId={setEditId}
              rename={rename} removePin={removePin}
              routeLegs={route.legs} routeLoading={routeLoading} routeFailed={route.failed}
            />
          </div>
        </div>

      </div>
    </MapLayout>
  )
}

// ─── StopList ─────────────────────────────────────────────────────────────────
const StopList = memo(function StopList({
  pins, editId, setEditId, rename, removePin, routeLegs, routeLoading, routeFailed,
}: {
  pins: Pin[]; editId: number | null
  setEditId: (id: number | null) => void
  rename: (id: number, label: string) => void
  removePin: (id: number) => void
  routeLegs: number[]; routeLoading: boolean; routeFailed: boolean
}) {
  if (pins.length === 0) return null
  return (
    <div>
      {pins.map((pin, i) => (
        <div key={pin.id}>
          <div className="group flex items-center gap-3 px-2 py-2.5 rounded-xl
            hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
            <div className="h-7 w-7 rounded-full flex items-center justify-center
              text-[11px] font-black text-white shrink-0"
              style={{ background: pinColor(i, pins.length) }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              {editId === pin.id ? (
                <input autoFocus value={pin.label}
                  onChange={e => rename(pin.id, e.target.value)}
                  onBlur={() => setEditId(null)}
                  onKeyDown={e => e.key === 'Enter' && setEditId(null)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5
                    text-[13px] text-zinc-900 outline-none focus:border-[#FC4C02] focus:ring-2 focus:ring-orange-100"
                />
              ) : (
                <>
                  <button onClick={() => setEditId(pin.id)}
                    className="block w-full text-left text-[13px] font-semibold text-zinc-900 truncate">
                    {pin.label}
                  </button>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                  </span>
                </>
              )}
            </div>
            <button onClick={() => removePin(pin.id)}
              className="h-7 w-7 flex items-center justify-center rounded-full text-zinc-300
                hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition
                opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {i < pins.length - 1 && (
            <div className="ml-5 pl-4 flex items-center gap-1.5 py-0.5 border-l-2 border-dashed border-zinc-200">
              {routeLoading
                ? <span className="text-[10px] text-zinc-400 animate-pulse py-1 font-medium">routing…</span>
                : routeLegs[i]
                  ? <span className={`text-[10px] font-bold py-1 flex items-center gap-1
                      ${routeFailed ? 'text-amber-500' : 'text-[#FC4C02]'}`}>
                      <Navigation className="h-2.5 w-2.5" />
                      {fmt.dist(routeLegs[i])}
                      {routeFailed && <span className="text-zinc-400 font-normal ml-0.5">(approx)</span>}
                    </span>
                  : null
              }
            </div>
          )}
        </div>
      ))}
    </div>
  )
})
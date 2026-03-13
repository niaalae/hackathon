import { useState, useCallback, useEffect, Fragment, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { X, ChevronUp, ChevronDown, Play, MapPin, Footprints, Clock, Flame, Search, Loader2, Navigation, Coffee, Hotel, Utensils, ShoppingBag, Landmark, Trees } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

function createIcon(n: number) {
    return new DivIcon({
        className: '',
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -46],
        html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="width:34px;height:34px;border-radius:50% 50% 50% 0;background:#f97316;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;font-family:'Google Sans',sans-serif;transform:rotate(-45deg);">
        <span style="transform:rotate(45deg)">${n}</span>
      </div>
    </div>`,
    })
}

interface PinData { id: number; lat: number; lng: number; name: string; type?: string }
interface RouteResult { points: LatLngExpression[]; distanceM: number; failed: boolean; legDistances: number[] }
interface NominatimResult {
    display_name: string
    lat: string
    lon: string
    type?: string
    category?: string
    class?: string
    namedetails?: { name?: string }
    address?: { road?: string; city?: string; country?: string; suburb?: string }
}

function straightDist(a: PinData, b: PinData) {
    return Math.round(Math.sqrt((b.lat - a.lat) ** 2 + (b.lng - a.lng) ** 2) * 111000)
}

async function fetchRoute(pins: PinData[]): Promise<RouteResult> {
    const fallbackDistances = pins.length > 1 ? pins.slice(0, -1).map((p, i) => straightDist(p, pins[i + 1])) : []
    const fallback: RouteResult = {
        points: pins.map(p => [p.lat, p.lng]),
        distanceM: fallbackDistances.reduce((s, d) => s + d, 0),
        failed: true,
        legDistances: fallbackDistances,
    }
    if (pins.length < 2) return fallback
    try {
        const coords = pins.map(p => `${p.lng},${p.lat}`).join(';')
        for (const profile of ['foot', 'walking', 'driving']) {
            const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson&steps=false`
            const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
            if (!res.ok) continue
            const data = await res.json()
            if (data.code !== 'Ok' || !data.routes?.length) continue
            const route = data.routes[0]
            return {
                points: route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]),
                distanceM: Math.round(route.distance),
                failed: false,
                legDistances: (route.legs || []).map((leg: { distance: number }) => Math.round(leg.distance)),
            }
        }
        return fallback
    } catch { return fallback }
}

function useRoute(pins: PinData[]) {
    const [route, setRoute] = useState<RouteResult>({ points: [], distanceM: 0, failed: false, legDistances: [] })
    const [loading, setLoading] = useState(false)
    const key = pins.map(p => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join('|')
    useEffect(() => {
        let cancelled = false
        if (pins.length < 2) { setRoute({ points: [], distanceM: 0, failed: false, legDistances: [] }); return }
        setLoading(true)
        fetchRoute(pins).then(r => { if (!cancelled) { setRoute(r); setLoading(false) } })
        return () => { cancelled = true }
    }, [key]) // eslint-disable-line
    return { route, loading, totalDist: route.distanceM, walkMins: Math.round(route.distanceM / 1000 * 12), legDistances: route.legDistances, failed: route.failed }
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng) } })
    return null
}

function FitBounds({ pins }: { pins: PinData[] }) {
    const map = useMap()
    useEffect(() => {
        if (pins.length < 2) return
        map.fitBounds(pins.map(p => [p.lat, p.lng] as [number, number]), { padding: [80, 80] })
    }, [pins.length]) // eslint-disable-line
    return null
}

function FlyTo({ target }: { target: [number, number] | null }) {
    const map = useMap()
    useEffect(() => { if (target) map.flyTo(target, 17, { duration: 1 }) }, [target]) // eslint-disable-line
    return null
}

function fmtDist(m: number) { return m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km` }

function getCategoryIcon(type?: string, category?: string) {
    const t = (type || category || '').toLowerCase()
    if (['cafe', 'coffee', 'bar', 'pub', 'tea'].some(k => t.includes(k))) return <Coffee className="h-4 w-4" />
    if (['hotel', 'hostel', 'motel', 'lodging', 'accommodation'].some(k => t.includes(k))) return <Hotel className="h-4 w-4" />
    if (['restaurant', 'food', 'fast_food', 'pizza', 'burger'].some(k => t.includes(k))) return <Utensils className="h-4 w-4" />
    if (['shop', 'mall', 'market', 'supermarket', 'store'].some(k => t.includes(k))) return <ShoppingBag className="h-4 w-4" />
    if (['park', 'garden', 'nature', 'forest', 'beach'].some(k => t.includes(k))) return <Trees className="h-4 w-4" />
    if (['museum', 'monument', 'historic', 'church', 'mosque', 'temple'].some(k => t.includes(k))) return <Landmark className="h-4 w-4" />
    return <MapPin className="h-4 w-4" />
}

function getPlaceName(r: NominatimResult) {
    return r.namedetails?.name || r.display_name.split(',')[0]
}

function getSubtitle(r: NominatimResult) {
    if (r.address) {
        const parts = [r.address.road, r.address.suburb, r.address.city].filter(Boolean)
        return parts.slice(0, 2).join(', ')
    }
    return r.display_name.split(',').slice(1, 3).join(',').trim()
}

// ── Google Maps style Search Bar ─────────────────────────────────────────────
interface SearchBarProps { onSelect: (r: NominatimResult) => void }

function SearchBar({ onSelect }: SearchBarProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<NominatimResult[]>([])
    const [searching, setSearching] = useState(false)
    const [focused, setFocused] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        function handle(e: MouseEvent | TouchEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false)
        }
        document.addEventListener('mousedown', handle)
        document.addEventListener('touchstart', handle) // Mobile touch support
        return () => {
            document.removeEventListener('mousedown', handle)
            document.removeEventListener('touchstart', handle)
        }
    }, [])

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (query.trim().length < 2) { setResults([]); return }
        debounceRef.current = setTimeout(async () => {
            setSearching(true)
            try {
                const params = new URLSearchParams({
                    format: 'json', q: query, limit: '7',
                    addressdetails: '1', namedetails: '1', extratags: '1',
                    featuretype: 'settlement',
                })
                const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
                    headers: { 'Accept-Language': 'en', 'User-Agent': 'RoutePlannerApp/1.0' }
                })
                const data: NominatimResult[] = await res.json()
                setResults(data)
            } catch { setResults([]) }
            finally { setSearching(false) }
        }, 350)
    }, [query])

    const handleSelect = (r: NominatimResult) => {
        onSelect(r)
        setQuery('')
        setResults([])
        setFocused(false)
    }

    const showDropdown = focused && (results.length > 0 || (searching && query.length >= 2) || (!searching && query.length >= 2 && results.length === 0))

    return (
        <div ref={ref} className="relative w-full">
            {/* Input pill */}
            <form
                onSubmit={(e) => { e.preventDefault(); inputRef.current?.blur(); }}
                className={`flex items-center gap-3 bg-white rounded-full px-4 py-3 transition-all duration-200 ${focused ? 'shadow-[0_2px_20px_rgba(0,0,0,0.2)] rounded-t-2xl rounded-b-none' : 'shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_2px_16px_rgba(0,0,0,0.2)]'}`}
                style={{ borderRadius: focused && showDropdown ? '16px 16px 0 0' : '9999px' }}>
                {searching
                    ? <Loader2 className="h-5 w-5 text-[#f97316] animate-spin shrink-0" />
                    : <Search className="h-5 w-5 text-[#5f6368] shrink-0" />
                }
                <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    placeholder="Search Google Maps"
                    style={{ fontFamily: "'Google Sans', Roboto, sans-serif", fontSize: 16 }}
                    className="flex-1 bg-transparent text-[#202124] placeholder:text-[#9aa0a6] outline-none w-full"
                />
                {query && (
                    <button type="button" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
                        className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-[#f1f3f4] transition">
                        <X className="h-4 w-4 text-[#5f6368]" />
                    </button>
                )}
            </form>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute left-0 right-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-b-2xl overflow-y-auto max-h-[50vh] z-50 border-t border-[#e8eaed]">
                    {searching && results.length === 0 && (
                        <div className="flex items-center gap-3 px-4 py-3">
                            <Loader2 className="h-4 w-4 text-[#f97316] animate-spin" />
                            <span style={{ fontFamily: "'Google Sans', Roboto, sans-serif", fontSize: 14 }} className="text-[#5f6368]">Searching…</span>
                        </div>
                    )}
                    {!searching && results.length === 0 && query.length >= 2 && (
                        <div className="px-4 py-4 text-center">
                            <p style={{ fontFamily: "'Google Sans', Roboto, sans-serif", fontSize: 14 }} className="text-[#5f6368]">No results for "{query}"</p>
                        </div>
                    )}
                    {results.map((r, i) => (
                        <button key={i} onClick={() => handleSelect(r)}
                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#f1f3f4] transition text-left">
                            {/* Category icon in grey circle */}
                            <div className="h-9 w-9 shrink-0 rounded-full bg-[#e8eaed] flex items-center justify-center text-[#5f6368]">
                                {getCategoryIcon(r.type, r.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p style={{ fontFamily: "'Google Sans', Roboto, sans-serif", fontSize: 14, fontWeight: 500 }}
                                    className="text-[#202124] truncate">{getPlaceName(r)}</p>
                                <p style={{ fontFamily: "Roboto, sans-serif", fontSize: 12 }}
                                    className="text-[#70757a] truncate mt-0.5">{getSubtitle(r)}</p>
                            </div>
                            {/* Category badge */}
                            {(r.type || r.category) && (
                                <span style={{ fontFamily: "Roboto, sans-serif", fontSize: 11 }}
                                    className="shrink-0 text-[#70757a] capitalize">{r.type || r.category}</span>
                            )}
                        </button>
                    ))}
                    <div className="px-4 py-2 border-t border-[#e8eaed] flex items-center gap-2">
                        <img src="https://www.gstatic.com/images/branding/product/1x/maps_24dp.png" alt="" className="h-4 w-4 opacity-40" onError={e => (e.currentTarget.style.display = 'none')} />
                        <span style={{ fontFamily: "Roboto, sans-serif", fontSize: 11 }} className="text-[#9aa0a6]">Results from OpenStreetMap</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Maps() {
    const [pins, setPins] = useState<PinData[]>([])
    const [showRoute, setShowRoute] = useState(true)
    const [nextId, setNextId] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [suppressClick, setSuppressClick] = useState(false)
    const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)
    const nextIdRef = useRef(nextId)
    nextIdRef.current = nextId

    const { route, loading, totalDist, walkMins, legDistances, failed } = useRoute(pins)

    const addPin = useCallback((lat: number, lng: number, name = 'Dropped pin', type?: string) => {
        if (suppressClick) return
        const id = nextIdRef.current
        setPins(prev => [...prev, { id, lat, lng, name, type }])
        setNextId(n => n + 1)
    }, [suppressClick])

    const handleSearchSelect = useCallback((r: NominatimResult) => {
        const lat = parseFloat(r.lat)
        const lng = parseFloat(r.lon)
        const id = nextIdRef.current
        setPins(prev => [...prev, { id, lat, lng, name: getPlaceName(r), type: r.type || r.category }])
        setNextId(n => n + 1)
        setFlyTarget([lat, lng])
    }, [])

    const removePin = (id: number) => {
        setSuppressClick(true)
        setPins(prev => prev.filter(p => p.id !== id))
        setTimeout(() => setSuppressClick(false), 300)
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap');
                .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
                .leaflet-popup-content { margin: 0 !important; }
                .leaflet-popup-tip-container { display: none; }
                .leaflet-control-zoom { border: none !important; box-shadow: 0 1px 4px rgba(0,0,0,0.3) !important; border-radius: 8px !important; overflow: hidden; }
                .leaflet-control-zoom-in, .leaflet-control-zoom-out { background: white !important; color: #5f6368 !important; font-size: 18px !important; width: 40px !important; height: 40px !important; line-height: 40px !important; }
                .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover { background: #f1f3f4 !important; }
            `}</style>

            {/* Use negative margins to bypass TopBar p-4/p-8 container so map sits flush to edges */}
            <div className="relative -m-4 md:-m-8 h-[calc(100vh-136px)] md:h-[calc(100vh-64px)] w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] overflow-hidden bg-[#e8eaed] flex flex-col">

                {/* ════ FLOATING SEARCH BAR (top, full width on mobile, fixed on desktop) ════ */}
                <div className="absolute top-4 left-4 right-4 lg:left-4 lg:right-auto lg:w-[400px]" style={{ zIndex: 3000 }}>
                    <SearchBar onSelect={handleSearchSelect} />
                </div>

                {/* ════ DESKTOP SIDE PANEL ════ */}
                {pins.length > 0 && (
                    <div className="hidden lg:flex absolute top-[76px] left-4 z-[1000] w-[400px] flex-col bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.15)] max-h-[calc(100vh-160px)] overflow-hidden">
                        {/* Route summary */}
                        {pins.length >= 2 && (
                            <div className="px-4 py-3 border-b border-[#e8eaed] bg-[#f97316] rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Navigation className="h-5 w-5 text-white" />
                                        <div>
                                            <p style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 15, fontWeight: 600 }} className="text-white">
                                                {loading ? 'Calculating…' : fmtDist(totalDist)}
                                            </p>
                                            <p style={{ fontFamily: "Roboto, sans-serif", fontSize: 12 }} className="text-orange-100">
                                                {loading ? '' : `~${walkMins} min walk · ${pins.length} stops`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowRoute(r => !r)}
                                            className={`text-[11px] font-medium px-3 py-1.5 rounded-full transition ${showRoute ? 'bg-white text-[#f97316]' : 'bg-orange-600 text-white border border-orange-400'}`}
                                            style={{ fontFamily: "'Google Sans', sans-serif" }}>
                                            {showRoute ? 'Hide route' : 'Show route'}
                                        </button>
                                        <button onClick={() => { setPins([]); setNextId(1) }}
                                            className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-orange-600 text-white border border-orange-400 hover:bg-orange-500 transition"
                                            style={{ fontFamily: "'Google Sans', sans-serif" }}>
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pins list */}
                        <div className="overflow-y-auto">
                            {pins.map((pin, i) => (
                                <div key={pin.id}>
                                    <div className="group flex items-center gap-3 px-4 py-3 hover:bg-[#f1f3f4] transition cursor-pointer">
                                        {/* Number marker */}
                                        <div className="h-8 w-8 shrink-0 rounded-full bg-[#f97316] flex items-center justify-center text-white text-[12px] font-bold"
                                            style={{ fontFamily: "'Google Sans', sans-serif" }}>
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 14, fontWeight: 500 }}
                                                className="text-[#202124] truncate">{pin.name}</p>
                                            <p style={{ fontFamily: "Roboto, sans-serif", fontSize: 12 }}
                                                className="text-[#70757a]">{pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}</p>
                                        </div>
                                        <button onClick={() => removePin(pin.id)}
                                            className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-[#9aa0a6] hover:text-[#5f6368] hover:bg-[#e8eaed] transition opacity-0 group-hover:opacity-100">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {/* Leg distance */}
                                    {i < pins.length - 1 && (
                                        <div className="flex items-center gap-3 px-4 py-1">
                                            <div className="w-8 flex justify-center">
                                                <div className="w-0.5 h-5 bg-[#dadce0]" />
                                            </div>
                                            {loading
                                                ? <span style={{ fontFamily: "Roboto, sans-serif", fontSize: 12 }} className="text-[#9aa0a6] animate-pulse">routing…</span>
                                                : legDistances[i]
                                                    ? <span style={{ fontFamily: "Roboto, sans-serif", fontSize: 12 }} className={failed ? 'text-orange-500' : 'text-[#f97316]'}>
                                                        {failed ? `~${fmtDist(legDistances[i])}` : fmtDist(legDistances[i])}
                                                    </span>
                                                    : null
                                            }
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ════ MOBILE BOTTOM SHEET ════ */}
                <div className={`lg:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 ${panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-64px)]'}`}
                    style={{ maxHeight: '60vh' }}>
                    <div role="button" tabIndex={0} onClick={() => setPanelOpen(o => !o)}
                        onKeyDown={e => { if (e.key === 'Enter') setPanelOpen(o => !o) }}
                        className="px-4 pt-3 pb-2 focus:outline-none">
                        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#dadce0]" />
                        <div className="flex items-center justify-between">
                            <div>
                                <p style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 15, fontWeight: 600 }} className="text-[#202124]">
                                    {pins.length === 0 ? 'No stops yet' : `${pins.length} stop${pins.length > 1 ? 's' : ''}`}
                                </p>
                                {pins.length >= 2 && !loading && (
                                    <p style={{ fontFamily: "Roboto, sans-serif", fontSize: 13 }} className="text-[#70757a]">
                                        {fmtDist(totalDist)} · ~{walkMins} min
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {pins.length > 0 && (
                                    <button onClick={e => { e.stopPropagation(); setPins([]); setNextId(1) }}
                                        className="text-[12px] px-3 py-1.5 rounded-full border border-[#dadce0] text-[#5f6368]"
                                        style={{ fontFamily: "'Google Sans', sans-serif" }}>
                                        Clear all
                                    </button>
                                )}
                                {panelOpen ? <ChevronDown className="h-5 w-5 text-[#5f6368]" /> : <ChevronUp className="h-5 w-5 text-[#5f6368]" />}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-y-auto pb-8" style={{ maxHeight: 'calc(60vh - 80px)' }}>
                        {pins.map((pin, i) => (
                            <div key={pin.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#f1f3f4]">
                                <div className="h-8 w-8 shrink-0 rounded-full bg-[#f97316] flex items-center justify-center text-white text-[12px] font-bold">{i + 1}</div>
                                <div className="flex-1 min-w-0">
                                    <p style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 14 }} className="text-[#202124] truncate font-medium">{pin.name}</p>
                                    {i < pins.length - 1 && legDistances[i] && (
                                        <p style={{ fontFamily: "Roboto, sans-serif", fontSize: 12 }} className="text-[#f97316]">{fmtDist(legDistances[i])} to next</p>
                                    )}
                                </div>
                                <button onClick={() => removePin(pin.id)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#e8eaed] transition">
                                    <X className="h-4 w-4 text-[#9aa0a6]" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ════ MAP ════ */}
                <div className="h-full w-full">
                    <MapContainer center={[34.0615, -4.981] as LatLngExpression} zoom={15} className="h-full w-full" zoomControl={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.google.com/maps">Google Maps style</a> | <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <MapClickHandler onMapClick={(lat, lng) => addPin(lat, lng, 'Dropped pin')} />
                        <FitBounds pins={pins} />
                        <FlyTo target={flyTarget} />

                        {pins.map((pin, i) => (
                            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={createIcon(i + 1)}>
                                <Popup>
                                    <div style={{ fontFamily: "'Google Sans', Roboto, sans-serif", background: '#fff', borderRadius: 12, padding: '12px 16px', minWidth: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p style={{ fontSize: 14, fontWeight: 600, color: '#202124' }}>{pin.name}</p>
                                            <div className="h-5 w-5 shrink-0 rounded-full bg-[#f97316] flex items-center justify-center text-white text-[10px] font-bold">{i + 1}</div>
                                        </div>
                                        {pin.type && <p style={{ fontSize: 12, color: '#70757a' }} className="capitalize mb-2">{pin.type}</p>}
                                        <p style={{ fontSize: 11, color: '#9aa0a6', fontFamily: 'monospace' }} className="mb-3">{pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}</p>
                                        {i < pins.length - 1 && legDistances[i] && (
                                            <p style={{ fontSize: 12, color: '#f97316', fontWeight: 500 }} className="mb-2">↓ {fmtDist(legDistances[i])} to next stop</p>
                                        )}
                                        <button onClick={e => { e.stopPropagation(); removePin(pin.id) }}
                                            style={{ fontSize: 12, color: '#d93025', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <X style={{ width: 14, height: 14 }} /> Remove stop
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {showRoute && route.points.length > 1 && (
                            <Fragment>
                                <Polyline positions={route.points} pathOptions={{ color: '#f97316', weight: 12, opacity: 0.15 }} />
                                <Polyline positions={route.points} pathOptions={{ color: '#f97316', weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }} />
                                {failed && <Polyline positions={route.points} pathOptions={{ color: '#fbbc04', weight: 3, opacity: 0.8, dashArray: '8 6' }} />}
                            </Fragment>
                        )}
                    </MapContainer>
                </div>
            </div>
        </>
    )
}
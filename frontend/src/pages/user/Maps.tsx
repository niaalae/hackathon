import { useState, useCallback, useEffect, Fragment, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { X, ChevronUp, ChevronDown, Play, MapPin, Footprints, Clock, Flame, Search, Loader2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

function createIcon(n: number, isDefault: boolean) {
    const bg = isDefault ? '#FC4C02' : '#1a1a1a'
    const ring = isDefault ? 'rgba(252,76,2,0.2)' : 'rgba(0,0,0,0.08)'
    return new DivIcon({
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -22],
        html: `<div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;inset:0;border-radius:50%;background:${ring};animation:stravapin 2s ease-in-out infinite;"></div>
      <div style="width:28px;height:28px;border-radius:50%;background:${bg};border:2.5px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff;font-family:system-ui,sans-serif;position:relative;z-index:1;">${n}</div>
    </div>`,
    })
}

interface PinData { id: number; lat: number; lng: number; name: string }
interface RouteResult { points: LatLngExpression[]; distanceM: number; failed: boolean; legDistances: number[] }
interface SearchResult { display_name: string; lat: string; lon: string; type?: string; category?: string; extratags?: { name?: string } }

const defaultPins: PinData[] = []
const defaultIds = new Set<number>()

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
        const profiles = ['foot', 'walking', 'driving']
        for (const profile of profiles) {
            const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson&steps=false&continue_straight=true`
            const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
            if (!res.ok) continue
            const data = await res.json()
            if (data.code !== 'Ok' || !data.routes?.length) continue
            const route = data.routes[0]
            const points: LatLngExpression[] = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng])
            const legDistances = (route.legs || []).map((leg: { distance: number }) => Math.round(leg.distance))
            return { points, distanceM: Math.round(route.distance), failed: false, legDistances }
        }
        return fallback
    } catch {
        return fallback
    }
}

function useRoute(pins: PinData[]) {
    const [route, setRoute] = useState<RouteResult>({ points: [], distanceM: 0, failed: false, legDistances: [] })
    const [loading, setLoading] = useState(false)
    const key = pins.map(p => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join('|')
    useEffect(() => {
        let cancelled = false
        if (pins.length < 2) { setRoute({ points: [], distanceM: 0, failed: false, legDistances: [] }); return }
        setLoading(true)
        fetchRoute(pins).then(result => { if (!cancelled) { setRoute(result); setLoading(false) } })
        return () => { cancelled = true }
    }, [key]) // eslint-disable-line
    const walkMins = Math.round(route.distanceM / 1000 * 12)
    return { route, loading, totalDist: route.distanceM, walkMins, legDistances: route.legDistances, failed: route.failed }
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng) } })
    return null
}

function FitBounds({ pins }: { pins: PinData[] }) {
    const map = useMap()
    useEffect(() => {
        if (pins.length < 2) return
        map.fitBounds(pins.map(p => [p.lat, p.lng] as [number, number]), { padding: [60, 60] })
    }, [pins.length]) // eslint-disable-line
    return null
}

function FlyTo({ target }: { target: [number, number] | null }) {
    const map = useMap()
    useEffect(() => {
        if (target) map.flyTo(target, 16, { duration: 1.2 })
    }, [target]) // eslint-disable-line
    return null
}

function fmtDist(m: number) { return m < 1000 ? `${m}m` : `${(m / 1000).toFixed(2)}km` }
function fmtDistBig(m: number) {
    if (m < 1000) return { val: `${m}`, unit: 'm' }
    return { val: (m / 1000).toFixed(2), unit: 'km' }
}
function shortName(display: string) { return display.split(',').slice(0, 2).join(', ') }

// ── SearchBar lifted outside Maps so it never remounts ──────────────────────
interface SearchBarProps {
    onSelect: (r: SearchResult) => void
}
function SearchBar({ onSelect }: SearchBarProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [searching, setSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        function handle(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setShowResults(false)
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [])

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (query.trim().length < 2) { setResults([]); setShowResults(false); return }
        debounceRef.current = setTimeout(async () => {
            setSearching(true)
            try {
                const params = new URLSearchParams({
                    format: 'json',
                    q: query,
                    limit: '6',
                    addressdetails: '1',
                    extratags: '1',
                    namedetails: '1',
                })
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?${params}`,
                    { headers: { 'Accept-Language': 'en', 'User-Agent': 'RoutePlannerApp/1.0' } }
                )
                const data: SearchResult[] = await res.json()
                setResults(data)
                setShowResults(true)
            } catch {
                setResults([])
            } finally {
                setSearching(false)
            }
        }, 400)
    }, [query])

    const handleSelect = (r: SearchResult) => {
        onSelect(r)
        setQuery('')
        setResults([])
        setShowResults(false)
    }

    return (
        <div ref={ref} className="relative px-3 py-2 border-b border-zinc-100 shrink-0">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 focus-within:border-[#FC4C02] focus-within:ring-1 focus-within:ring-orange-100 transition">
                {searching
                    ? <Loader2 className="h-3.5 w-3.5 text-zinc-400 animate-spin shrink-0" />
                    : <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                }
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    placeholder="Search for a place…"
                    className="flex-1 bg-transparent text-[13px] text-zinc-900 placeholder:text-zinc-400 outline-none"
                />
                {query && (
                    <button onClick={() => { setQuery(''); setResults([]); setShowResults(false) }}>
                        <X className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-700" />
                    </button>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute left-3 right-3 top-[calc(100%-8px)] z-50 rounded-xl border border-zinc-200 bg-white shadow-lg overflow-hidden">
                    {results.map((r, i) => {
                        const badge = r.type ?? r.category ?? null
                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(r)}
                                className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-zinc-50 transition text-left border-b border-zinc-50 last:border-0">
                                <MapPin className="h-3.5 w-3.5 text-[#FC4C02] shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <span className="text-[12px] text-zinc-800 leading-snug line-clamp-1">{r.display_name.split(',')[0]}</span>
                                    <span className="block text-[10px] text-zinc-400 line-clamp-1">{r.display_name.split(',').slice(1, 3).join(',')}</span>
                                    {badge && <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-50 text-[#FC4C02]">{badge}</span>}
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}

            {showResults && !searching && results.length === 0 && query.length >= 2 && (
                <div className="absolute left-3 right-3 top-[calc(100%-8px)] z-50 rounded-xl border border-zinc-200 bg-white shadow-lg px-4 py-3">
                    <p className="text-[12px] text-zinc-400 text-center">No results found</p>
                </div>
            )}
        </div>
    )
}
// ────────────────────────────────────────────────────────────────────────────

export default function Maps() {
    const [pins, setPins] = useState<PinData[]>(defaultPins)
    const [showRoute, setShowRoute] = useState(true)
    const [nextId, setNextId] = useState(1)
    const [editingPin, setEditingPin] = useState<number | null>(null)
    const [panelOpen, setPanelOpen] = useState(false)
    const [suppressClick, setSuppressClick] = useState(false)
    const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)
    const nextIdRef = useRef(nextId)
    nextIdRef.current = nextId

    const { route, loading, totalDist, walkMins, legDistances, failed } = useRoute(pins)
    const displayPins = pins

    const addPin = useCallback((lat: number, lng: number, name?: string) => {
        if (suppressClick) return
        const id = nextIdRef.current
        setPins(prev => [...prev, { id, lat, lng, name: name ?? `Waypoint ${id}` }])
        setNextId(n => n + 1)
    }, [suppressClick])

    const handleSearchSelect = useCallback((r: SearchResult) => {
        const lat = parseFloat(r.lat)
        const lng = parseFloat(r.lon)
        const id = nextIdRef.current
        setPins(prev => [...prev, { id, lat, lng, name: shortName(r.display_name) }])
        setNextId(n => n + 1)
        setFlyTarget([lat, lng])
    }, [])

    const removePin = (id: number) => {
        setSuppressClick(true)
        setPins(prev => prev.filter(p => p.id !== id))
        setTimeout(() => setSuppressClick(false), 300)
    }

    const updateName = (id: number, name: string) =>
        setPins(prev => prev.map(p => p.id === id ? { ...p, name } : p))

    const distBig = fmtDistBig(totalDist)

    const StatPill = ({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit: string }) => (
        <div className="flex flex-col items-center gap-0.5 px-4 py-3">
            <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">{icon}{label}</div>
            <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-zinc-900 leading-none">{value}</span>
                <span className="text-[11px] font-bold text-zinc-400 mb-0.5">{unit}</span>
            </div>
        </div>
    )

    return (
        <>
            <style>{`
                @keyframes stravapin {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.7); opacity: 0; }
                }
                .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
                .leaflet-popup-content { margin: 0 !important; }
                .leaflet-popup-tip-container { display: none; }
            `}</style>

            <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">

                {/* ════════ DESKTOP SIDEBAR ════════ */}
                <aside className="hidden lg:flex absolute inset-y-0 left-0 z-[1000] w-[300px] flex-col bg-white border-r border-zinc-100 shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FC4C02]">
                                <Play className="h-3.5 w-3.5 text-white fill-white" />
                            </div>
                            <div>
                                <h1 className="text-sm font-black text-zinc-900 leading-tight tracking-tight">Route Planner</h1>
                                <p className="text-[10px] text-zinc-400 leading-tight font-semibold uppercase tracking-wider">Plan Your Walk</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setShowRoute(r => !r)}
                                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border transition ${showRoute ? 'border-[#FC4C02] text-[#FC4C02] bg-orange-50' : 'border-zinc-200 text-zinc-400'}`}>
                                Route
                            </button>
                            {displayPins.length > 0 && (
                                <button onClick={() => { setPins([]); setNextId(1) }}
                                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border border-zinc-200 text-zinc-400 hover:border-red-400 hover:text-red-500 transition">
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <SearchBar onSelect={handleSearchSelect} />

                    {displayPins.length >= 2 && !loading && (
                        <div className="flex items-center justify-center divide-x divide-zinc-100 border-b border-zinc-100 shrink-0">
                            <StatPill icon={<Footprints className="h-3 w-3" />} label="Distance" value={distBig.val} unit={distBig.unit} />
                            <StatPill icon={<Clock className="h-3 w-3" />} label="Est. Time" value={walkMins > 0 ? `${walkMins}` : '--'} unit="min" />
                            <StatPill icon={<Flame className="h-3 w-3" />} label="Stops" value={`${displayPins.length}`} unit="pts" />
                        </div>
                    )}
                    {loading && (
                        <div className="flex items-center justify-center gap-2 py-4 border-b border-zinc-100 shrink-0">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce" />
                            <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:150ms]" />
                            <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:300ms]" />
                            <span className="text-[11px] text-zinc-400 font-medium ml-1">Calculating route…</span>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-2 py-2">
                        {displayPins.length === 0 && (
                            <div className="py-10 flex flex-col items-center gap-2">
                                <MapPin className="h-8 w-8 text-zinc-300" />
                                <p className="text-[13px] text-zinc-400 font-medium">Search or tap map to add waypoints</p>
                            </div>
                        )}
                        {displayPins.map((pin, i) => (
                            <div key={pin.id}>
                                <div className="group flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-zinc-50 transition-colors">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-black bg-zinc-900 text-white">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {editingPin === pin.id ? (
                                            <input autoFocus value={pin.name}
                                                onChange={e => updateName(pin.id, e.target.value)}
                                                onBlur={() => setEditingPin(null)}
                                                onKeyDown={e => e.key === 'Enter' && setEditingPin(null)}
                                                className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[13px] text-zinc-900 outline-none focus:border-[#FC4C02]" />
                                        ) : (
                                            <>
                                                <span onClick={() => setEditingPin(pin.id)}
                                                    className="block truncate text-[13px] font-bold text-zinc-900 leading-tight cursor-pointer">
                                                    {pin.name}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 font-mono">
                                                    {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <button onClick={() => removePin(pin.id)}
                                        className="shrink-0 h-7 w-7 flex items-center justify-center rounded-full text-zinc-300 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                {i < displayPins.length - 1 && (
                                    <div className="ml-7 pl-3 flex items-center gap-2 py-0.5 border-l-2 border-dashed border-zinc-200">
                                        {loading
                                            ? <span className="text-[10px] text-zinc-400 animate-pulse py-1">routing…</span>
                                            : legDistances[i]
                                                ? <span className={`text-[10px] font-bold tracking-wide py-1 ${failed ? 'text-amber-500' : 'text-[#FC4C02]'}`}>
                                                    {failed ? `~${fmtDist(legDistances[i])} (straight line)` : fmtDist(legDistances[i])}
                                                </span>
                                                : null
                                        }
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-zinc-100 px-5 py-3 shrink-0">
                        <p className="text-[11px] text-zinc-400 text-center font-medium">Search or tap map to add waypoints</p>
                    </div>
                </aside>

                {/* ════════ MOBILE BOTTOM SHEET ════════ */}
                <div
                    className={`lg:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl border-t border-zinc-100 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-72px)]'}`}
                    style={{ maxHeight: '70vh' }}>
                    <div role="button" tabIndex={0}
                        onClick={() => setPanelOpen(o => !o)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPanelOpen(o => !o) }}
                        className="w-full pt-3 pb-1 focus:outline-none">
                        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-zinc-200" />
                        <div className="px-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FC4C02] shrink-0">
                                <Play className="h-4 w-4 text-white fill-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-[13px] font-black text-zinc-900 leading-tight">Route Planner</p>
                                {loading
                                    ? <p className="text-[10px] text-[#FC4C02] animate-pulse font-medium">Calculating route…</p>
                                    : displayPins.length >= 2
                                        ? <p className="text-[10px] text-zinc-400 font-semibold">{displayPins.length} stops · {fmtDist(totalDist)} · ~{walkMins} min</p>
                                        : <p className="text-[10px] text-zinc-400 font-medium">Search or tap map to add stops</p>
                                }
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {displayPins.length > 0 && (
                                    <button onClick={e => { e.stopPropagation(); setPins([]); setNextId(1) }}
                                        className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-zinc-200 text-zinc-400">
                                        Clear
                                    </button>
                                )}
                                <button onClick={e => { e.stopPropagation(); setShowRoute(r => !r) }}
                                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border transition ${showRoute ? 'border-[#FC4C02] text-[#FC4C02]' : 'border-zinc-200 text-zinc-400'}`}>
                                    Route
                                </button>
                                {panelOpen ? <ChevronDown className="h-4 w-4 text-zinc-400" /> : <ChevronUp className="h-4 w-4 text-zinc-400" />}
                            </div>
                        </div>
                    </div>

                    {panelOpen && <SearchBar onSelect={handleSearchSelect} />}

                    {displayPins.length >= 2 && !loading && (
                        <div className="mx-4 mt-2 mb-1 rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden">
                            <div className="flex items-center justify-center divide-x divide-zinc-100">
                                <StatPill icon={<Footprints className="h-3 w-3" />} label="Distance" value={distBig.val} unit={distBig.unit} />
                                <StatPill icon={<Clock className="h-3 w-3" />} label="Est. Time" value={walkMins > 0 ? `${walkMins}` : '--'} unit="min" />
                                <StatPill icon={<Flame className="h-3 w-3" />} label="Stops" value={`${displayPins.length}`} unit="pts" />
                            </div>
                        </div>
                    )}

                    <div className="overflow-y-auto pb-8 px-2 mt-1" style={{ maxHeight: 'calc(70vh - 130px)' }}>
                        {displayPins.map((pin, i) => (
                            <div key={pin.id}>
                                <div className="group flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-zinc-50 transition-colors">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-black bg-zinc-900 text-white">{i + 1}</div>
                                    <div className="flex-1 min-w-0">
                                        <span className="block truncate text-[13px] font-bold text-zinc-900 leading-tight">{pin.name}</span>
                                        <span className="text-[10px] text-zinc-400 font-mono">{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</span>
                                    </div>
                                    <button onClick={() => removePin(pin.id)}
                                        className="shrink-0 h-7 w-7 flex items-center justify-center rounded-full text-zinc-300 hover:text-red-500 hover:bg-red-50 transition">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                {i < displayPins.length - 1 && legDistances[i] && (
                                    <div className="ml-7 pl-3 py-0.5 border-l-2 border-dashed border-zinc-200">
                                        <span className="text-[10px] font-bold text-[#FC4C02]">{fmtDist(legDistances[i])}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ════════ MAP ════════ */}
                <div className="h-full w-full lg:pl-[300px]">
                    <MapContainer center={[34.0615, -4.981] as LatLngExpression} zoom={16} className="h-full w-full" zoomControl={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        <MapClickHandler onMapClick={(lat, lng) => addPin(lat, lng)} />
                        <FitBounds pins={displayPins} />
                        <FlyTo target={flyTarget} />

                        {displayPins.map((pin, i) => (
                            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={createIcon(i + 1, defaultIds.has(pin.id))}>
                                <Popup>
                                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 14px', minWidth: 140, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                                        <p style={{ color: '#FC4C02', fontWeight: 900, fontSize: 13, margin: '0 0 2px' }}>{i + 1}. {pin.name}</p>
                                        <p style={{ color: '#9ca3af', fontSize: 10, margin: '0 0 8px', fontFamily: 'monospace' }}>{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</p>
                                        {i < displayPins.length - 1 && legDistances[i] && (
                                            <p style={{ color: '#FC4C02', fontSize: 10, margin: '0 0 8px', fontWeight: 700 }}>
                                                🚶 {fmtDist(legDistances[i])} to next{failed && ' (approx)'}
                                            </p>
                                        )}
                                        <button onClick={(e) => { e.stopPropagation(); removePin(pin.id) }}
                                            style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, margin: '0 auto' }}>
                                            ✕ Remove
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {showRoute && route.points.length > 1 && (
                            <Fragment>
                                <Polyline positions={route.points} pathOptions={{ color: '#FC4C02', weight: 14, opacity: 0.08 }} />
                                <Polyline positions={route.points} pathOptions={{ color: '#FC4C02', weight: 8, opacity: 0.2 }} />
                                <Polyline positions={route.points} pathOptions={failed
                                    ? { color: '#f59e0b', weight: 3, opacity: 0.7, dashArray: '6 8' }
                                    : { color: '#FC4C02', weight: 4, opacity: 1, lineCap: 'round', lineJoin: 'round' }
                                } />
                            </Fragment>
                        )}
                    </MapContainer>
                </div>
            </div>
        </>
    )
}
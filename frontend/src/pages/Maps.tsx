import { useState, useCallback, useEffect, Fragment } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { X, ChevronDown, Play, MapPin, Footprints, Clock, Flame } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'
import 'leaflet/dist/leaflet.css'

function createIcon(n: number, isDefault: boolean) {
    const bg = isDefault ? '#FC4C02' : '#1a1a1a'
    const ring = isDefault ? 'rgba(252,76,2,0.2)' : 'rgba(0,0,0,0.08)'
    return new DivIcon({
        className: '',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -28],
        html: `<div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;inset:0;border-radius:50%;background:${ring};animation:stravapin 2s ease-in-out infinite;"></div>
      <div style="width:34px;height:34px;border-radius:50%;background:${bg};border:3px solid #fff;box-shadow:0 4px 16px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#fff;font-family:system-ui,sans-serif;position:relative;z-index:1;">${n}</div>
    </div>`,
    })
}

interface PinData { id: number; lat: number; lng: number; name: string }
interface SegmentResult { points: LatLngExpression[]; distanceM: number; failed: boolean }

const defaultPins: PinData[] = [
    { id: 1, lat: 34.0622, lng: -4.9815, name: 'The Ruined Garden' },
    { id: 2, lat: 34.0628, lng: -4.9832, name: 'Café Clock' },
    { id: 3, lat: 34.0645, lng: -4.9798, name: 'Dar Roumana' },
    { id: 4, lat: 34.0612, lng: -4.9775, name: 'Restaurant Nur' },
    { id: 5, lat: 34.0595, lng: -4.9805, name: 'Palais La Medina' },
]
const defaultIds = new Set(defaultPins.map(p => p.id))

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/foot'

function straightDist(a: PinData, b: PinData) {
    return Math.round(Math.sqrt((b.lat - a.lat) ** 2 + (b.lng - a.lng) ** 2) * 111000)
}

async function fetchSegment(a: PinData, b: PinData): Promise<SegmentResult> {
    const straight = straightDist(a, b)
    const fallback: SegmentResult = {
        points: [[a.lat, a.lng], [b.lat, b.lng]],
        distanceM: straight,
        failed: true,
    }
    try {
        const url = `${OSRM_BASE}/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson&radiuses=500;500`
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
        if (!res.ok) return fallback
        const data = await res.json()
        if (data.code !== 'Ok' || !data.routes?.length) return fallback
        const route = data.routes[0]
        if (route.distance > straight * 8) return fallback
        const points: LatLngExpression[] = route.geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
        )
        return { points, distanceM: Math.round(route.distance), failed: false }
    } catch {
        return fallback
    }
}

function useSegmentedRoute(pins: PinData[]) {
    const [segments, setSegments] = useState<SegmentResult[]>([])
    const [loading, setLoading] = useState(false)
    const key = pins.map(p => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join('|')

    useEffect(() => {
        if (pins.length < 2) { setSegments([]); return }
        let cancelled = false
        setLoading(true)
        Promise.all(pins.slice(0, -1).map((pin, i) => fetchSegment(pin, pins[i + 1]))).then(results => {
            if (!cancelled) { setSegments(results); setLoading(false) }
        })
        return () => { cancelled = true }
    }, [key])

    const totalDist = segments.reduce((s, seg) => s + seg.distanceM, 0)
    const walkMins = Math.round(totalDist / 1000 * 12)
    return { segments, loading, totalDist, walkMins }
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng) } })
    return null
}

function FitBounds({ pins }: { pins: PinData[] }) {
    const map = useMap()
    useEffect(() => {
        if (pins.length < 2) return
        map.fitBounds(pins.map(p => [p.lat, p.lng] as [number, number]), {
            padding: [40, 40], paddingTopLeft: [20, 20], paddingBottomRight: [20, 40]
        })
    }, [pins.length, map])
    return null
}

function fmtDist(m: number) { return m < 1000 ? `${m}m` : `${(m / 1000).toFixed(2)}km` }
function fmtDistBig(m: number) {
    if (m < 1000) return { val: `${m}`, unit: 'm' }
    return { val: (m / 1000).toFixed(2), unit: 'km' }
}

export default function Maps() {
    const [pins, setPins] = useState<PinData[]>(defaultPins)
    const [showRoute, setShowRoute] = useState(true)
    const [nextId, setNextId] = useState(defaultPins.length + 1)
    const [editingPin, setEditingPin] = useState<number | null>(null)
    // mobile drawer: 'closed' | 'peek' | 'open'
    const [drawerState, setDrawerState] = useState<'closed' | 'peek' | 'open'>('closed')
    const { segments, loading, totalDist, walkMins } = useSegmentedRoute(pins)

    const addPin = useCallback((lat: number, lng: number) => {
        setPins(prev => [...prev, { id: nextId, lat, lng, name: `Waypoint ${nextId}` }])
        setNextId(n => n + 1)
    }, [nextId])

    const removePin = (id: number) => setPins(prev => prev.filter(p => p.id !== id))
    const updateName = (id: number, name: string) =>
        setPins(prev => prev.map(p => p.id === id ? { ...p, name } : p))

    const distBig = fmtDistBig(totalDist)
    const mapInteractive = drawerState !== 'open'

    const StatPill = ({ icon, label, value, unit }: {
        icon: React.ReactNode; label: string; value: string; unit: string
    }) => (
        <div className="flex flex-col items-center gap-1 px-3 py-2.5 sm:px-4 sm:py-3 flex-1">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {icon}<span>{label}</span>
            </div>
            <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black text-zinc-900 leading-none">{value}</span>
                <span className="text-[11px] font-bold text-zinc-400">{unit}</span>
            </div>
        </div>
    )

    const StatsBar = () => (
        <div className="flex items-stretch justify-center divide-x divide-zinc-100 border-b border-zinc-100 shrink-0">
            <StatPill icon={<Footprints className="h-3 w-3" />} label="Distance" value={distBig.val} unit={distBig.unit} />
            <StatPill icon={<Clock className="h-3 w-3" />} label="Est. Time" value={walkMins > 0 ? `${walkMins}` : '--'} unit="min" />
            <StatPill icon={<Flame className="h-3 w-3" />} label="Stops" value={`${pins.length}`} unit="pts" />
        </div>
    )

    const PinsList = () => (
        <div className="space-y-1">
            {pins.length === 0 && (
                <div className="py-10 flex flex-col items-center gap-2">
                    <MapPin className="h-10 w-10 text-zinc-300" />
                    <p className="text-sm text-zinc-400 font-medium text-center px-4">Tap the map to add waypoints</p>
                </div>
            )}
            {pins.map((pin, i) => (
                <div key={pin.id}>
                    <div className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-zinc-50 transition-colors cursor-pointer min-h-[52px]">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-black ${defaultIds.has(pin.id) ? 'bg-[#FC4C02] text-white' : 'bg-zinc-900 text-white'}`}>
                            {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            {editingPin === pin.id ? (
                                <input
                                    autoFocus
                                    value={pin.name}
                                    onChange={e => updateName(pin.id, e.target.value)}
                                    onBlur={() => setEditingPin(null)}
                                    onKeyDown={e => e.key === 'Enter' && setEditingPin(null)}
                                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 outline-none focus:border-[#FC4C02] focus:ring-1 focus:ring-orange-100 min-h-[36px]"
                                />
                            ) : (
                                <>
                                    <span onClick={() => setEditingPin(pin.id)} className="block truncate text-sm font-bold text-zinc-900 leading-tight">
                                        {pin.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-mono block">
                                        {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                                    </span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => removePin(pin.id)}
                            className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full text-zinc-300 hover:text-red-500 hover:bg-red-50 transition ml-1">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    {i < pins.length - 1 && (
                        <div className="ml-7 pl-3 flex items-center gap-2 py-0.5 border-l-2 border-dashed border-zinc-200">
                            {loading
                                ? <span className="text-[10px] text-zinc-400 animate-pulse">routing…</span>
                                : segments[i]
                                    ? <span className={`text-[10px] font-bold tracking-wide ${segments[i].failed ? 'text-amber-500' : 'text-[#FC4C02]'}`}>
                                        {segments[i].failed ? `~${fmtDist(segments[i].distanceM)} (straight line)` : fmtDist(segments[i].distanceM)}
                                    </span>
                                    : null
                            }
                        </div>
                    )}
                </div>
            ))}
        </div>
    )

    // Sidebar panel shared content
    const PanelContent = () => (
        <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-100 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FC4C02] shrink-0">
                        <Play className="h-3.5 w-3.5 text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-zinc-900 leading-tight tracking-tight">Route Planner</h1>
                        <p className="text-[10px] text-zinc-400 leading-tight font-semibold uppercase tracking-wider">Fez Medina Walk</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setShowRoute(r => !r)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border transition whitespace-nowrap ${showRoute ? 'border-[#FC4C02] text-[#FC4C02] bg-orange-50' : 'border-zinc-200 text-zinc-400 hover:border-zinc-300'}`}>
                        {showRoute ? 'Hide' : 'Show'} Route
                    </button>
                    {pins.length > 0 && (
                        <button
                            onClick={() => { setPins([]); setNextId(1) }}
                            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border border-zinc-200 text-zinc-400 hover:border-red-400 hover:text-red-500 transition whitespace-nowrap">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            {pins.length >= 2 && !loading && <StatsBar />}
            {loading && (
                <div className="flex items-center justify-center gap-2 py-4 border-b border-zinc-100 shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:0ms]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:150ms]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:300ms]" />
                    <span className="text-[11px] text-zinc-400 font-medium ml-1">Calculating route…</span>
                </div>
            )}

            {/* Pins */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
                <PinsList />
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-100 px-4 py-3 shrink-0 bg-zinc-50/50">
                <p className="text-[11px] text-zinc-400 text-center font-medium">
                    Tap map to add waypoints · click name to rename
                </p>
            </div>
        </>
    )

    return (
        <PageLayout>
            <style>{`
                @keyframes stravapin {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.7); opacity: 0; }
                }
                .leaflet-popup-content-wrapper {
                    background: transparent !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
                .leaflet-popup-content { margin: 0 !important; }
                .leaflet-popup-tip-container { display: none; }
                @keyframes drawer-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .drawer-enter { animation: drawer-up 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
            `}</style>

            <div className="relative h-screen w-full overflow-hidden">

                {/* ══════════════════════════════════
                    DESKTOP: fixed left sidebar
                ══════════════════════════════════ */}
                <div className="hidden lg:flex flex-col absolute inset-y-0 left-0 z-[1000] w-[380px] bg-white border-r border-zinc-100 shadow-sm h-full max-h-screen overflow-hidden">
                    <PanelContent />
                </div>

                {/* ══════════════════════════════════
                    MOBILE: backdrop when drawer open
                ══════════════════════════════════ */}
                {drawerState === 'open' && (
                    <div
                        className="lg:hidden fixed inset-0 z-[998] bg-black/20 backdrop-blur-[1px]"
                        onClick={() => setDrawerState('closed')}
                    />
                )}

                {/* ══════════════════════════════════
                    MOBILE: bottom drawer
                ══════════════════════════════════ */}
                <div
                    className={`lg:hidden fixed left-0 right-0 bottom-0 z-[999] bg-white rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]`}
                    style={{
                        // peek = 180px visible, open = 75vh, closed = fully offscreen
                        maxHeight: '80vh',
                        transform: drawerState === 'open'
                            ? 'translateY(0)'
                            : drawerState === 'peek'
                                ? 'translateY(calc(100% - 80px))'
                                : 'translateY(100%)',
                    }}
                >
                    {/* Drag handle + peek row */}
                    <div
                        className="flex items-center justify-between px-4 pt-3 pb-3 cursor-pointer shrink-0 border-b border-zinc-100"
                        onClick={() => setDrawerState(s => s === 'open' ? 'peek' : 'open')}
                    >
                        {/* Pill handle */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 bg-zinc-200 rounded-full" />

                        <div className="flex items-center gap-2.5 mt-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FC4C02] shrink-0">
                                <Play className="h-3.5 w-3.5 text-white fill-white" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-zinc-900 leading-tight">Fez Medina Walk</p>
                                {loading
                                    ? <p className="text-xs text-[#FC4C02] animate-pulse font-medium">Calculating…</p>
                                    : pins.length >= 2
                                        ? <p className="text-xs text-zinc-400 font-semibold">{pins.length} stops · {fmtDist(totalDist)} · ~{walkMins} min</p>
                                        : <p className="text-xs text-zinc-400 font-medium">Tap map to add stops</p>
                                }
                            </div>
                        </div>

                        <div className="mt-2 flex items-center gap-1.5">
                            <button
                                onClick={e => { e.stopPropagation(); setShowRoute(r => !r) }}
                                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border transition ${showRoute ? 'border-[#FC4C02] text-[#FC4C02] bg-orange-50' : 'border-zinc-200 text-zinc-400'}`}>
                                Route
                            </button>
                            <ChevronDown
                                className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${drawerState === 'open' ? 'rotate-0' : 'rotate-180'}`}
                            />
                        </div>
                    </div>

                    {/* Scrollable pins list (only visible when open) */}
                    <div className="flex-1 overflow-y-auto px-3 py-2">
                        {pins.length >= 2 && !loading && (
                            <div className="flex items-stretch justify-center divide-x divide-zinc-100 border-b border-zinc-100 mb-2 pb-1">
                                <StatPill icon={<Footprints className="h-3 w-3" />} label="Distance" value={distBig.val} unit={distBig.unit} />
                                <StatPill icon={<Clock className="h-3 w-3" />} label="Time" value={walkMins > 0 ? `${walkMins}` : '--'} unit="min" />
                                <StatPill icon={<Flame className="h-3 w-3" />} label="Stops" value={`${pins.length}`} unit="pts" />
                            </div>
                        )}
                        {loading && (
                            <div className="flex items-center justify-center gap-2 py-3 mb-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:0ms]" />
                                <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:150ms]" />
                                <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:300ms]" />
                                <span className="text-[11px] text-zinc-400 font-medium ml-1">Calculating route…</span>
                            </div>
                        )}
                        <PinsList />
                    </div>

                    {/* Clear all on mobile */}
                    {pins.length > 0 && (
                        <div className="px-4 pb-4 pt-1 shrink-0">
                            <button
                                onClick={() => { setPins([]); setNextId(1) }}
                                className="w-full text-xs font-bold uppercase tracking-widest py-2.5 rounded-xl border border-zinc-200 text-zinc-400 hover:border-red-400 hover:text-red-500 transition">
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* ══════════════════════════════════
                    MOBILE: FAB (when drawer closed)
                ══════════════════════════════════ */}
                {drawerState === 'closed' && (
                    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[997]">
                        <button
                            onClick={() => setDrawerState('peek')}
                            className="bg-white rounded-2xl px-4 py-3 shadow-xl border border-zinc-200 flex items-center gap-3 active:scale-95 transition-transform"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FC4C02]">
                                <Play className="h-4 w-4 text-white fill-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black text-zinc-900 leading-tight">Open Route Planner</p>
                                {pins.length >= 2
                                    ? <p className="text-xs text-zinc-400 font-semibold">{pins.length} stops · {fmtDist(totalDist)}</p>
                                    : <p className="text-xs text-zinc-400 font-medium">Tap map to add stops</p>
                                }
                            </div>
                        </button>
                    </div>
                )}

                {/* ══════════════════════════════════
                    MAP
                ══════════════════════════════════ */}
                <div className="h-full w-full lg:pl-[380px]">
                    <MapContainer
                        center={[34.0615, -4.981] as LatLngExpression}
                        zoom={16}
                        className="h-full w-full"
                        zoomControl={false}
                        touchZoom={mapInteractive}
                        doubleClickZoom={mapInteractive}
                        scrollWheelZoom={mapInteractive}
                        dragging={mapInteractive}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        <MapClickHandler onMapClick={addPin} />
                        <FitBounds pins={pins} />

                        {pins.map((pin, i) => (
                            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={createIcon(i + 1, defaultIds.has(pin.id))}>
                                <Popup>
                                    <div style={{
                                        background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
                                        padding: '14px 16px', minWidth: 160, textAlign: 'center',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)', fontFamily: 'system-ui, sans-serif',
                                    }}>
                                        <p style={{ color: '#FC4C02', fontWeight: 900, fontSize: 14, margin: '0 0 4px' }}>
                                            {i + 1}. {pin.name}
                                        </p>
                                        <p style={{ color: '#9ca3af', fontSize: 11, margin: '0 0 12px', fontFamily: 'monospace' }}>
                                            {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                                        </p>
                                        {i < pins.length - 1 && segments[i] && (
                                            <p style={{ color: '#FC4C02', fontSize: 11, margin: '0 0 12px', fontWeight: 700 }}>
                                                🚶 {fmtDist(segments[i].distanceM)} to next{segments[i].failed && ' (approx)'}
                                            </p>
                                        )}
                                        <button
                                            onClick={() => removePin(pin.id)}
                                            style={{
                                                color: '#ef4444', fontSize: 12, fontWeight: 700, background: 'none',
                                                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', gap: 6, margin: '0 auto', padding: '6px 12px',
                                                borderRadius: 8, transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                                        >
                                            ✕ Remove
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {showRoute && segments.map((seg, i) => (
                            <Fragment key={i}>
                                <Polyline positions={seg.points} pathOptions={{ color: '#FC4C02', weight: 16, opacity: 0.08 }} />
                                <Polyline positions={seg.points} pathOptions={{ color: '#FC4C02', weight: 10, opacity: 0.2 }} />
                                <Polyline positions={seg.points} pathOptions={seg.failed
                                    ? { color: '#f59e0b', weight: 4, opacity: 0.7, dashArray: '8 12' }
                                    : { color: '#FC4C02', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }
                                } />
                            </Fragment>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </PageLayout>
    )
}
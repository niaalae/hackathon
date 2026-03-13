import { useState, useCallback, useEffect, Fragment } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { X, ChevronUp, ChevronDown, Play, MapPin, Footprints, Clock, Flame } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'
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

const defaultPins: PinData[] = [
    { id: 1, lat: 34.0622, lng: -4.9815, name: 'The Ruined Garden' },
    { id: 2, lat: 34.0628, lng: -4.9832, name: 'Café Clock' },
    { id: 3, lat: 34.0645, lng: -4.9798, name: 'Dar Roumana' },
    { id: 4, lat: 34.0612, lng: -4.9775, name: 'Restaurant Nur' },
    { id: 5, lat: 34.0595, lng: -4.9805, name: 'Palais La Medina' },
]
const defaultIds = new Set(defaultPins.map(p => p.id))

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
            const points: LatLngExpression[] = route.geometry.coordinates.map(
                ([lng, lat]: [number, number]) => [lat, lng]
            )
            const legDistances = (route.legs || []).map((leg: { distance: number }) => Math.round(leg.distance))

            return {
                points,
                distanceM: Math.round(route.distance),
                failed: false,
                legDistances,
            }
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
        if (pins.length < 2) {
            setRoute({ points: [], distanceM: 0, failed: false, legDistances: [] })
            return
        }

        setLoading(true)
        fetchRoute(pins).then(result => {
            if (!cancelled) {
                setRoute(result)
                setLoading(false)
            }
        })

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
    const [panelOpen, setPanelOpen] = useState(false)
    const { route, loading, totalDist, walkMins, legDistances, failed } = useRoute(pins)

    const displayPins = pins

    const addPin = useCallback((lat: number, lng: number) => {
        setPins(prev => [...prev, { id: nextId, lat, lng, name: `Waypoint ${nextId}` }])
        setNextId(n => n + 1)
    }, [nextId])

    const removePin = (id: number) => setPins(prev => prev.filter(p => p.id !== id))
    const updateName = (id: number, name: string) =>
        setPins(prev => prev.map(p => p.id === id ? { ...p, name } : p))

    const distBig = fmtDistBig(totalDist)

    const StatPill = ({ icon, label, value, unit }: {
        icon: React.ReactNode; label: string; value: string; unit: string
    }) => (
        <div className="flex flex-col items-center gap-0.5 px-4 py-3">
            <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                {icon}{label}
            </div>
            <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-zinc-900 leading-none">{value}</span>
                <span className="text-[11px] font-bold text-zinc-400 mb-0.5">{unit}</span>
            </div>
        </div>
    )

    const PinsList = () => (
        <div className="space-y-px">
            {displayPins.length === 0 && (
                <div className="py-12 flex flex-col items-center gap-2">
                    <MapPin className="h-8 w-8 text-zinc-300" />
                    <p className="text-[13px] text-zinc-400 font-medium">Tap the map to add waypoints</p>
                </div>
            )}
            {displayPins.map((pin, i) => (
                <div key={pin.id}>
                    <div className="group flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-zinc-50 transition-colors cursor-pointer">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${defaultIds.has(pin.id) ? 'bg-[#FC4C02] text-white' : 'bg-zinc-900 text-white'}`}>
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
                                    className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[13px] text-zinc-900 outline-none focus:border-[#FC4C02] focus:ring-1 focus:ring-orange-100"
                                />
                            ) : (
                                <>
                                    <span
                                        onClick={() => setEditingPin(pin.id)}
                                        className="block truncate text-[13px] font-bold text-zinc-900 leading-tight">
                                        {pin.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-mono">
                                        {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                                    </span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => removePin(pin.id)}
                            className="shrink-0 h-7 w-7 flex items-center justify-center rounded-full text-zinc-300 hover:text-red-500 hover:bg-red-50 transition opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {i < displayPins.length - 1 && (
                        <div className="ml-7 pl-3 flex items-center gap-2 py-0.5 border-l-2 border-dashed border-zinc-200">
                            {loading
                                ? <span className="text-[10px] text-zinc-400 animate-pulse py-1">routing…</span>
                                : legDistances[i]
                                    ? <span className={`text-[10px] font-bold tracking-wide py-1 ${failed ? 'text-amber-500' : 'text-[#FC4C02]'}`}>
                                        {failed
                                            ? `~${fmtDist(legDistances[i])} (straight line)`
                                            : fmtDist(legDistances[i])
                                        }
                                    </span>
                                    : null
                            }
                        </div>
                    )}
                </div>
            ))}
        </div>
    )

    const StatsBar = () => (
        <div className="flex items-center justify-center divide-x divide-zinc-100 border-b border-zinc-100 shrink-0">
            <StatPill icon={<Footprints className="h-3 w-3" />} label="Distance" value={distBig.val} unit={distBig.unit} />
            <StatPill icon={<Clock className="h-3 w-3" />} label="Est. Time" value={walkMins > 0 ? `${walkMins}` : '--'} unit="min" />
            <StatPill icon={<Flame className="h-3 w-3" />} label="Stops" value={`${displayPins.length}`} unit="pts" />
        </div>
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
            `}</style>

            <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">

                {/* ════════ DESKTOP SIDEBAR ════════ */}
                <aside className="hidden lg:flex absolute inset-y-0 left-0 z-[1000] w-[300px] flex-col bg-white border-r border-zinc-100 shadow-sm">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FC4C02]">
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
                                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border transition ${showRoute ? 'border-[#FC4C02] text-[#FC4C02] bg-orange-50' : 'border-zinc-200 text-zinc-400'}`}>
                                Route
                            </button>
                            {displayPins.length > 0 && (
                                <button
                                    onClick={() => { setPins([]); setNextId(1) }}
                                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border border-zinc-200 text-zinc-400 hover:border-red-400 hover:text-red-500 transition">
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    {displayPins.length >= 2 && !loading && <StatsBar />}
                    {loading && (
                        <div className="flex items-center justify-center gap-2 py-4 border-b border-zinc-100 shrink-0">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:0ms]" />
                            <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:150ms]" />
                            <div className="h-1.5 w-1.5 rounded-full bg-[#FC4C02] animate-bounce [animation-delay:300ms]" />
                            <span className="text-[11px] text-zinc-400 font-medium ml-1">Calculating route…</span>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-2 py-2">
                        <PinsList />
                    </div>

                    <div className="border-t border-zinc-100 px-5 py-3 shrink-0">
                        <p className="text-[11px] text-zinc-400 text-center font-medium">Tap map to add waypoints · click name to rename</p>
                    </div>
                </aside>

                {/* ════════ MOBILE BOTTOM SHEET ════════ */}
                <div
                    className={`lg:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl border-t border-zinc-100 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-72px)]'}`}
                    style={{ maxHeight: '70vh' }}
                >
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setPanelOpen(o => !o)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPanelOpen(o => !o) }}
                        className="w-full pt-3 pb-1 focus:outline-none"
                    >
                        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-zinc-200" />
                        <div className="px-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FC4C02] shrink-0">
                                <Play className="h-4 w-4 text-white fill-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-[13px] font-black text-zinc-900 leading-tight">Fez Medina Walk</p>
                                {loading
                                    ? <p className="text-[10px] text-[#FC4C02] animate-pulse font-medium">Calculating route…</p>
                                    : displayPins.length >= 2
                                        ? <p className="text-[10px] text-zinc-400 font-semibold">{displayPins.length} stops · {fmtDist(totalDist)} · ~{walkMins} min</p>
                                        : <p className="text-[10px] text-zinc-400 font-medium">Tap map to add stops</p>
                                }
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {displayPins.length > 0 && (
                                    <button
                                        onClick={e => { e.stopPropagation(); setPins([]); setNextId(1) }}
                                        className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-zinc-200 text-zinc-400">
                                        Clear
                                    </button>
                                )}
                                <button
                                    onClick={e => { e.stopPropagation(); setShowRoute(r => !r) }}
                                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border transition ${showRoute ? 'border-[#FC4C02] text-[#FC4C02]' : 'border-zinc-200 text-zinc-400'}`}>
                                    Route
                                </button>
                                {panelOpen
                                    ? <ChevronDown className="h-4 w-4 text-zinc-400" />
                                    : <ChevronUp className="h-4 w-4 text-zinc-400" />
                                }
                            </div>
                        </div>
                    </div>

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
                        <PinsList />
                    </div>
                </div>

                {/* ════════ MAP ════════ */}
                <div className="h-full w-full lg:pl-[300px]">
                    <MapContainer
                        center={[34.0615, -4.981] as LatLngExpression}
                        zoom={16}
                        className="h-full w-full"
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        <MapClickHandler onMapClick={addPin} />
                        <FitBounds pins={displayPins} />

                        {displayPins.map((pin, i) => (
                            <Marker
                                key={pin.id}
                                position={[pin.lat, pin.lng]}
                                icon={createIcon(i + 1, defaultIds.has(pin.id))}>
                                <Popup>
                                    <div style={{
                                        background: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 12,
                                        padding: '10px 14px',
                                        minWidth: 140,
                                        textAlign: 'center',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    }}>
                                        <p style={{ color: '#FC4C02', fontWeight: 900, fontSize: 13, margin: '0 0 2px' }}>
                                            {i + 1}. {pin.name}
                                        </p>
                                        <p style={{ color: '#9ca3af', fontSize: 10, margin: '0 0 8px', fontFamily: 'monospace' }}>
                                            {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                                        </p>
                                        {i < displayPins.length - 1 && legDistances[i] && (
                                            <p style={{ color: '#FC4C02', fontSize: 10, margin: '0 0 8px', fontWeight: 700 }}>
                                                🚶 {fmtDist(legDistances[i])} to next
                                                {failed && ' (approx)'}
                                            </p>
                                        )}
                                        <button
                                            onClick={() => removePin(pin.id)}
                                            style={{
                                                color: '#ef4444',
                                                fontSize: 11,
                                                fontWeight: 700,
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                margin: '0 auto',
                                            }}>
                                            ✕ Remove
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {showRoute && route.points.length > 1 && (
                            <Fragment>
                                {/* Outer glow */}
                                <Polyline
                                    positions={route.points}
                                    pathOptions={{ color: '#FC4C02', weight: 14, opacity: 0.08 }}
                                />
                                {/* Mid glow */}
                                <Polyline
                                    positions={route.points}
                                    pathOptions={{ color: '#FC4C02', weight: 8, opacity: 0.2 }}
                                />
                                {/* Core line — dashed amber if OSRM failed, solid orange if road-snapped */}
                                <Polyline
                                    positions={route.points}
                                    pathOptions={failed
                                        ? { color: '#f59e0b', weight: 3, opacity: 0.7, dashArray: '6 8' }
                                        : { color: '#FC4C02', weight: 4, opacity: 1, lineCap: 'round', lineJoin: 'round' }
                                    }
                                />
                            </Fragment>
                        )}
                    </MapContainer>
                </div>
            </div>
        </PageLayout>
    )
}

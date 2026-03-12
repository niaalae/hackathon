import { useState, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import { DivIcon, Icon } from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { MapPin, Route, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'
import 'leaflet/dist/leaflet.css'

/* ── Custom pin icons ── */
function createNumberedIcon(n: number, isDefault: boolean) {
    return new DivIcon({
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
        html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${isDefault ? '#f97316' : '#18181b'};
      border:2.5px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,.18);
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:700;color:#fff;
      font-family:Inter,system-ui,sans-serif;
    ">${n}</div>`,
    })
}

interface PinData { id: number; lat: number; lng: number; name: string }

const defaultPins: PinData[] = [
    { id: 1, lat: 34.0331, lng: -5.0003, name: 'Fes Medina' },
    { id: 2, lat: 33.9716, lng: -6.8498, name: 'Rabat' },
    { id: 3, lat: 31.6295, lng: -7.9811, name: 'Marrakech' },
    { id: 4, lat: 35.7595, lng: -5.8340, name: 'Tangier' },
    { id: 5, lat: 31.5085, lng: -9.7595, name: 'Essaouira' },
]
const defaultIds = new Set(defaultPins.map((p) => p.id))

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng) } })
    return null
}



export default function Maps() {
    const [pins, setPins] = useState<PinData[]>(defaultPins)
    const [showRoute, setShowRoute] = useState(true)
    const [nextId, setNextId] = useState(defaultPins.length + 1)
    const [editingPin, setEditingPin] = useState<number | null>(null)
    const [panelOpen, setPanelOpen] = useState(false)
    const [routeGeometry, setRouteGeometry] = useState<LatLngExpression[]>([])
    const [osrmDistance, setOsrmDistance] = useState<number>(0)
    const [isLoadingRoute, setIsLoadingRoute] = useState(false)

    const fetchRoute = useCallback(async (currentPins: PinData[]) => {
        if (currentPins.length < 2) {
            setRouteGeometry([])
            setOsrmDistance(0)
            return
        }

        setIsLoadingRoute(true)
        try {
            const coordinates = currentPins.map(p => `${p.lng},${p.lat}`).join(';')
            const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`)
            const data = await response.json()

            if (data.code === 'Ok' && data.routes.length > 0) {
                const route = data.routes[0]
                const geometry = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
                setRouteGeometry(geometry)
                setOsrmDistance(Math.round(route.distance / 1000))
            }
        } catch (error) {
            console.error('Error fetching OSRM route:', error)
        } finally {
            setIsLoadingRoute(false)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRoute(pins)
        }, 300)
        return () => clearTimeout(timer)
    }, [pins, fetchRoute])

    const handleMapClick = useCallback((lat: number, lng: number) => {
        setPins((prev) => [...prev, { id: nextId, lat, lng, name: `Pin ${nextId}` }])
        setNextId((prev) => prev + 1)
    }, [nextId])

    const removePin = (id: number) => setPins((prev) => prev.filter((p) => p.id !== id))
    const updatePinName = (id: number, name: string) => setPins((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))

    const center: LatLngExpression = [33.0, -6.5]

    /* ── Shared pin list component ── */
    const PinsList = () => (
        <div className="space-y-0.5">
            {pins.length === 0 && (
                <p className="text-[13px] text-zinc-400 text-center py-8">Tap the map to drop a pin</p>
            )}
            {pins.map((pin, index) => (
                <div key={pin.id} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-zinc-50/80 transition-colors">
                    <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${defaultIds.has(pin.id) ? 'bg-orange-500' : 'bg-zinc-900'}`}
                    >
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        {editingPin === pin.id ? (
                            <input
                                autoFocus
                                value={pin.name}
                                onChange={(e) => updatePinName(pin.id, e.target.value)}
                                onBlur={() => setEditingPin(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditingPin(null)}
                                className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[13px] text-zinc-900 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                            />
                        ) : (
                            <>
                                <span onClick={() => setEditingPin(pin.id)} className="block truncate text-[13px] font-medium text-zinc-800 cursor-pointer leading-tight">
                                    {pin.name}
                                </span>
                                <span className="text-[10px] text-zinc-400 leading-tight">{pin.lat.toFixed(3)}, {pin.lng.toFixed(3)}</span>
                            </>
                        )}
                    </div>
                    <button onClick={() => removePin(pin.id)} className="shrink-0 p-1 text-zinc-300 hover:text-red-500 transition lg:opacity-0 lg:group-hover:opacity-100">
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ))}
        </div>
    )

    /* ── Toggle switch ── */
    const Toggle = () => (
        <button
            onClick={() => setShowRoute(!showRoute)}
            className={`relative w-8 h-[18px] rounded-full transition-colors ${showRoute ? 'bg-orange-500' : 'bg-zinc-300'}`}
        >
            <span className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform ${showRoute ? 'translate-x-[14px]' : 'translate-x-[2px]'}`} />
        </button>
    )

    return (
        <PageLayout>
            <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-zinc-100">

                {/* ══════ Desktop Sidebar ══════ */}
                <div className="hidden lg:flex absolute inset-y-0 left-0 z-[1000] w-[300px] flex-col bg-white border-r border-zinc-200/70">

                    <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
                            <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-zinc-900 leading-tight">Trip Map</h1>
                            <p className="text-[10px] text-zinc-400 leading-tight">Click map to add stops</p>
                        </div>
                    </div>

                    {/* Controls row */}
                    <div className="px-5 py-2.5 border-b border-zinc-100 flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <Route className="h-3 w-3 text-zinc-400" />
                            <span className="text-zinc-500 font-medium">Route</span>
                            <Toggle />
                        </div>
                        <div className="h-3 w-px bg-zinc-200" />
                        {pins.length >= 2 ? (
                            <span className={`transition-opacity duration-300 ${isLoadingRoute ? 'opacity-50' : 'opacity-100'}`}>
                                {pins.length} stops · {osrmDistance} km
                            </span>
                        ) : (
                            <span className="text-zinc-400">{pins.length} pins</span>
                        )}
                        {pins.length > 0 && (
                            <button onClick={() => setPins([])} className="ml-auto text-[10px] font-medium text-zinc-400 hover:text-red-500 transition uppercase tracking-wider">
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 py-1">
                        <PinsList />
                    </div>
                </div>

                {/* ══════ Mobile Bottom Sheet ══════ */}
                <div
                    className={`lg:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-[20px] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-52px)]'}`}
                    style={{ maxHeight: '55vh' }}
                >
                    <button onClick={() => setPanelOpen(!panelOpen)} className="w-full pt-2.5 pb-2 cursor-pointer">
                        <div className="mx-auto h-[3px] w-8 rounded-full bg-zinc-300 mb-2.5" />
                        <div className="px-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-900">
                                    <MapPin className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-[13px] font-semibold text-zinc-900">{pins.length} stops</span>
                                {pins.length >= 2 && <span className={`text-[11px] text-zinc-400 transition-opacity ${isLoadingRoute ? 'opacity-50' : 'opacity-100'}`}>· {osrmDistance} km</span>}
                            </div>
                            {panelOpen ? <ChevronDown className="h-4 w-4 text-zinc-400" /> : <ChevronUp className="h-4 w-4 text-zinc-400" />}
                        </div>
                    </button>

                    <div className="overflow-y-auto pb-6" style={{ maxHeight: 'calc(55vh - 52px)' }}>
                        <div className="mx-3 mb-2 flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-2">
                            <Route className="h-3 w-3 text-zinc-400" />
                            <span className="text-xs text-zinc-500 font-medium flex-1">Route</span>
                            <Toggle />
                        </div>
                        {pins.length > 0 && (
                            <div className="flex justify-end px-4 mb-1">
                                <button onClick={() => setPins([])} className="text-[10px] font-medium text-zinc-400 hover:text-red-500 uppercase tracking-wider">Clear all</button>
                            </div>
                        )}
                        <div className="px-1">
                            <PinsList />
                        </div>
                    </div>
                </div>

                {/* ══════ Map ══════ */}
                <MapContainer center={center} zoom={6} className="h-full w-full z-0" zoomControl={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <MapClickHandler onMapClick={handleMapClick} />

                    {pins.map((pin, index) => (
                        <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={createNumberedIcon(index + 1, defaultIds.has(pin.id))}>
                            <Popup>
                                <div className="text-center min-w-[100px]">
                                    <strong className="text-[13px] text-zinc-900">{pin.name}</strong>
                                    <br />
                                    <span className="text-[10px] text-zinc-400">{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</span>
                                    <br />
                                    <button onClick={() => removePin(pin.id)} className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-red-500 hover:text-red-600">
                                        <Trash2 className="h-2.5 w-2.5" /> Remove
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {showRoute && pins.length >= 2 && routeGeometry.length > 0 && (
                        <Polyline positions={routeGeometry} pathOptions={{ color: '#18181b', weight: 2.5, opacity: 0.7, dashArray: '8 6' }} />
                    )}
                </MapContainer>
            </div>
        </PageLayout>
    )
}

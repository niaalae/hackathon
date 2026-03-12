import { useMemo, useState } from 'react'
import {
  Car,
  Clock,
  DollarSign,
  Footprints,
  MapPin,
  Navigation,
  Plus,
  Route,
  Search,
  TrainFront,
  X,
} from 'lucide-react'
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

interface Pin {
  id: string
  name: string
  type: 'riad' | 'restaurant' | 'attraction' | 'market' | 'custom'
  lat: number
  lng: number
  description?: string
}

interface RouteData {
  id: string
  from: string
  to: string
  mode: 'walking' | 'driving' | 'transit'
  duration: string
  distance: string
  cost?: string
}

const pins: Pin[] = [
  { id: '1', name: 'Bab Boujloud', type: 'attraction', lat: 34.0618, lng: -4.9821, description: 'Famous Blue Gate entrance to Medina' },
  { id: '2', name: 'Riad Fes Maya', type: 'riad', lat: 34.0611, lng: -4.9846, description: 'Traditional accommodation' },
  { id: '3', name: 'Al-Qarawiyyin Mosque', type: 'attraction', lat: 34.0646, lng: -4.9767, description: 'Oldest university in the world' },
  { id: '4', name: 'Chouara Tannery', type: 'attraction', lat: 34.0651, lng: -4.9732, description: 'Historic leather tannery' },
  { id: '5', name: 'Cafe Clock', type: 'restaurant', lat: 34.0602, lng: -4.9815, description: 'Famous camel burger spot' },
  { id: '6', name: 'Souk El Attarine', type: 'market', lat: 34.0658, lng: -4.9761, description: 'Spice and perfume market' },
  { id: '7', name: 'Bab Mansour', type: 'attraction', lat: 33.8949, lng: -5.5616, description: 'Grand gate of Meknes' },
  { id: '8', name: 'Volubilis Ruins', type: 'attraction', lat: 34.0724, lng: -5.5547, description: 'Roman archaeological site' },
]

const routes: RouteData[] = [
  { id: '1', from: 'Riad Fes Maya', to: 'Chouara Tannery', mode: 'walking', duration: '15 min', distance: '1.2 km' },
  { id: '2', from: 'Fes Medina', to: 'Meknes', mode: 'driving', duration: '45 min', distance: '60 km', cost: '50 MAD' },
  { id: '3', from: 'Meknes', to: 'Volubilis', mode: 'driving', duration: '30 min', distance: '30 km', cost: '80 MAD' },
]

const pinColors: Record<Pin['type'], string> = {
  riad: 'bg-orange-500',
  restaurant: 'bg-amber-500',
  attraction: 'bg-orange-500',
  market: 'bg-amber-500',
  custom: 'bg-zinc-400',
}

const modeIcons = {
  walking: Footprints,
  driving: Car,
  transit: TrainFront,
}

const routeLines: Array<Array<[number, number]>> = [
  [
    [34.0611, -4.9846],
    [34.0651, -4.9732],
  ],
  [
    [34.0331, -5.0003],
    [33.8949, -5.5616],
  ],
  [
    [33.8949, -5.5616],
    [34.0724, -5.5547],
  ],
]

// Fix Leaflet default marker paths with Vite.
// @ts-expect-error Leaflet internal override
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default function UserMaps() {
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [showRoutes, setShowRoutes] = useState(true)
  const [activeTab, setActiveTab] = useState<'pins' | 'routes'>('pins')
  const [transportMode, setTransportMode] = useState<'walking' | 'driving' | 'transit'>('walking')
  const mapCenter = useMemo<[number, number]>(() => [34.0331, -5.0003], [])

  return (
    <div className='space-y-4'>
      <div>
        <h2 className='text-2xl font-semibold text-zinc-900'>Interactive Maps</h2>
        <p className='text-sm text-zinc-500'>Explore Fes-Meknes region with custom routes and pins</p>
      </div>

      <div className='flex h-[600px] overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-sm'>
        <div className='flex w-80 flex-col border-r border-zinc-200 bg-zinc-50'>
          <div className='p-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
              <input
                placeholder='Search locations...'
                className='h-10 w-full rounded-full border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-700'
              />
            </div>
            <div className='mt-4 flex gap-2'>
              <button
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold ${activeTab === 'pins' ? 'bg-orange-500 text-white' : 'bg-white text-zinc-600'}`}
                onClick={() => setActiveTab('pins')}
              >
                Pins
              </button>
              <button
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold ${activeTab === 'routes' ? 'bg-orange-500 text-white' : 'bg-white text-zinc-600'}`}
                onClick={() => setActiveTab('routes')}
              >
                Routes
              </button>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto p-4'>
            {activeTab === 'pins' && (
              <div className='space-y-3'>
                <button className='flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-zinc-300 bg-white py-2 text-xs font-semibold text-zinc-600'>
                  <Plus className='h-4 w-4' />
                  Add New Pin
                </button>
                {pins.map((pin) => (
                  <button
                    key={pin.id}
                    className={`w-full rounded-2xl border p-3 text-left transition ${selectedPin?.id === pin.id ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-200 bg-white'}`}
                    onClick={() => setSelectedPin(pin)}
                  >
                    <div className='flex items-start gap-3'>
                      <div className={`rounded-lg p-2 ${pinColors[pin.type]} text-white`}>
                        <MapPin className='h-4 w-4' />
                      </div>
                      <div>
                        <div className='text-sm font-semibold text-zinc-900'>{pin.name}</div>
                        <div className='text-xs text-zinc-500'>{pin.type}</div>
                        {pin.description && <div className='text-xs text-zinc-400'>{pin.description}</div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'routes' && (
              <div className='space-y-3'>
                <div className='flex gap-2'>
                  {(['walking', 'driving', 'transit'] as const).map((mode) => {
                    const Icon = modeIcons[mode]
                    return (
                      <button
                        key={mode}
                        className={`flex-1 rounded-full px-2 py-2 text-xs font-semibold ${transportMode === mode ? 'bg-orange-500 text-white' : 'bg-white text-zinc-600'}`}
                        onClick={() => setTransportMode(mode)}
                      >
                        <span className='flex items-center justify-center gap-1'>
                          <Icon className='h-4 w-4' />
                          {mode}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <button className='flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-zinc-300 bg-white py-2 text-xs font-semibold text-zinc-600'>
                  <Plus className='h-4 w-4' />
                  Create Route
                </button>
                {routes.map((route) => {
                  const ModeIcon = modeIcons[route.mode]
                  return (
                    <div key={route.id} className='rounded-2xl border border-zinc-200 bg-white p-3'>
                      <div className='flex items-center gap-2 text-sm font-semibold text-zinc-900'>
                        <ModeIcon className='h-4 w-4 text-orange-500' />
                        {route.mode}
                      </div>
                      <div className='mt-2 flex items-center gap-2 text-sm text-zinc-600'>
                        <span>{route.from}</span>
                        <Navigation className='h-3 w-3 text-zinc-400' />
                        <span>{route.to}</span>
                      </div>
                      <div className='mt-2 flex items-center gap-3 text-xs text-zinc-500'>
                        <span className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {route.duration}
                        </span>
                        <span>{route.distance}</span>
                        {route.cost && (
                          <span className='flex items-center gap-1'>
                            <DollarSign className='h-3 w-3' />
                            {route.cost}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className='relative flex-1 bg-zinc-50'>
          <div className='absolute right-4 top-4 z-10'>
            <button
              className={`rounded-full border border-zinc-200 p-2 shadow-sm ${showRoutes ? 'bg-orange-500 text-white' : 'bg-white text-zinc-600'}`}
              onClick={() => setShowRoutes(!showRoutes)}
            >
              <Route className='h-4 w-4' />
            </button>
          </div>

          <MapContainer center={mapCenter} zoom={10} className='h-full w-full'>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {showRoutes &&
              routeLines.map((line, index) => (
                <Polyline key={index} positions={line} pathOptions={{ color: index === 0 ? '#f97316' : '#f59e0b', weight: 3, dashArray: '6 6' }} />
              ))}
            {pins.map((pin) => (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                eventHandlers={{ click: () => setSelectedPin(pin) }}
              >
                <Popup>
                  <div className='text-sm font-semibold text-zinc-900'>{pin.name}</div>
                  <div className='text-xs text-zinc-500 capitalize'>{pin.type}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {selectedPin && (
            <div className='absolute bottom-4 right-4 w-80 rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg'>
              <div className='flex items-start justify-between'>
                <div>
                  <div className='text-sm font-semibold text-zinc-900'>{selectedPin.name}</div>
                  <div className='mt-1 text-xs text-zinc-500'>{selectedPin.type}</div>
                </div>
                <button onClick={() => setSelectedPin(null)} className='text-zinc-400 hover:text-zinc-600'>
                  <X className='h-4 w-4' />
                </button>
              </div>
              {selectedPin.description && <p className='mt-3 text-sm text-zinc-500'>{selectedPin.description}</p>}
              <div className='mt-4 flex gap-2'>
                <button className='flex-1 rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white'>Get Directions</button>
                <button className='rounded-full border border-zinc-200 px-3 py-2 text-xs text-zinc-600'>Edit</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

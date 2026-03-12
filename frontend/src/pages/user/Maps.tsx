import { useState } from 'react'
import {
  Car,
  Clock,
  DollarSign,
  Footprints,
  Layers,
  MapPin,
  Navigation,
  Plus,
  Route,
  Search,
  TrainFront,
  X,
} from 'lucide-react'

interface Pin {
  id: string
  name: string
  type: 'riad' | 'restaurant' | 'attraction' | 'market' | 'custom'
  x: number
  y: number
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
  { id: '1', name: 'Bab Boujloud', type: 'attraction', x: 45, y: 35, description: 'Famous Blue Gate entrance to Medina' },
  { id: '2', name: 'Riad Fes Maya', type: 'riad', x: 50, y: 42, description: 'Traditional accommodation' },
  { id: '3', name: 'Al-Qarawiyyin Mosque', type: 'attraction', x: 52, y: 38, description: 'Oldest university in the world' },
  { id: '4', name: 'Chouara Tannery', type: 'attraction', x: 55, y: 32, description: 'Historic leather tannery' },
  { id: '5', name: 'Cafe Clock', type: 'restaurant', x: 48, y: 40, description: 'Famous camel burger spot' },
  { id: '6', name: 'Souk El Attarine', type: 'market', x: 51, y: 36, description: 'Spice and perfume market' },
  { id: '7', name: 'Bab Mansour', type: 'attraction', x: 25, y: 55, description: 'Grand gate of Meknes' },
  { id: '8', name: 'Volubilis Ruins', type: 'attraction', x: 15, y: 25, description: 'Roman archaeological site' },
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

export default function UserMaps() {
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [showRoutes, setShowRoutes] = useState(true)
  const [activeTab, setActiveTab] = useState<'pins' | 'routes'>('pins')
  const [transportMode, setTransportMode] = useState<'walking' | 'driving' | 'transit'>('walking')

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
          <div className='absolute right-4 top-4 z-10 flex flex-col gap-2'>
            <button className='rounded-full border border-zinc-200 bg-white p-2 shadow-sm'>
              <Layers className='h-4 w-4 text-zinc-600' />
            </button>
            <button
              className={`rounded-full border border-zinc-200 p-2 shadow-sm ${showRoutes ? 'bg-orange-500 text-white' : 'bg-white text-zinc-600'}`}
              onClick={() => setShowRoutes(!showRoutes)}
            >
              <Route className='h-4 w-4' />
            </button>
          </div>

          <div className='absolute inset-0 overflow-hidden'>
            <svg className='h-full w-full opacity-10' xmlns='http://www.w3.org/2000/svg'>
              <defs>
                <pattern id='grid-map' width='40' height='40' patternUnits='userSpaceOnUse'>
                  <path d='M 40 0 L 0 0 0 40' fill='none' stroke='currentColor' strokeWidth='0.5' />
                </pattern>
              </defs>
              <rect width='100%' height='100%' fill='url(#grid-map)' />
            </svg>

            {showRoutes && (
              <svg className='absolute inset-0 h-full w-full'>
                <path d='M 50% 40% Q 35% 45% 25% 55%' className='stroke-orange-500 fill-none' strokeWidth='2' strokeDasharray='4' />
                <path d='M 25% 55% Q 18% 40% 15% 25%' className='stroke-amber-500 fill-none' strokeWidth='2' strokeDasharray='4' />
              </svg>
            )}

            {pins.map((pin) => (
              <button
                key={pin.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${selectedPin?.id === pin.id ? 'scale-125' : 'hover:scale-110'} transition`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                onClick={() => setSelectedPin(pin)}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${pinColors[pin.type]} text-white shadow-lg ring-2 ring-white`}>
                  <MapPin className='h-4 w-4' />
                </div>
              </button>
            ))}
          </div>

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

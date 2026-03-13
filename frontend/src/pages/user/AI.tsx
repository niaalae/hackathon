import { useState, useEffect, useRef } from 'react'
import {
  Sparkles,
  Plane,
  Hotel,
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  Lightbulb,
  X,
} from 'lucide-react'
import api from '@/lib/api'

// ── Types ──────────────────────────────────────────────────────────────────

type BookingSuggestion = {
  title: string
  type: 'flight' | 'stay' | 'activity' | 'transport' | 'rental' | 'guide' | 'other'
  priceRange?: string
  notes?: string
}

type FlightOption = {
  airline: string
  from: string
  to: string
  departure: string
  arrival: string
  duration: string
  stops: number
  price: number
  isBestValue: boolean
}

type HotelOption = {
  name: string
  stars: number
  pricePerNight: number
  totalPrice: number
  location: string
  rating: number
  amenities: string[]
  isRecommended: boolean
}

type DayPlan = {
  day: number
  theme: string
  morning: string[]
  afternoon: string[]
  evening: string[]
  estimatedDailyCost: number
}

type BudgetBreakdown = {
  flights: number
  hotels: number
  food: number
  activities: number
  transport: number
  misc: number
}

type TravelPlan = {
  from: { city: string; country: string }
  to: { city: string; country: string }
  duration: number
  totalBudget: number
  totalEstimatedCost: number
  budgetMatch: number
  flights: FlightOption[]
  hotels: HotelOption[]
  itinerary: DayPlan[]
  budgetBreakdown: BudgetBreakdown
  tips: string[]
  packingList: string[]
}

type HeroAgentResponse = {
  answer: string
  intent?: 'booking' | 'information' | 'collaboration' | 'guide' | 'new_trip'
  followUpQuestion?: string
  bookings: BookingSuggestion[]
  travelPlan?: TravelPlan
}

// ── Loading messages ───────────────────────────────────────────────────────

const LOADING_MESSAGES = [
  '✈️ Searching best flights...',
  '🏨 Finding riads in your budget...',
  '🗺️ Building your Morocco itinerary...',
  '💰 Calculating costs in USD & MAD...',
  '✅ Almost ready...',
]

const TABS = ['Overview', 'Flights', 'Hotels', 'Itinerary', 'Budget', 'Tips & Packing']

const BUDGET_COLORS: Record<string, string> = {
  flights: 'bg-blue-400',
  hotels: 'bg-green-400',
  food: 'bg-orange-400',
  activities: 'bg-purple-400',
  transport: 'bg-red-400',
  misc: 'bg-gray-400',
}

// ── Component ──────────────────────────────────────────────────────────────

export default function UserAI() {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'result' | 'error'>('idle')
  const [input, setInput] = useState('')
  const [plan, setPlan] = useState<HeroAgentResponse | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [openDays, setOpenDays] = useState<number[]>([1])
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  // Loading state cycling
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [progressWidth, setProgressWidth] = useState(0)
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (phase === 'loading') {
      setLoadingMsgIdx(0)
      setProgressWidth(0)

      // Progress bar animation
      progressTimerRef.current = setTimeout(() => setProgressWidth(95), 50)

      // Message cycling
      cycleTimerRef.current = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length)
      }, 1200)
    } else {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current)
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current)
    }
    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current)
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current)
    }
  }, [phase])

  const handleSubmit = async () => {
    if (!input.trim()) return
    setPhase('loading')
    try {
      const res = await api.post<HeroAgentResponse>('/agent/hero', { prompt: input })
      setPlan(res.data)
      setPhase('result')
      setActiveTab(0)
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setPhase('error')
    }
  }

  const resetToIdle = () => {
    setPhase('idle')
    setPlan(null)
    setInput('')
    setActiveTab(0)
    setOpenDays([1])
    setCheckedItems([])
    setProgressWidth(0)
  }

  const toggleDay = (day: number) => {
    setOpenDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const togglePacking = (item: string) => {
    setCheckedItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

  const setChip = (text: string) => setInput(text)

  // ── IDLE ──────────────────────────────────────────────────────────────────

  if (phase === 'idle') {
    return (
      <div className='space-y-6'>
        <div>
          <div className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-orange-500' />
            <h2 className='text-xl font-semibold text-zinc-900 sm:text-2xl'>AI Travel Planner 🇲🇦</h2>
          </div>
          <p className='mt-1 text-sm text-zinc-500'>
            Describe your trip to Morocco and get a complete personalized plan
          </p>
        </div>

        <div className='rounded-[20px] border border-zinc-200 bg-white p-6 shadow-sm space-y-4'>
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='e.g. I want to go to Fes from New York for 7 days with a $1500 budget'
            className='w-full rounded-2xl border border-zinc-200 p-4 text-sm text-zinc-700 placeholder-zinc-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-none'
          />

          <div className='flex flex-wrap gap-2'>
            {[
              '🕌 Fes medina $1500 7 days',
              '🏜️ Sahara Merzouga $2000 10 days',
              '🌊 Essaouira weekend $800 3 days',
              '🏔️ Atlas Imlil $1200 5 days',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => setChip(chip)}
                className='rounded-full border border-zinc-200 px-3 py-2 text-xs text-zinc-600 hover:border-orange-400 hover:text-orange-600 transition-colors cursor-pointer'
              >
                {chip}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className='flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 transition-colors'
          >
            <Sparkles className='h-4 w-4' />
            Plan My Morocco Trip →
          </button>
        </div>

        <div className='mx-auto mt-6 w-fit rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-400'>
          🌍 International destinations coming soon
        </div>
      </div>
    )
  }

  // ── LOADING ───────────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <div className='space-y-6'>
        <div>
          <div className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-orange-500' />
            <h2 className='text-xl font-semibold text-zinc-900 sm:text-2xl'>AI Travel Planner 🇲🇦</h2>
          </div>
        </div>
        <div className='rounded-[20px] border border-zinc-200 bg-white p-8 shadow-sm flex flex-col items-center gap-6'>
          <div className='h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center'>
            <Plane className='h-7 w-7 text-orange-500 animate-bounce' />
          </div>
          <p className='text-sm font-medium text-zinc-700 text-center min-h-[1.5rem]'>
            {LOADING_MESSAGES[loadingMsgIdx]}
          </p>
          <div className='w-full bg-zinc-100 rounded-full h-2 overflow-hidden'>
            <div
              className='h-2 bg-orange-500 rounded-full'
              style={{
                width: `${progressWidth}%`,
                transition: 'width 4000ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>
          <p className='text-xs text-zinc-400'>Building your personalized Morocco plan…</p>
        </div>
      </div>
    )
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────

  if (phase === 'error') {
    return (
      <div className='space-y-6'>
        <div>
          <div className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-orange-500' />
            <h2 className='text-xl font-semibold text-zinc-900 sm:text-2xl'>AI Travel Planner 🇲🇦</h2>
          </div>
        </div>
        <div className='rounded-[20px] border border-zinc-200 bg-white p-8 shadow-sm flex flex-col items-center gap-4'>
          <div className='h-14 w-14 rounded-full bg-red-100 flex items-center justify-center'>
            <X className='h-7 w-7 text-red-500' />
          </div>
          <p className='text-sm text-zinc-600 text-center'>{errorMsg}</p>
          <button
            onClick={() => setPhase('idle')}
            className='rounded-2xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // ── RESULT ────────────────────────────────────────────────────────────────

  if (!plan) return null

  // Fallback: no travelPlan
  if (!plan.travelPlan) {
    return (
      <div className='space-y-6'>
        <div>
          <div className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-orange-500' />
            <h2 className='text-xl font-semibold text-zinc-900 sm:text-2xl'>AI Travel Planner 🇲🇦</h2>
          </div>
        </div>
        <div className='rounded-2xl bg-orange-50 border border-orange-100 p-4 text-sm text-zinc-700'>
          <div className='flex items-start gap-2'>
            <Sparkles className='h-4 w-4 text-orange-500 mt-0.5 shrink-0' />
            <p>{plan.answer}</p>
          </div>
        </div>
        <div className='space-y-3'>
          {plan.bookings.map((b, i) => (
            <div key={i} className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'>
              <div className='flex items-center justify-between'>
                <span className='font-semibold text-zinc-900 text-sm'>{b.title}</span>
                <span className='rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600'>{b.type}</span>
              </div>
              {b.priceRange && <p className='mt-1 text-xs text-zinc-500'>{b.priceRange}</p>}
              {b.notes && <p className='mt-1 text-xs text-zinc-400'>{b.notes}</p>}
            </div>
          ))}
        </div>
        <button
          onClick={resetToIdle}
          className='rounded-2xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors'
        >
          New Plan
        </button>
      </div>
    )
  }

  const tp = plan.travelPlan
  const recommendedHotel = tp.hotels.find((h) => h.isRecommended) ?? tp.hotels[0]

  return (
    <div className='space-y-4'>
      {/* ── Sticky header ── */}
      <div className='rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white'>
        <div className='flex items-center justify-between gap-2 flex-wrap'>
          <span className='text-xl font-bold'>
            {tp.from.city} → {tp.to.city}
          </span>
          <button
            onClick={resetToIdle}
            className='rounded-xl border border-white/60 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors'
          >
            New Plan
          </button>
        </div>
        <div className='mt-2 flex flex-wrap gap-2 text-xs'>
          {[
            `${tp.duration} days`,
            `$${tp.totalEstimatedCost} USD / ${tp.totalEstimatedCost * 10} MAD`,
            `${tp.budgetMatch}% budget match`,
          ].map((chip) => (
            <span key={chip} className='rounded-full bg-white/20 px-3 py-1'>
              {chip}
            </span>
          ))}
        </div>
        <p className='mt-2 text-sm text-orange-100 italic'>{plan.answer}</p>
      </div>

      {/* ── Tab bar ── */}
      <div className='flex overflow-x-auto border-b border-zinc-200 bg-white scrollbar-hide rounded-t-xl'>
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            className={`whitespace-nowrap px-4 py-3 text-sm transition-colors cursor-pointer ${
              activeTab === idx
                ? 'border-b-2 border-orange-500 font-semibold text-orange-600'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className='space-y-4'>

        {/* TAB 0 — Overview */}
        {activeTab === 0 && (
          <div className='space-y-4'>
            {/* Answer card */}
            <div className='rounded-2xl bg-orange-50 border border-orange-100 p-4'>
              <div className='flex items-start gap-2'>
                <Sparkles className='h-4 w-4 text-orange-500 mt-0.5 shrink-0' />
                <div>
                  <p className='text-sm text-zinc-700'>{plan.answer}</p>
                  {plan.followUpQuestion && (
                    <p className='mt-2 text-sm italic text-zinc-500'>{plan.followUpQuestion}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
              {[
                { icon: '✈️', label: `${tp.flights.length} Flights` },
                { icon: '🏨', label: `${tp.hotels.length} Hotels` },
                { icon: '📅', label: `${tp.duration} Days` },
                { icon: '💰', label: `$${tp.totalEstimatedCost}` },
              ].map((stat) => (
                <div key={stat.label} className='rounded-2xl border border-zinc-200 bg-white p-3 text-center shadow-sm'>
                  <div className='text-lg'>{stat.icon}</div>
                  <div className='mt-1 text-xs font-medium text-zinc-700'>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Best flight */}
            {tp.flights.length > 0 && (() => {
              const bestFlight = tp.flights.find((f) => f.isBestValue) ?? tp.flights[0]
              return (
                <div className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Plane className='h-4 w-4 text-orange-500' />
                    <span className='font-semibold text-sm text-zinc-900'>Best Value Flight</span>
                  </div>
                  <p className='font-semibold text-zinc-900 text-sm'>{bestFlight.airline}</p>
                  <p className='text-xs text-zinc-500 mt-0.5'>
                    {bestFlight.from} → {bestFlight.to}
                  </p>
                  <div className='mt-2 flex items-center gap-2 text-xs text-zinc-500'>
                    <span className='font-mono'>{bestFlight.departure} → {bestFlight.arrival}</span>
                    <span className='rounded-full bg-zinc-100 px-2 py-0.5'>{bestFlight.duration}</span>
                    <span className={`rounded-full px-2 py-0.5 ${bestFlight.stops === 0 ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                      {bestFlight.stops === 0 ? 'Direct' : `${bestFlight.stops} stop`}
                    </span>
                  </div>
                  <p className='mt-2 text-lg font-bold text-orange-500'>${bestFlight.price}</p>
                </div>
              )
            })()}

            {/* Recommended hotel */}
            {recommendedHotel && (
              <div className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'>
                <div className='flex items-center gap-2 mb-3'>
                  <Hotel className='h-4 w-4 text-orange-500' />
                  <span className='font-semibold text-sm text-zinc-900'>Recommended Stay</span>
                </div>
                <p className='font-semibold text-zinc-900 text-sm'>{recommendedHotel.name}</p>
                <p className='text-amber-500 text-sm'>{'★'.repeat(recommendedHotel.stars)}</p>
                <p className='text-xs text-zinc-500 mt-0.5'>
                  ${recommendedHotel.pricePerNight}/night · Total: ${recommendedHotel.totalPrice}
                </p>
                <div className='mt-2 flex flex-wrap gap-1'>
                  {recommendedHotel.amenities.map((a) => (
                    <span key={a} className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600'>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1 — Flights */}
        {activeTab === 1 && (
          <div className='space-y-3'>
            {tp.flights.length === 0 ? (
              <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-400'>
                No flight options found
              </div>
            ) : (
              tp.flights.map((flight, idx) => (
                <div key={idx} className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'>
                  <div className='flex items-center justify-between flex-wrap gap-2'>
                    <span className='font-semibold text-zinc-900 text-sm'>{flight.airline}</span>
                    {flight.isBestValue && (
                      <span className='rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600'>
                        Best Value
                      </span>
                    )}
                  </div>
                  <p className='mt-0.5 text-xs text-zinc-500'>
                    {flight.from} → {flight.to}
                  </p>
                  <div className='mt-2 flex items-center gap-2 flex-wrap text-xs text-zinc-500'>
                    <span className='font-mono'>{flight.departure} → {flight.arrival}</span>
                    <span className='rounded-full bg-zinc-100 px-2 py-0.5'>{flight.duration}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        flight.stops === 0 ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
                    </span>
                  </div>
                  <div className='mt-3 flex items-center justify-between'>
                    <span className='text-xl font-bold text-orange-500'>${flight.price}</span>
                  </div>
                  <button
                    disabled
                    className='mt-3 w-full cursor-not-allowed rounded-xl border border-orange-500 py-2 text-sm text-orange-500 opacity-60'
                  >
                    Book Now
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2 — Hotels */}
        {activeTab === 2 && (
          <div className='space-y-3'>
            {tp.hotels.length === 0 ? (
              <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-400'>
                No hotel options found
              </div>
            ) : (
              tp.hotels.map((hotel, idx) => (
                <div key={idx} className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'>
                  <div className='flex items-start justify-between flex-wrap gap-2'>
                    <span className='font-semibold text-zinc-900 text-sm'>{hotel.name}</span>
                    {hotel.isRecommended && (
                      <span className='rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600'>
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className='text-amber-500 text-sm mt-0.5'>{'★'.repeat(hotel.stars)}</p>
                  <div className='mt-1 flex items-center gap-2 text-xs text-zinc-500'>
                    <span className='text-zinc-600'>{hotel.rating} ★</span>
                    <MapPin className='h-3 w-3' />
                    <span>{hotel.location}</span>
                  </div>
                  <div className='mt-2 flex flex-wrap gap-1'>
                    {hotel.amenities.map((a) => (
                      <span key={a} className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600'>
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className='mt-3'>
                    <span className='font-bold text-zinc-900 text-sm'>${hotel.pricePerNight}/night</span>
                    <p className='text-xs text-zinc-500 mt-0.5'>
                      Total: ${hotel.totalPrice} USD / {hotel.totalPrice * 10} MAD
                    </p>
                  </div>
                  <button
                    disabled
                    className='mt-3 w-full cursor-not-allowed rounded-xl border border-orange-500 py-2 text-sm text-orange-500 opacity-60'
                  >
                    Reserve
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3 — Itinerary */}
        {activeTab === 3 && (
          <div className='space-y-3'>
            {tp.itinerary.length === 0 ? (
              <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-400'>
                Itinerary will appear here
              </div>
            ) : (
              tp.itinerary.map((day) => {
                const isOpen = openDays.includes(day.day)
                return (
                  <div key={day.day} className='rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden'>
                    <button
                      onClick={() => toggleDay(day.day)}
                      className='flex w-full items-center justify-between p-4 text-left'
                    >
                      <div>
                        <span className='font-semibold text-zinc-900 text-sm'>
                          Day {day.day} — {day.theme}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 shrink-0'>
                        <span className='text-sm font-semibold text-orange-500'>${day.estimatedDailyCost}/day</span>
                        {isOpen ? (
                          <ChevronUp className='h-4 w-4 text-zinc-400' />
                        ) : (
                          <ChevronDown className='h-4 w-4 text-zinc-400' />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className='px-4 pb-4 space-y-2'>
                        {/* Morning */}
                        <div className='rounded-xl bg-yellow-50 p-3'>
                          <p className='text-xs font-semibold text-yellow-700 mb-1'>🌅 Morning</p>
                          <ul className='space-y-1'>
                            {day.morning.map((act, i) => (
                              <li key={i} className='text-xs text-zinc-700'>• {act}</li>
                            ))}
                          </ul>
                        </div>
                        {/* Afternoon */}
                        <div className='rounded-xl bg-orange-50 p-3'>
                          <p className='text-xs font-semibold text-orange-700 mb-1'>☀️ Afternoon</p>
                          <ul className='space-y-1'>
                            {day.afternoon.map((act, i) => (
                              <li key={i} className='text-xs text-zinc-700'>• {act}</li>
                            ))}
                          </ul>
                        </div>
                        {/* Evening */}
                        <div className='rounded-xl bg-indigo-50 p-3'>
                          <p className='text-xs font-semibold text-indigo-700 mb-1'>🌙 Evening</p>
                          <ul className='space-y-1'>
                            {day.evening.map((act, i) => (
                              <li key={i} className='text-xs text-zinc-700'>• {act}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* TAB 4 — Budget */}
        {activeTab === 4 && (
          <div className='space-y-4'>
            <h3 className='font-semibold text-zinc-900'>Budget Breakdown</h3>
            <div className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4'>
              {Object.entries(tp.budgetBreakdown).map(([key, value]) => (
                <div key={key}>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs font-medium text-zinc-700 capitalize'>{key}</span>
                    <span className='text-xs text-zinc-500'>
                      ${value} USD / {value * 10} MAD
                    </span>
                  </div>
                  <div className='w-full rounded-full bg-zinc-100 h-3 overflow-hidden'>
                    <div
                      className={`h-3 rounded-full ${BUDGET_COLORS[key] ?? 'bg-zinc-400'}`}
                      style={{ width: `${Math.min((value / tp.totalEstimatedCost) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total row */}
            <div className='flex items-center justify-between rounded-2xl bg-orange-50 p-3'>
              <span className='font-semibold text-zinc-900 text-sm'>Total Estimated</span>
              <span className='font-bold text-orange-600 text-sm'>
                ${tp.totalEstimatedCost} USD / {tp.totalEstimatedCost * 10} MAD
              </span>
            </div>

            {/* Budget status */}
            <div
              className={`rounded-2xl border p-3 text-sm font-medium ${
                tp.totalBudget >= tp.totalEstimatedCost
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {tp.totalBudget >= tp.totalEstimatedCost
                ? `✅ Under budget by $${tp.totalBudget - tp.totalEstimatedCost} USD`
                : `⚠️ Over budget by $${tp.totalEstimatedCost - tp.totalBudget} USD`}
            </div>
          </div>
        )}

        {/* TAB 5 — Tips & Packing */}
        {activeTab === 5 && (
          <div className='space-y-6'>
            {/* Tips */}
            <div>
              <h3 className='font-semibold text-zinc-900 mb-3'>Travel Tips 💡</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {tp.tips.map((tip, idx) => (
                  <div key={idx} className='flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm'>
                    <Lightbulb className='h-4 w-4 text-orange-500 shrink-0 mt-0.5' />
                    <p className='text-sm text-zinc-600'>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing list */}
            <div>
              <div className='flex items-center justify-between mb-2'>
                <h3 className='font-semibold text-zinc-900'>Packing List 🧳</h3>
                <span className='text-sm text-zinc-500'>
                  {checkedItems.length}/{tp.packingList.length} items packed
                </span>
              </div>
              <div className='w-full bg-zinc-100 rounded-full h-2 mb-4 overflow-hidden'>
                <div
                  className='h-2 bg-orange-500 rounded-full transition-all duration-300'
                  style={{
                    width: tp.packingList.length
                      ? `${(checkedItems.length / tp.packingList.length) * 100}%`
                      : '0%',
                  }}
                />
              </div>
              <div className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'>
                {tp.packingList.map((item) => {
                  const checked = checkedItems.includes(item)
                  return (
                    <div
                      key={item}
                      onClick={() => togglePacking(item)}
                      className='flex cursor-pointer items-center gap-3 border-b border-zinc-100 py-2 last:border-0'
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                          checked
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-zinc-300 bg-white'
                        }`}
                      >
                        {checked && <Check className='h-3 w-3 text-white' />}
                      </div>
                      <span
                        className={`text-sm ${checked ? 'line-through text-zinc-400' : 'text-zinc-700'}`}
                      >
                        {item}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

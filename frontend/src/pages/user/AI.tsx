import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plane,
  Hotel,
  MapPin,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Check,
  XCircle,
} from 'lucide-react';
import api from '@/lib/api';

type BookingSuggestion = {
  title: string;
  type: 'flight' | 'stay' | 'activity' | 'transport' | 'rental' | 'guide' | 'other';
  priceRange?: string;
  notes?: string;
};

type TravelPlan = {
  from: { city: string; country: string };
  to: { city: string; country: string };
  duration: number;
  totalBudget: number;
  totalEstimatedCost: number;
  budgetMatch: number;
  flights: FlightOption[];
  hotels: HotelOption[];
  itinerary: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  tips: string[];
  packingList: string[];
};

type FlightOption = {
  airline: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  isBestValue: boolean;
};

type HotelOption = {
  name: string;
  stars: number;
  pricePerNight: number;
  totalPrice: number;
  location: string;
  rating: number;
  amenities: string[];
  isRecommended: boolean;
};

type DayPlan = {
  day: number;
  theme: string;
  morning: string[];
  afternoon: string[];
  evening: string[];
  estimatedDailyCost: number;
};

type BudgetBreakdown = {
  flights: number;
  hotels: number;
  food: number;
  activities: number;
  transport: number;
  misc: number;
};

type HeroAgentResponse = {
  answer: string;
  intent?: 'booking' | 'information' | 'collaboration' | 'guide' | 'new_trip';
  followUpQuestion?: string;
  bookings: BookingSuggestion[];
  travelPlan?: TravelPlan;
};

const LOADING_TEXTS = [
  '✈️ Searching best flights...',
  '🏨 Finding riads in your budget...',
  '🗺️ Building your Morocco itinerary...',
  '💰 Calculating costs in USD & MAD...',
  '✅ Almost ready...',
];

export default function UserAI() {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'result' | 'error'>('idle');
  const [input, setInput] = useState('');
  const [plan, setPlan] = useState<HeroAgentResponse | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openDays, setOpenDays] = useState<number[]>([1]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    let textInterval: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (phase === 'loading') {
      setLoadingTextIndex(0);
      setProgressWidth(0);

      textInterval = setInterval(() => {
        setLoadingTextIndex((i) => (i + 1) % LOADING_TEXTS.length);
      }, 1200);

      progressTimer = setTimeout(() => {
        setProgressWidth(95);
      }, 50);
    }

    return () => {
      if (textInterval) clearInterval(textInterval);
      if (progressTimer) clearTimeout(progressTimer);
    };
  }, [phase]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setPhase('loading');
    try {
      const res = await api.post<HeroAgentResponse>('/agent/hero', { prompt: input });
      setPlan(res.data);
      setPhase('result');
      setActiveTab(0);
    } catch (e) {
      setErrorMsg('Something went wrong. Please try again.');
      setPhase('error');
    }
  };

  const handleToggleDay = (dayIndex: number) => {
    setOpenDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleToggleItem = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const resetToIdle = () => {
    setPhase('idle');
    setPlan(null);
    setInput('');
    setActiveTab(0);
    setOpenDays([1]);
    setCheckedItems([]);
  };

  if (phase === 'idle') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-zinc-900">
            <Sparkles className="h-8 w-8 text-orange-500" />
            AI Travel Planner 🇲🇦
          </h1>
          <p className="mt-2 text-zinc-500">
            Describe your trip to Morocco and get a complete personalized plan
          </p>
        </div>

        <div className="space-y-4 rounded-[20px] bg-white p-6 shadow-sm border border-zinc-200">
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 p-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-none"
            placeholder="E.g. I want to visit Marrakech for 5 days with a $1500 budget"
          />
          <div className="flex flex-wrap gap-2">
            {[
              '🕌 Fes medina $1500 7 days',
              '🏜️ Sahara Merzouga $2000 10 days',
              '🌊 Essaouira weekend $800 3 days',
              '🏔️ Atlas Imlil $1200 5 days',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => setInput(chip)}
                className="cursor-pointer rounded-full border border-zinc-200 px-3 py-2 text-xs text-zinc-600 transition-colors hover:border-orange-400 hover:text-orange-600"
              >
                {chip}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Plan My Morocco Trip →
            <Sparkles className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto mt-6 w-fit rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-400">
          🌍 International destinations coming soon
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto flex flex-col items-center justify-center py-20">
        <div className="text-lg font-medium text-zinc-700 animate-pulse">
          {LOADING_TEXTS[loadingTextIndex]}
        </div>
        <div className="h-2 w-full max-w-sm overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-orange-500"
            style={{
              width: `${progressWidth}%`,
              transition: 'width 4000ms linear',
            }}
          />
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto flex flex-col items-center justify-center py-20">
        <XCircle className="h-16 w-16 text-red-500" />
        <p className="text-zinc-700">{errorMsg}</p>
        <button
          onClick={resetToIdle}
          className="rounded-2xl bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!plan) return null;

  if (!plan.travelPlan) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="rounded-2xl bg-orange-50 p-6 border border-orange-100">
          <p className="text-orange-900">{plan.answer}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {plan.bookings.map((b, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{b.title}</h3>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs capitalize text-zinc-600">
                  {b.type}
                </span>
              </div>
              {b.priceRange && <p className="text-sm font-medium text-orange-600 mb-1">{b.priceRange}</p>}
              {b.notes && <p className="text-sm text-zinc-500">{b.notes}</p>}
            </div>
          ))}
        </div>
        <button
          onClick={resetToIdle}
          className="rounded-2xl bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600 transition-colors"
        >
          New Plan
        </button>
      </div>
    );
  }

  const { travelPlan } = plan;
  const TABS = ['Overview', 'Flights', 'Hotels', 'Itinerary', 'Budget', 'Tips & Packing'];

  const bestFlight = travelPlan.flights?.[0];
  const recommendedHotel =
    travelPlan.hotels?.find((h) => h.isRecommended) || travelPlan.hotels?.[0];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 mb-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {travelPlan.from.city} → {travelPlan.to.city}
          </h2>
          <button
            onClick={resetToIdle}
            className="rounded-xl border border-white px-3 py-1 text-sm font-medium text-white outline-none hover:bg-white/10 transition-colors"
          >
            New Plan
          </button>
        </div>
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/20 px-3 py-1">{travelPlan.duration} days</span>
          <span className="rounded-full bg-white/20 px-3 py-1">
            ${travelPlan.totalEstimatedCost} USD / {travelPlan.totalEstimatedCost * 10} MAD
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1">
            {travelPlan.budgetMatch}% budget match
          </span>
        </div>
        <p className="text-sm italic text-orange-100">{plan.answer}</p>
      </div>

      {/* Sticky Tab Bar */}
      <div className="sticky top-[140px] z-10 flex overflow-x-auto border-b border-zinc-200 bg-white scrollbar-hide">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            className={`cursor-pointer whitespace-nowrap px-4 py-3 text-sm transition-colors ${activeTab === idx
                ? 'border-b-2 border-orange-500 font-semibold text-orange-600'
                : 'text-zinc-500 hover:text-zinc-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 0 && (
          <div className="space-y-4">
            <div className="flex gap-2 rounded-2xl border border-orange-100 bg-orange-50 p-4 shadow-sm">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
              <div>
                <p className="text-sm text-orange-900">{plan.answer}</p>
                {plan.followUpQuestion && (
                  <p className="mt-2 text-sm italic text-zinc-500">{plan.followUpQuestion}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                ✈️ {travelPlan.flights?.length || 0} Flights
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                🏨 {travelPlan.hotels?.length || 0} Hotels
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                📅 {travelPlan.duration} Days
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-3 text-center shadow-sm">
                💰 ${travelPlan.totalEstimatedCost}
              </div>
            </div>

            {bestFlight && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold text-zinc-900">Best Value Flight</h3>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{bestFlight.airline}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {bestFlight.from} → {bestFlight.to}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-zinc-600 font-mono">
                        {bestFlight.departure} → {bestFlight.arrival}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
                        {bestFlight.stops === 0 ? 'Direct' : `${bestFlight.stops} stop`}
                      </span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-orange-500">
                    ${bestFlight.price}
                  </div>
                </div>
              </div>
            )}

            {recommendedHotel && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Hotel className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold text-zinc-900">Recommended Stay</h3>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-800">{recommendedHotel.name}</h4>
                    <p className="mt-1 text-sm text-amber-500">
                      {'★'.repeat(recommendedHotel.stars)}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      ${recommendedHotel.pricePerNight}/night
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {recommendedHotel.amenities.slice(0, 3).map((am, i) => (
                        <span key={i} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600">
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-500">Total: ${recommendedHotel.totalPrice}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-3">
            {!travelPlan.flights?.length ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                No options found
              </div>
            ) : (
              travelPlan.flights.map((flight, i) => (
                <div key={i} className="mb-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="font-bold text-zinc-900">{flight.airline}</div>
                    {flight.isBestValue && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                        Best Value
                      </span>
                    )}
                  </div>
                  <div className="mb-3 text-sm text-zinc-500">
                    {flight.from} → {flight.to}
                  </div>
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                    <div className="font-mono text-sm text-zinc-700">
                      {flight.departure} → {flight.arrival}
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-zinc-200 px-2 py-1 text-xs text-zinc-700">
                        {flight.duration}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${flight.stops === 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-zinc-200 text-zinc-700'
                          }`}
                      >
                        {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-500">${flight.price}</span>
                    <button
                      disabled
                      className="mt-3 w-1/2 cursor-not-allowed rounded-xl border border-orange-500 py-2 text-sm font-medium text-orange-500 opacity-60 transition-colors hover:bg-orange-50"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-3">
            {!travelPlan.hotels?.length ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                No options found
              </div>
            ) : (
              travelPlan.hotels.map((hotel, i) => (
                <div key={i} className="mb-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="mb-1 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-zinc-900">{hotel.name}</h3>
                    {hotel.isRecommended && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm tracking-widest text-amber-500">
                      {'★'.repeat(hotel.stars)}
                    </span>
                    <span className="text-xs text-zinc-500">{hotel.rating} ★</span>
                  </div>
                  <div className="mb-3 flex items-center gap-1 text-sm text-zinc-600">
                    <MapPin className="h-4 w-4" />
                    {hotel.location}
                  </div>
                  <div className="mb-4 flex flex-wrap gap-1">
                    {hotel.amenities?.map((am, j) => (
                      <span
                        key={j}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-end justify-between border-t border-zinc-100 pt-3">
                    <div>
                      <div className="text-lg font-bold text-zinc-900">
                        ${hotel.pricePerNight}
                        <span className="text-sm font-normal text-zinc-500">/night</span>
                      </div>
                      <div className="mt-0.5 text-sm text-zinc-500">
                        Total: ${hotel.totalPrice} USD / {hotel.totalPrice * 10} MAD
                      </div>
                    </div>
                    <button
                      disabled
                      className="w-32 cursor-not-allowed rounded-xl border border-orange-500 py-2 text-sm font-medium text-orange-500 opacity-60 transition-colors hover:bg-orange-50"
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="space-y-4">
            {!travelPlan.itinerary?.length ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                Itinerary will appear here
              </div>
            ) : (
              travelPlan.itinerary.map((day, i) => {
                const isOpen = openDays.includes(day.day);
                return (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
                  >
                    <div
                      onClick={() => handleToggleDay(day.day)}
                      className="flex w-full cursor-pointer items-center justify-between bg-white p-4 transition-colors hover:bg-zinc-50"
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-zinc-900">
                          Day {day.day} — {day.theme}
                        </span>
                        <span className="text-sm font-medium text-orange-500">
                          ${day.estimatedDailyCost}/day
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="text-zinc-400" />
                      ) : (
                        <ChevronDown className="text-zinc-400" />
                      )}
                    </div>

                    {isOpen && (
                      <div className="space-y-3 p-4 pt-0">
                        {day.morning?.length > 0 && (
                          <div className="mb-2 rounded-xl bg-yellow-50 p-3">
                            <h4 className="mb-1 text-xs font-semibold text-yellow-700">🌅 Morning</h4>
                            <ul className="space-y-1 text-sm text-zinc-700">
                              {day.morning.map((act, j) => (
                                <li key={j} className="flex items-start">
                                  <span className="mr-2 mt-0.5 text-yellow-500">•</span>
                                  {act}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {day.afternoon?.length > 0 && (
                          <div className="mb-2 rounded-xl bg-orange-50 p-3">
                            <h4 className="mb-1 text-xs font-semibold text-orange-700">☀️ Afternoon</h4>
                            <ul className="space-y-1 text-sm text-zinc-700">
                              {day.afternoon.map((act, j) => (
                                <li key={j} className="flex items-start">
                                  <span className="mr-2 mt-0.5 text-orange-500">•</span>
                                  {act}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {day.evening?.length > 0 && (
                          <div className="rounded-xl bg-indigo-50 p-3">
                            <h4 className="mb-1 text-xs font-semibold text-indigo-700">🌙 Evening</h4>
                            <ul className="space-y-1 text-sm text-zinc-700">
                              {day.evening.map((act, j) => (
                                <li key={j} className="flex items-start">
                                  <span className="mr-2 mt-0.5 text-indigo-500">•</span>
                                  {act}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 4 && (
          <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900">Budget Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(travelPlan.budgetBreakdown || {}).map(([key, value]) => {
                const colors: Record<string, string> = {
                  flights: 'bg-blue-400',
                  hotels: 'bg-green-400',
                  food: 'bg-orange-400',
                  activities: 'bg-purple-400',
                  transport: 'bg-red-400',
                  misc: 'bg-gray-400',
                };
                const bgClass = colors[key] || 'bg-gray-400';
                const percent =
                  travelPlan.totalEstimatedCost > 0
                    ? (value / travelPlan.totalEstimatedCost) * 100
                    : 0;

                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium capitalize text-zinc-700">{key}</span>
                      <span className="text-sm text-zinc-600">
                        ${value} USD / {value * 10} MAD
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className={`h-full rounded-full transition-all ${bgClass}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <span className="font-semibold text-orange-900">Total Estimated</span>
              <span className="font-bold text-orange-600">
                ${travelPlan.totalEstimatedCost} USD / {travelPlan.totalEstimatedCost * 10} MAD
              </span>
            </div>

            <div
              className={`rounded-xl border p-4 text-center text-sm font-medium ${travelPlan.totalBudget >= travelPlan.totalEstimatedCost
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
                }`}
            >
              {travelPlan.totalBudget >= travelPlan.totalEstimatedCost
                ? `✅ Under budget by $${travelPlan.totalBudget - travelPlan.totalEstimatedCost} USD`
                : `⚠️ Over budget by $${travelPlan.totalEstimatedCost - travelPlan.totalBudget} USD`}
            </div>
          </div>
        )}

        {activeTab === 5 && (
          <div className="space-y-8">
            <section>
              <h3 className="mb-4 text-lg font-bold text-zinc-900">Travel Tips 💡</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {travelPlan.tips?.map((tip, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-colors hover:border-orange-200"
                  >
                    <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                    <p className="text-sm leading-relaxed text-zinc-600">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900">Packing List</h3>
                <span className="text-sm font-medium text-zinc-500">
                  {checkedItems.length}/{travelPlan.packingList?.length || 0} items packed
                </span>
              </div>

              <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full bg-orange-500 transition-all"
                  style={{
                    width: `${(checkedItems.length / (travelPlan.packingList?.length || 1)) * 100
                      }%`,
                  }}
                />
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
                {travelPlan.packingList?.map((item, i) => {
                  const isChecked = checkedItems.includes(item);
                  return (
                    <div
                      key={i}
                      onClick={() => handleToggleItem(item)}
                      className="flex cursor-pointer items-center gap-3 border-b border-zinc-100 px-2 py-3 transition-colors last:border-0 hover:bg-zinc-50"
                    >
                      <div
                        className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${isChecked ? 'border-orange-500 bg-orange-500' : 'border-zinc-300'
                          }`}
                      >
                        {isChecked && (
                          <Check className="absolute h-3.5 w-3.5 text-white" strokeWidth={3} />
                        )}
                      </div>
                      <span
                        className={`text-sm ${isChecked ? 'text-zinc-400 line-through' : 'text-zinc-700'
                          }`}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

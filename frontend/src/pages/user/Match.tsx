import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import api from '@/lib/api'
import SwipeDeck from '@/features/match/components/SwipeDeck'
import MatchSummary from '@/features/match/components/MatchSummary'
import MatchDeckSkeleton from '@/features/match/components/MatchDeckSkeleton'
import { MOCK_TRIP_SWIPE_DATA } from '@/data/mockTripSwipeData'
import { getActiveFilterChips, getMatchedTrips } from '@/features/match/utils/matchScoring'
import { mapTripsResponseToSwipeItems } from '@/features/match/utils/mapTripApi'
import { matchesTripSearch } from '@/features/match/utils/searchNormalize'
import type { HeroPromptContext, MatchSessionResult, TripSwipeItem } from '@/types/match'

function getPromptContext(): HeroPromptContext | null {
  try {
    const raw = sessionStorage.getItem('heroPromptContext')
    return raw ? (JSON.parse(raw) as HeroPromptContext) : null
  } catch {
    return null
  }
}

export default function UserMatch() {
  const context = useMemo(() => getPromptContext(), [])
  const [strictFilters, setStrictFilters] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [result, setResult] = useState<MatchSessionResult | null>(null)
  const [restartSeed, setRestartSeed] = useState(0)
  const [trips, setTrips] = useState<TripSwipeItem[]>([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(true)
  const [tripsError, setTripsError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadTrips() {
      setIsLoadingTrips(true)
      setTripsError(null)

      try {
        const res = await api.get('/trips')
        const mapped = mapTripsResponseToSwipeItems(res.data)

        if (!mounted) return
        setTrips(mapped)
      } catch {
        if (!mounted) return
        setTrips(MOCK_TRIP_SWIPE_DATA)
        setTripsError('Unable to load trips from API. Showing fallback suggestions.')
      } finally {
        if (mounted) setIsLoadingTrips(false)
      }
    }

    loadTrips()
    return () => {
      mounted = false
    }
  }, [])

  const baseTrips = useMemo(
    () => getMatchedTrips(trips, context, strictFilters),
    [context, strictFilters, trips],
  )

  const searchedTrips = useMemo(() => {
    if (!appliedSearch.trim()) return baseTrips
    const filtered = baseTrips.filter((trip) => matchesTripSearch(trip, appliedSearch))
    return filtered.length ? filtered : baseTrips
  }, [appliedSearch, baseTrips])

  const activeFilterChips = useMemo(() => getActiveFilterChips(context), [context])
  const isApiEmptyState = !isLoadingTrips && trips.length === 0

  useEffect(() => {
    setResult(null)
  }, [searchedTrips, strictFilters])

  const handleSearchApply = () => setAppliedSearch(searchValue)
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSearchApply()
  }
  const clearSearch = () => {
    setSearchValue('')
    setAppliedSearch('')
  }

  const restartMatches = () => {
    setResult(null)
    setRestartSeed((prev) => prev + 1)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">Match Trips</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Search something like <span className="font-medium text-zinc-700">beach in Agadir</span> or{' '}
            <span className="font-medium text-zinc-700">culture in Fez</span>.
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search: city break in Tangier, adventure in Merzouga..."
              className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300 focus:bg-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearchApply}
              className="inline-flex h-11 items-center justify-center rounded-full bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Search
            </button>

            <button
              onClick={clearSearch}
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[22px] border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-[11px] font-semibold text-orange-600">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {strictFilters ? 'Using your preferences' : 'Showing all suggestions'}
          </span>

          {activeFilterChips.map((chip) => (
            <span key={chip} className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-600">
              {chip}
            </span>
          ))}

          {appliedSearch && (
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-medium text-white">
              Search: {appliedSearch}
            </span>
          )}
        </div>

        <button
          onClick={() => setStrictFilters((prev) => !prev)}
          className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          {strictFilters ? 'Remove filters' : 'Use my filters again'}
        </button>
      </div>

      {tripsError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {tripsError}
        </div>
      )}

      {isLoadingTrips ? (
        <MatchDeckSkeleton />
      ) : isApiEmptyState ? (
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-8 text-center">
          <p className="text-sm font-medium text-zinc-800">No trip suggestions available yet.</p>
          <p className="mt-1 text-sm text-zinc-500">Try again later or adjust your filters when trips are available.</p>
        </div>
      ) : result ? (
        <MatchSummary result={result} onRestart={restartMatches} />
      ) : (
        <SwipeDeck key={restartSeed} items={searchedTrips} onComplete={setResult} />
      )}
    </div>
  )
}

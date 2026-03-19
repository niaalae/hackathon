import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Flame, Heart, Sparkles, Undo2, X } from 'lucide-react'
import SwipeCard, { type SwipeRequest } from '@/features/match/components/SwipeCard'
import type { MatchSessionResult, SwipeDecision, SwipeDirection, TripSwipeItem } from '@/types/match'
import { usePrefersReducedMotion } from '@/features/match/utils/usePrefersReducedMotion'

type SwipeDeckProps = {
  items: TripSwipeItem[]
  onComplete: (result: MatchSessionResult) => void
}

const SWIPE_ADVANCE_DELAY_MS = 170

type DecisionEntry = SwipeDecision & {
  snapshot: {
    deck: TripSwipeItem[]
    index: number
    liked: TripSwipeItem[]
    skipped: TripSwipeItem[]
    round: number
  }
}

export default function SwipeDeck({ items, onComplete }: SwipeDeckProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [round, setRound] = useState(1)
  const [deck, setDeck] = useState<TripSwipeItem[]>(items)
  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState<TripSwipeItem[]>([])
  const [skipped, setSkipped] = useState<TripSwipeItem[]>([])
  const [decisions, setDecisions] = useState<DecisionEntry[]>([])
  const [swipeRequest, setSwipeRequest] = useState<SwipeRequest | null>(null)
  const [interactionLocked, setInteractionLocked] = useState(false)

  const completedRef = useRef(false)
  const timeoutRef = useRef<number | null>(null)
  const requestCounterRef = useRef(0)

  const current = deck[index]
  const next = deck[index + 1]

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setDeck(items)
    setIndex(0)
    setLiked([])
    setSkipped([])
    setRound(1)
    setDecisions([])
    setSwipeRequest(null)
    setInteractionLocked(false)
    completedRef.current = false
  }, [items])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const progress = useMemo(() => {
    if (!deck.length) return 100
    return Math.min(((index + 1) / deck.length) * 100, 100)
  }, [deck.length, index])

  const startNextRoundOrFinish = (nextLiked: TripSwipeItem[]) => {
    if (nextLiked.length > 1) {
      setDeck(nextLiked)
      setLiked([])
      setIndex(0)
      setRound((prev) => prev + 1)
      return
    }

    setDeck(nextLiked.length ? nextLiked : [])
    setLiked(nextLiked)
    setIndex(0)
  }

  const processDecision = useCallback((direction: SwipeDirection) => {
    if (!current || interactionLocked) return

    const decision: DecisionEntry = {
      tripId: current.id,
      direction,
      timestamp: Date.now(),
      snapshot: {
        deck: [...deck],
        index,
        liked: [...liked],
        skipped: [...skipped],
        round,
      },
    }

    setDecisions((prev) => [...prev, decision])

    const nextLiked = direction === 'right' ? [...liked, current] : liked
    const nextSkipped = direction === 'left' ? [...skipped, current] : skipped
    const isLastCard = index >= deck.length - 1

    if (direction === 'right') setLiked(nextLiked)
    if (direction === 'left') setSkipped(nextSkipped)

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setInteractionLocked(true)

    if (isLastCard) {
      timeoutRef.current = window.setTimeout(() => {
        startNextRoundOrFinish(nextLiked)
        setInteractionLocked(false)
        timeoutRef.current = null
      }, SWIPE_ADVANCE_DELAY_MS)
      return
    }

    timeoutRef.current = window.setTimeout(() => {
      setIndex((prev) => prev + 1)
      setInteractionLocked(false)
      timeoutRef.current = null
    }, SWIPE_ADVANCE_DELAY_MS)
  }, [current, deck, index, interactionLocked, liked, round, skipped])

  const queueButtonSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (!current) return
      requestCounterRef.current += 1
      setSwipeRequest({ id: requestCounterRef.current, direction })
    },
    [current],
  )

  const handleRewind = () => {
    if (!decisions.length) return

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const lastDecision = decisions[decisions.length - 1]
    const snapshot = lastDecision.snapshot

    setDeck(snapshot.deck)
    setIndex(snapshot.index)
    setLiked(snapshot.liked)
    setSkipped(snapshot.skipped)
    setRound(snapshot.round)
    setSwipeRequest(null)
    setInteractionLocked(false)
    completedRef.current = false
    setDecisions((prev) => prev.slice(0, -1))
  }

  const isFinished = !current && (liked.length > 0 || deck.length <= 1)

  useEffect(() => {
    if (!isFinished || completedRef.current) return
    completedRef.current = true

    const finalPool = liked.length ? liked : deck
    const topPicks = finalPool.slice(0, 3)

    onComplete({
      likedTrips: finalPool,
      skippedTrips: skipped,
      topPicks,
      totalSwiped: decisions.length,
      decisions: decisions.map(({ tripId, direction, timestamp }) => ({ tripId, direction, timestamp })),
    })
  }, [deck, decisions, isFinished, liked, onComplete, skipped])

  if (!current) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
        No more trips to match right now.
      </div>
    )
  }

  return (
    <>
      <div className="rounded-full bg-zinc-100">
        <div
          className={`h-2 rounded-full bg-orange-500 ${prefersReducedMotion ? '' : 'transition-transform duration-300 ease-out'}`}
          style={{ transform: `scaleX(${progress / 100})`, transformOrigin: 'left center', willChange: 'transform' }}
        />
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-orange-500" />
          <span>Round {round}</span>
        </div>
        <div>
          Suggestions: <span className="font-semibold text-zinc-900">{deck.length}</span>
        </div>
      </div>

      <div className="relative mx-auto h-[430px] max-w-[310px] sm:h-[450px] sm:max-w-[320px]">
        {next && (
          <>
            <div
              className={`absolute inset-x-4 top-4 h-full rounded-[24px] bg-zinc-100 ${prefersReducedMotion ? '' : 'transition-opacity duration-300'}`}
              style={{ opacity: 0.62 }}
            />
            <div
              className={`absolute inset-x-2 top-2 h-full rounded-[24px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] ${prefersReducedMotion ? '' : 'transition-opacity duration-300'}`}
              style={{ opacity: 0.82 }}
            />
          </>
        )}

        <SwipeCard
          trip={current}
          onSwipe={processDecision}
          swipeRequest={swipeRequest}
        />
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleRewind}
          disabled={decisions.length === 0 || interactionLocked}
          aria-label="Rewind last swipe"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-md active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
        >
          <Undo2 className="h-5 w-5" />
        </button>

        <button
          onClick={() => queueButtonSwipe('left')}
          disabled={interactionLocked || !current}
          aria-label="Skip trip"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
        >
          <X className="h-5 w-5" />
        </button>

        <button
          onClick={() => queueButtonSwipe('right')}
          disabled={interactionLocked || !current}
          aria-label="Like trip"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_14px_28px_rgba(249,115,22,0.32)] transition duration-150 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_18px_34px_rgba(249,115,22,0.36)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[0_14px_28px_rgba(249,115,22,0.32)]"
        >
          <Heart className="h-6 w-6" />
        </button>

        <button
          onClick={() => queueButtonSwipe('right')}
          disabled={interactionLocked || !current}
          aria-label="Super like trip"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-md active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
        >
          <Flame className="h-5 w-5" />
        </button>
      </div>
    </>
  )
}

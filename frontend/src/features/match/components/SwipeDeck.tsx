import { useEffect, useMemo, useRef, useState } from 'react'
import { Flame, Heart, Sparkles, X } from 'lucide-react'
import SwipeCard from '@/features/match/components/SwipeCard'
import type { MatchSessionResult, SwipeDecision, SwipeDirection, TripSwipeItem } from '@/types/match'

type SwipeDeckProps = {
  items: TripSwipeItem[]
  onComplete: (result: MatchSessionResult) => void
}

export default function SwipeDeck({ items, onComplete }: SwipeDeckProps) {
  const [round, setRound] = useState(1)
  const [deck, setDeck] = useState<TripSwipeItem[]>(items)
  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState<TripSwipeItem[]>([])
  const [decisions, setDecisions] = useState<SwipeDecision[]>([])
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [swipeDir, setSwipeDir] = useState<SwipeDirection | null>(null)

  const startRef = useRef<{ x: number; y: number } | null>(null)
  const completedRef = useRef(false)

  const current = deck[index]
  const next = deck[index + 1]

  useEffect(() => {
    setDeck(items)
    setIndex(0)
    setLiked([])
    setRound(1)
    setDecisions([])
    setDrag({ x: 0, y: 0 })
    setSwipeDir(null)
    completedRef.current = false
  }, [items])

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
      setDrag({ x: 0, y: 0 })
      setSwipeDir(null)
      return
    }

    setDeck(nextLiked.length ? nextLiked : [])
    setLiked(nextLiked)
    setIndex(0)
    setDrag({ x: 0, y: 0 })
    setSwipeDir(null)
  }

  const processDecision = (direction: SwipeDirection) => {
    if (!current) return

    const decision: SwipeDecision = {
      tripId: current.id,
      direction,
      timestamp: Date.now(),
    }

    setDecisions((prev) => [...prev, decision])

    const nextLiked = direction === 'right' ? [...liked, current] : liked
    const isLastCard = index >= deck.length - 1

    if (direction === 'right') setLiked(nextLiked)

    if (isLastCard) {
      window.setTimeout(() => {
        startNextRoundOrFinish(nextLiked)
      }, 220)
      return
    }

    window.setTimeout(() => {
      setIndex((prev) => prev + 1)
      setDrag({ x: 0, y: 0 })
      setSwipeDir(null)
    }, 220)
  }

  const commitSwipe = (direction: SwipeDirection) => {
    setSwipeDir(direction)
    processDecision(direction)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!current) return
    setIsDragging(true)
    startRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !startRef.current) return
    const dx = event.clientX - startRef.current.x
    const dy = event.clientY - startRef.current.y
    setDrag({ x: dx, y: dy * 0.3 })
  }

  const resetDrag = () => {
    setDrag({ x: 0, y: 0 })
    setIsDragging(false)
    startRef.current = null
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    if (Math.abs(drag.x) > 95) {
      setIsDragging(false)
      startRef.current = null
      commitSwipe(drag.x > 0 ? 'right' : 'left')
    } else {
      resetDrag()
    }
  }

  const isFinished = !current && (liked.length > 0 || deck.length <= 1)

  useEffect(() => {
    if (!isFinished || completedRef.current) return
    completedRef.current = true

    const finalPool = liked.length ? liked : deck
    const topPicks = finalPool.slice(0, 3)

    onComplete({
      likedTrips: finalPool,
      topPicks,
      totalSwiped: decisions.length,
      decisions,
    })
  }, [deck, decisions, isFinished, liked, onComplete])

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
        <div className="h-2 rounded-full bg-orange-500 transition-all duration-300" style={{ width: `${progress}%` }} />
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
            <div className="absolute inset-x-4 top-4 h-full rounded-[24px] bg-zinc-100" />
            <div className="absolute inset-x-2 top-2 h-full rounded-[24px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]" />
          </>
        )}

        <SwipeCard
          trip={current}
          dragX={drag.x}
          dragY={drag.y}
          isDragging={isDragging}
          swipeDir={swipeDir}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => commitSwipe('left')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 shadow-sm transition hover:bg-red-100"
        >
          <X className="h-5 w-5" />
        </button>

        <button
          onClick={() => commitSwipe('right')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_14px_28px_rgba(249,115,22,0.32)] transition hover:scale-[1.03]"
        >
          <Heart className="h-6 w-6" />
        </button>

        <button
          onClick={() => commitSwipe('right')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm transition hover:bg-emerald-100"
        >
          <Flame className="h-5 w-5" />
        </button>
      </div>
    </>
  )
}


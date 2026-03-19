import { memo, useEffect, useRef, useState } from 'react'
import { MapPin, Star, Wallet, Wifi } from 'lucide-react'
import type { SwipeDirection, TripSwipeItem } from '@/types/match'

export type SwipeRequest = {
  id: number
  direction: SwipeDirection
}

type SwipeCardProps = {
  trip: TripSwipeItem
  onSwipe: (direction: SwipeDirection) => void
  swipeRequest: SwipeRequest | null
}

type GestureAxis = 'undecided' | 'horizontal' | 'vertical'

type GestureThresholds = {
  intentThresholdPx: number
  axisRatio: number
  swipeTriggerPx: number
}

const SWIPE_MOTION = {
  swipeDistancePx: 520,
  swipeRotateDeg: 14,
  dragRotateDivisor: 24,
  springTransition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
  fadeTransition: 'opacity 220ms ease',
  scaleTransition: 'scale 280ms cubic-bezier(0.22, 1, 0.36, 1)',
} as const

const GESTURE_THRESHOLD_BY_POINTER: Record<string, GestureThresholds> = {
  touch: {
    intentThresholdPx: 14,
    axisRatio: 1.28,
    swipeTriggerPx: 104,
  },
  mouse: {
    intentThresholdPx: 10,
    axisRatio: 1.14,
    swipeTriggerPx: 92,
  },
  pen: {
    intentThresholdPx: 12,
    axisRatio: 1.2,
    swipeTriggerPx: 96,
  },
  default: {
    intentThresholdPx: 12,
    axisRatio: 1.2,
    swipeTriggerPx: 96,
  },
}

function getGestureThresholds(pointerType: string | null) {
  if (!pointerType) return GESTURE_THRESHOLD_BY_POINTER.default
  return GESTURE_THRESHOLD_BY_POINTER[pointerType] ?? GESTURE_THRESHOLD_BY_POINTER.default
}

function truncateDescription(text: string, maxLength = 100) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}...`
}

function SwipeCard({ trip, onSwipe, swipeRequest }: SwipeCardProps) {
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [swipeDir, setSwipeDir] = useState<SwipeDirection | null>(null)
  const [gestureAxis, setGestureAxis] = useState<GestureAxis>('undecided')
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const pointerIdRef = useRef<number | null>(null)
  const pointerTypeRef = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setDrag({ x: 0, y: 0 })
    setIsDragging(false)
    setSwipeDir(null)
    setGestureAxis('undecided')
    startRef.current = null
    pointerIdRef.current = null
    pointerTypeRef.current = null
  }, [trip.id])

  useEffect(() => {
    if (!swipeRequest || isDragging || swipeDir) return
    setSwipeDir(swipeRequest.direction)
    onSwipe(swipeRequest.direction)
  }, [isDragging, onSwipe, swipeDir, swipeRequest])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipeDir) return
    setIsDragging(true)
    setGestureAxis('undecided')
    startRef.current = { x: event.clientX, y: event.clientY }
    pointerIdRef.current = event.pointerId
    pointerTypeRef.current = event.pointerType || null
    containerRef.current = event.currentTarget
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !startRef.current) return
    const dx = event.clientX - startRef.current.x
    const dy = event.clientY - startRef.current.y
    const thresholds = getGestureThresholds(pointerTypeRef.current)

    if (gestureAxis === 'undecided') {
      const absX = Math.abs(dx)
      const absY = Math.abs(dy)

      if (absX < thresholds.intentThresholdPx && absY < thresholds.intentThresholdPx) return

      if (absX > absY * thresholds.axisRatio) {
        setGestureAxis('horizontal')

        if (pointerIdRef.current !== null && containerRef.current) {
          containerRef.current.setPointerCapture(pointerIdRef.current)
        }
      } else if (absY > absX * thresholds.axisRatio) {
        setGestureAxis('vertical')
        return
      } else {
        return
      }
    }

    if (gestureAxis === 'vertical') return
    setDrag({ x: dx, y: dy * 0.3 })
  }

  const resetDrag = () => {
    setDrag({ x: 0, y: 0 })
    setIsDragging(false)
    setGestureAxis('undecided')
    startRef.current = null
    pointerIdRef.current = null
    pointerTypeRef.current = null
  }

  const handlePointerUp = () => {
    if (!isDragging) return

    if (gestureAxis !== 'horizontal') {
      resetDrag()
      return
    }

    const thresholds = getGestureThresholds(pointerTypeRef.current)

    if (Math.abs(drag.x) > thresholds.swipeTriggerPx) {
      setIsDragging(false)
      setGestureAxis('undecided')
      startRef.current = null
      pointerIdRef.current = null
      pointerTypeRef.current = null
      const direction: SwipeDirection = drag.x > 0 ? 'right' : 'left'
      setSwipeDir(direction)
      onSwipe(direction)
    } else {
      resetDrag()
    }
  }

  const dragX = drag.x
  const dragY = drag.y
  const dragStrength = Math.min(Math.abs(dragX) / 220, 1)
  const overlayOpacity = Math.min(Math.abs(dragX) / 120, 1)
  const showRejectOverlay = dragX < -30
  const showChooseOverlay = dragX > 30
  const cardOpacity = swipeDir ? 0 : 1 - dragStrength * 0.08
  const cardScale = swipeDir ? 0.98 : isDragging ? 1 - dragStrength * 0.015 : 1

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
      style={{
        transform: swipeDir
          ? `translateX(${swipeDir === 'right' ? SWIPE_MOTION.swipeDistancePx : -SWIPE_MOTION.swipeDistancePx}px) rotate(${swipeDir === 'right' ? SWIPE_MOTION.swipeRotateDeg : -SWIPE_MOTION.swipeRotateDeg}deg) scale(${cardScale})`
          : `translate3d(${dragX}px, ${dragY}px, 0) rotate(${dragX / SWIPE_MOTION.dragRotateDivisor}deg) scale(${cardScale})`,
        opacity: cardOpacity,
        transition: isDragging
          ? 'none'
          : `${SWIPE_MOTION.springTransition}, ${SWIPE_MOTION.fadeTransition}, ${SWIPE_MOTION.scaleTransition}`,
        touchAction: 'pan-y',
        willChange: 'transform, opacity',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="relative h-[46%]">
        <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold text-zinc-700">
          {trip.city}
        </div>

        <div className="absolute right-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold text-white">
          {trip.tripType}
        </div>

        {showRejectOverlay && (
          <div
            className="absolute left-3 top-14 rounded-xl border-2 border-red-500 bg-white/90 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-red-500"
            style={{ opacity: overlayOpacity }}
          >
            Pass
          </div>
        )}

        {showChooseOverlay && (
          <div
            className="absolute right-3 top-14 rounded-xl border-2 border-emerald-500 bg-white/90 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-600"
            style={{ opacity: overlayOpacity }}
          >
            Choose
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold leading-tight text-zinc-900">{trip.title}</h3>
            <p className="mt-1 text-sm text-zinc-500">{truncateDescription(trip.description)}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Star className="h-3.5 w-3.5 fill-current" />
            {trip.rating.toFixed(1)}
          </div>
        </div>

        <div className="grid gap-2 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-zinc-400" />
            {trip.city}, {trip.country}
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-zinc-400" />
            {trip.budget}
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-zinc-400" />
            {trip.wifi ? 'Wi-Fi available' : 'No Wi-Fi'}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {trip.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-medium text-orange-600">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(SwipeCard)

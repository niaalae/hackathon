import { MapPin, Star, Wallet, Wifi } from 'lucide-react'
import type { SwipeDirection, TripSwipeItem } from '@/types/match'

type SwipeCardProps = {
  trip: TripSwipeItem
  dragX: number
  dragY: number
  isDragging: boolean
  swipeDir: SwipeDirection | null
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void
  onPointerUp: () => void
}

function truncateDescription(text: string, maxLength = 100) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}...`
}

export default function SwipeCard({
  trip,
  dragX,
  dragY,
  isDragging,
  swipeDir,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: SwipeCardProps) {
  const overlayOpacity = Math.min(Math.abs(dragX) / 120, 1)
  const showRejectOverlay = dragX < -30
  const showChooseOverlay = dragX > 30

  return (
    <div
      className="relative h-full overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
      style={{
        transform: swipeDir
          ? `translateX(${swipeDir === 'right' ? 520 : -520}px) rotate(${swipeDir === 'right' ? 14 : -14}deg)`
          : `translate3d(${dragX}px, ${dragY}px, 0) rotate(${dragX / 24}deg)`,
        transition: isDragging ? 'none' : 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        touchAction: 'pan-y',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
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


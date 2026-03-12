import { useMemo, useRef, useState } from 'react'
import { Flame, Heart, X, Users, Calendar, MapPin, Sparkles } from 'lucide-react'

const trips = [
  {
    id: '1',
    name: 'Fes Medina Discovery',
    destination: 'Fes, Morocco',
    image: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?w=1200&auto=format&fit=crop&q=60',
    dates: 'Mar 15 - Mar 18, 2025',
    groupSize: 4,
    vibe: ['Culture', 'Food', 'Medina'],
  },
  {
    id: '2',
    name: 'Meknes Heritage Weekend',
    destination: 'Meknes, Morocco',
    image: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=1200&auto=format&fit=crop&q=60',
    dates: 'Apr 05 - Apr 07, 2025',
    groupSize: 3,
    vibe: ['History', 'Markets', 'Riads'],
  },
  {
    id: '3',
    name: 'Ifrane Nature Escape',
    destination: 'Ifrane, Morocco',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1200&auto=format&fit=crop&q=60',
    dates: 'May 10 - May 12, 2025',
    groupSize: 5,
    vibe: ['Nature', 'Hikes', 'Fresh Air'],
  },
]

export default function UserMatch() {
  const [index, setIndex] = useState(0)
  const current = trips[index]
  const next = trips[index + 1]
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)

  const progress = useMemo(() => Math.min(((index + 1) / trips.length) * 100, 100), [index])

  const handleAction = () => {
    setIndex((prev) => Math.min(prev + 1, trips.length))
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
    setDrag({ x: dx, y: dy })
  }

  const resetDrag = () => {
    setDrag({ x: 0, y: 0 })
    setIsDragging(false)
    startRef.current = null
  }

  const commitSwipe = (direction: 'left' | 'right') => {
    setSwipeDir(direction)
    setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, trips.length))
      setSwipeDir(null)
      setDrag({ x: 0, y: 0 })
    }, 220)
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    if (Math.abs(drag.x) > 90) {
      setIsDragging(false)
      startRef.current = null
      commitSwipe(drag.x > 0 ? 'right' : 'left')
    } else {
      resetDrag()
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold text-zinc-900'>Match Trips</h2>
        <p className='text-sm text-zinc-500'>Swipe through group trips and find your best fit.</p>
      </div>

      <div className='rounded-full bg-zinc-100'>
        <div className='h-2 rounded-full bg-orange-500' style={{ width: `${progress}%` }} />
      </div>

      <div className='relative mx-auto h-[520px] max-w-[420px]'>
        {next && (
          <div className='absolute inset-0 -translate-y-2 scale-95 rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]' />
        )}

        {current ? (
          <div
            className='relative h-full overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]'
            style={{
              transform: swipeDir
                ? `translateX(${swipeDir === 'right' ? 520 : -520}px) rotate(${swipeDir === 'right' ? 18 : -18}deg)`
                : `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.x / 12}deg)`,
              transition: isDragging ? 'none' : 'transform 220ms ease',
              touchAction: 'pan-y',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <img src={current.image} alt={current.name} className='h-2/3 w-full object-cover' />
            <div className='absolute inset-x-0 top-0 h-2/3 bg-gradient-to-t from-black/40 to-transparent' />
            <div className='absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-700'>
              {current.destination}
            </div>
            <div className='absolute right-5 top-5 flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white'>
              <Sparkles className='h-3 w-3' />
              Match
            </div>

            <div className='p-5'>
              <div className='text-xl font-semibold text-zinc-900'>{current.name}</div>
              <div className='mt-2 flex items-center gap-2 text-sm text-zinc-500'>
                <Calendar className='h-4 w-4' />
                {current.dates}
              </div>
              <div className='mt-1 flex items-center gap-2 text-sm text-zinc-500'>
                <Users className='h-4 w-4' />
                {current.groupSize} travelers
              </div>
              <div className='mt-1 flex items-center gap-2 text-sm text-zinc-500'>
                <MapPin className='h-4 w-4' />
                {current.destination}
              </div>
              <div className='mt-4 flex flex-wrap gap-2'>
                {current.vibe.map((tag) => (
                  <span key={tag} className='rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-600'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='flex h-full items-center justify-center rounded-[28px] border border-zinc-200 bg-white text-sm text-zinc-500'>
            No more trips to match right now.
          </div>
        )}
      </div>

      <div className='flex items-center justify-center gap-4'>
        <button
          onClick={handleAction}
          className='flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm'
        >
          <X className='h-5 w-5' />
        </button>
        <button
          onClick={handleAction}
          className='flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_14px_30px_rgba(249,115,22,0.35)]'
        >
          <Heart className='h-6 w-6' />
        </button>
        <button
          onClick={handleAction}
          className='flex h-12 w-12 items-center justify-center rounded-full border border-orange-200 bg-orange-500/10 text-orange-500 shadow-sm'
        >
          <Flame className='h-5 w-5' />
        </button>
      </div>
    </div>
  )
}

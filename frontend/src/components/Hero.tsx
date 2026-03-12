'use client'

import { ArrowRight, Star, MapPin, Heart, X } from 'lucide-react'

const profiles = [
  {
    id: 1,
    name: 'Sofia',
    age: 28,
    from: 'Spain',
    where: 'Taghazout',
    bio: 'Looking for surf partners',
    img: '/surf-morocco.png',
  },
  {
    id: 2,
    name: 'Marcus',
    age: 32,
    from: 'Germany',
    where: 'Chefchaouen',
    bio: 'Photographer in the blue city',
    img: '/chefchaouen.png',
  },
]

function GradientMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute top-1/2 -left-20 h-[400px] w-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  )
}

export default function HeroSection() {
  const current = profiles[0]
  const next = profiles[1]

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-32">
      <GradientMesh />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[11px] text-zinc-400">12,847 travelers this month</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight leading-[1.1] sm:text-5xl lg:text-6xl">
              Travel Morocco
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                without the stress
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-zinc-400">
              Smart navigation, real-time scam alerts, and trusted local
              recommendations. Everything you need for a safe, authentic Morocco
              experience.
            </p>

            <div className="mb-10 flex flex-col gap-4 sm:flex-row">
              <button className="flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-[15px] font-medium text-white shadow-xl shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700">
                Download free
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>

              <button className="flex h-12 items-center justify-center rounded-xl border border-zinc-700 px-6 text-[15px] text-zinc-300 transition hover:bg-zinc-800/50 hover:text-white">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch demo
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1.5 text-sm text-zinc-400">4.9 on App Store</span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[400px] w-[400px] rounded-full border border-zinc-800/30" />
              <div className="absolute h-[300px] w-[300px] rounded-full border border-zinc-800/20" />
            </div>

            <div className="relative h-[400px] w-full max-w-[280px]">
              <div
                className="absolute inset-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
                style={{ transform: 'scale(0.95) translateY(16px)', opacity: 0.4 }}
              >
                <img
                  src={next.img}
                  alt=""
                  className="h-full w-full object-cover opacity-70"
                />
              </div>

              <div className="absolute inset-0 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/50">
                <img
                  src={current.img}
                  alt={current.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border border-zinc-600 bg-gradient-to-br from-zinc-700 to-zinc-800" />
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold">{current.name}</span>
                        <span className="text-sm text-zinc-400">{current.age}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <MapPin className="h-3 w-3" />
                        {current.from} · {current.where}
                      </div>
                    </div>
                  </div>

                  <p className="mb-3 text-sm text-zinc-300">{current.bio}</p>

                  <div className="flex gap-2">
                    <span className="rounded-full bg-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-400">
                      Travel
                    </span>
                    <span className="rounded-full bg-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-400">
                      Adventure
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-16 left-1/2 flex -translate-x-1/2 items-center gap-4">
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-400 transition-all duration-200 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400">
                <X className="h-5 w-5" />
              </button>

              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-transform duration-200 hover:scale-110">
                <Heart className="h-6 w-6 fill-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
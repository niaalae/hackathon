'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

const travelImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    alt: 'Beach travel',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
    alt: 'Adventure hiking',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    alt: 'Lake destination',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
    alt: 'Mountain road',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop',
    alt: 'Blue sky',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200&auto=format&fit=crop',
    alt: 'Sunrise traveler',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
    alt: 'Sea cliffs',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=1200&auto=format&fit=crop',
    alt: 'Kayak lake',
  },
]

const repeatedImages = [...travelImages, ...travelImages]

const features = [
  'Trusted stays',
  'Route help',
  'Safe spots',
  'Guided plans',
  'City picks',
  'Local gems',
]

const placeholders = [
  'Book me a riad in Marrakech...',
  'Plan a 7-day Morocco trip...',
  'Find transport from Fez to Chefchaouen...',
]

function ImageCard({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [hasError, setHasError] = useState(false)
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-[18px] sm:rounded-[22px] shadow-[0_8px_28px_rgba(24,24,27,0.10)] ${className}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 via-white to-orange-100">
          <span className="px-3 text-center text-[10px] font-semibold text-zinc-500 sm:text-xs">{alt}</span>
        </div>
      )}
    </div>
  )
}

function FadePlaceholder() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const cycle = () => {
      setVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % placeholders.length)
        setVisible(true)
      }, 500)
    }
    const interval = setInterval(cycle, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className="pointer-events-none select-none text-zinc-400 transition-opacity duration-500 ease-in-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {placeholders[currentIndex]}
    </span>
  )
}

export default function Hero() {
  const [query, setQuery] = useState('')

  return (
    <section className="relative overflow-hidden bg-white pt-3 sm:pt-4 lg:pt-5">
      <div className="mx-auto px-3 sm:px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-[28px] bg-white px-4 pb-14 pt-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:rounded-[32px] sm:px-7 sm:pb-16 sm:pt-10 lg:rounded-[36px] lg:px-10 lg:pb-20 lg:pt-12">
          <div className="relative mx-auto flex min-h-[720px] max-w-[1120px] flex-col items-center text-center sm:min-h-[800px] lg:min-h-[900px]">

            {/* Heading */}
            <h1 className="mx-auto mt-2 max-w-[920px] text-[36px] font-semibold leading-[0.96] tracking-[-0.05em] text-zinc-950 sm:mt-4 sm:text-[52px] lg:mt-6 lg:text-[72px] xl:text-[80px]">
              <span className="block">
                Make Your{' '}
                <span
                  className="inline-block text-orange-500"
                  style={{
                    fontFamily: '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Morocco Journey
                </span>
              </span>
              <span className="block">Unforgettable!</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-5 max-w-[760px] px-2 text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8 lg:mt-6 lg:text-[16px]">
              Get your dream trip planned with trusted local recommendations, safe
              navigation, scam alerts, and transport help — all in one premium experience.
            </p>

            {/* Input + Button */}
            <div className="mt-8 w-full max-w-[640px] px-1 sm:px-0">

              {/* Mobile */}
              <div className="flex flex-col gap-2.5 sm:hidden">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-[54px] w-full rounded-2xl border border-zinc-200 bg-white px-5 text-[15px] text-zinc-800 shadow-sm outline-none focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)] transition-all duration-200"
                  />
                  {!query && (
                    <div className="absolute inset-0 flex items-center px-5 pointer-events-none">
                      <FadePlaceholder />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => console.log(query)}
                  className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-sm font-semibold text-white transition duration-200 hover:bg-zinc-800 active:scale-[0.98]"
                >
                  Start Planning
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>

              {/* Desktop */}
              <div className="hidden sm:flex w-full items-center gap-2 rounded-full border border-zinc-200 bg-white p-2 shadow-[0_8px_30px_rgba(24,24,27,0.08)] transition-all duration-200 focus-within:border-orange-300 focus-within:shadow-[0_8px_30px_rgba(249,115,22,0.10)]">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-[52px] w-full bg-transparent pl-5 text-[15px] text-zinc-800 outline-none"
                  />
                  {!query && (
                    <div className="absolute inset-0 flex items-center pl-5 pointer-events-none">
                      <FadePlaceholder />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => console.log(query)}
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(24,24,27,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-800"
                >
                  Start Planning
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>

            </div>

            {/* Features */}
            <div className="mt-10 grid w-full max-w-[980px] grid-cols-2 gap-y-4 text-zinc-400 sm:mt-12 sm:grid-cols-3 lg:mt-14 lg:grid-cols-6">
              {features.map((item) => (
                <div key={item} className="text-center text-xs font-semibold tracking-tight sm:text-sm">
                  {item}
                </div>
              ))}
            </div>

            {/* Marquee */}
            <div className="relative mt-10 w-full overflow-x-hidden overflow-y-visible pb-6 sm:mt-12 lg:mt-14">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20" />
              <div className="hero-marquee flex w-max items-end gap-4 px-3 sm:gap-5 sm:px-4">
                {repeatedImages.map((image, index) => (
                  <ImageCard
                    key={`${image.id}-${index}`}
                    src={image.src}
                    alt={image.alt}
                    className={
                      index % 8 === 0 ? 'h-[130px] w-[100px] sm:h-[160px] sm:w-[120px] lg:h-[190px] lg:w-[140px]'
                        : index % 8 === 1 ? 'h-[140px] w-[120px] sm:h-[170px] sm:w-[148px] lg:h-[200px] lg:w-[170px]'
                          : index % 8 === 2 ? 'h-[135px] w-[135px] sm:h-[165px] sm:w-[165px] lg:h-[195px] lg:w-[190px]'
                            : index % 8 === 3 ? 'h-[140px] w-[105px] sm:h-[170px] sm:w-[125px] lg:h-[200px] lg:w-[145px]'
                              : index % 8 === 4 ? 'h-[135px] w-[150px] sm:h-[165px] sm:w-[178px] lg:h-[195px] lg:w-[205px]'
                                : index % 8 === 5 ? 'h-[140px] w-[112px] sm:h-[170px] sm:w-[135px] lg:h-[200px] lg:w-[155px]'
                                  : index % 8 === 6 ? 'h-[135px] w-[135px] sm:h-[165px] sm:w-[165px] lg:h-[195px] lg:w-[190px]'
                                    : 'h-[140px] w-[118px] sm:h-[170px] sm:w-[145px] lg:h-[200px] lg:w-[165px]'
                    }
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .hero-marquee {
          animation: heroMarquee 35s linear infinite;
          will-change: transform;
        }
        .hero-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes heroMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
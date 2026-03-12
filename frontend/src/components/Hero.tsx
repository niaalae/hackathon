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
  'Get me a Sahara Desert guide...',
]

function ImageCard({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [hasError, setHasError] = useState(false)
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-[22px] shadow-[0_10px_24px_rgba(24,24,27,0.08)] ${className}`}>
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

export default function Hero() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-white pt-3 sm:pt-4 lg:pt-5">
      <div className="mx-auto px-3 sm:px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-[28px] bg-white px-4 pb-8 pt-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:rounded-[32px] sm:px-7 sm:pb-10 sm:pt-10 lg:rounded-[36px] lg:px-10 lg:pb-12 lg:pt-12">
          <div className="relative mx-auto flex min-h-[620px] max-w-[1120px] flex-col items-center text-center sm:min-h-[680px] lg:min-h-[760px]">

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
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  className="h-[54px] w-full rounded-2xl border border-zinc-200 bg-white px-5 text-[15px] text-zinc-800 shadow-sm outline-none placeholder:text-zinc-400 focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)] transition-all duration-200"
                />
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
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  className="h-[52px] flex-1 bg-transparent pl-5 text-[15px] text-zinc-800 outline-none placeholder:text-zinc-400"
                />
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
            <div className="relative mt-10 w-full overflow-x-hidden overflow-y-visible pb-4 sm:mt-12 lg:mt-14">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-16" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-16" />
              <div className="hero-marquee flex w-max items-end gap-3 px-2 sm:gap-4 sm:px-3">
                {repeatedImages.map((image, index) => (
                  <ImageCard
                    key={`${image.id}-${index}`}
                    src={image.src}
                    alt={image.alt}
                    className={
                      index % 8 === 0 ? 'h-[102px] w-[78px] sm:h-[122px] sm:w-[92px] lg:h-[142px] lg:w-[104px]'
                        : index % 8 === 1 ? 'h-[110px] w-[98px] sm:h-[130px] sm:w-[114px] lg:h-[150px] lg:w-[132px]'
                          : index % 8 === 2 ? 'h-[106px] w-[112px] sm:h-[126px] sm:w-[128px] lg:h-[146px] lg:w-[148px]'
                            : index % 8 === 3 ? 'h-[110px] w-[82px] sm:h-[130px] sm:w-[96px] lg:h-[150px] lg:w-[110px]'
                              : index % 8 === 4 ? 'h-[106px] w-[120px] sm:h-[126px] sm:w-[138px] lg:h-[146px] lg:w-[158px]'
                                : index % 8 === 5 ? 'h-[110px] w-[90px] sm:h-[130px] sm:w-[104px] lg:h-[150px] lg:w-[120px]'
                                  : index % 8 === 6 ? 'h-[106px] w-[110px] sm:h-[126px] sm:w-[126px] lg:h-[146px] lg:w-[146px]'
                                    : 'h-[110px] w-[96px] sm:h-[130px] sm:w-[112px] lg:h-[150px] lg:w-[128px]'
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
          animation: heroMarquee 30s linear infinite;
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
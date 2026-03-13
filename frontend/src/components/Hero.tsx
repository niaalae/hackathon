'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const travelImages = [
  {
    id: 1,
    src: '/assets/places/m3.jpeg',
    alt: 'Morocco place 1',
  },
  {
    id: 2,
    src: '/assets/places/m4.jpeg',
    alt: 'Morocco place 2',
  },
  {
    id: 3,
    src: '/assets/places/m5.jpeg',
    alt: 'Morocco place 3',
  },
  {
    id: 4,
    src: '/assets/places/m6.jpeg',
    alt: 'Morocco place 4',
  },
  {
    id: 5,
    src: '/assets/places/m7.jpeg',
    alt: 'Morocco place 5',
  },
  {
    id: 6,
    src: '/assets/places/m3.jpeg',
    alt: 'Morocco place 6',
  },
  {
    id: 7,
    src: '/assets/places/m4.jpeg',
    alt: 'Morocco place 7',
  },
  {
    id: 8,
    src: '/assets/places/m5.jpeg',
    alt: 'Morocco place 8',
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

function ImageCard({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className: string
}) {
  const [hasError, setHasError] = useState(false)

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-[18px] bg-white shadow-[0_8px_28px_rgba(24,24,27,0.10)] sm:rounded-[22px] ${className}`}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover object-center"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 via-white to-orange-100">
          <span className="px-3 text-center text-[10px] font-semibold text-zinc-500 sm:text-xs">
            {alt}
          </span>
        </div>
      )}
    </div>
  )
}

function TypePlaceholder() {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    let typingTimeout: number | undefined
    let fadeTimeout: number | undefined
    let resetTimeout: number | undefined

    const fullText = placeholders[index]

    if (text.length < fullText.length) {
      typingTimeout = window.setTimeout(() => {
        setText(fullText.slice(0, text.length + 1))
      }, 38)
    } else {
      fadeTimeout = window.setTimeout(() => {
        setIsFading(true)
        resetTimeout = window.setTimeout(() => {
          setIsFading(false)
          setText('')
          setIndex((prev) => (prev + 1) % placeholders.length)
        }, 520)
      }, 1200)
    }

    return () => {
      if (typingTimeout) window.clearTimeout(typingTimeout)
      if (fadeTimeout) window.clearTimeout(fadeTimeout)
      if (resetTimeout) window.clearTimeout(resetTimeout)
    }
  }, [index, text])

  return (
    <span
      className="pointer-events-none select-none text-zinc-400 transition-opacity duration-500 ease-out"
      style={{ opacity: isFading ? 0 : 1 }}
    >
      {text}
      <span className="inline-block h-4 w-[1px] translate-y-[1px] animate-pulse bg-zinc-300/70" />
    </span>
  )
}

export default function Hero() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = () => {
    const trimmed = query.trim()
    if (!trimmed || isLoading) return

    setIsLoading(true)
    sessionStorage.setItem('heroPrompt', trimmed)

    setTimeout(() => {
      navigate(`/dashboard?prompt=${encodeURIComponent(trimmed)}`)
      setIsLoading(false)
    }, 1200)
  }

  return (
    <section className="relative overflow-hidden bg-white pt-[92px] sm:pt-[96px] lg:pt-[104px]">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 lg:px-6">
        <div className="relative overflow-visible bg-white px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-10 lg:pb-24 lg:pt-14">
          <div className="relative mx-auto flex min-h-[760px] max-w-[1120px] flex-col items-center text-center sm:min-h-[780px] lg:min-h-[820px] xl:min-h-[860px]">
            <h1 className="mx-auto mt-2 max-w-[920px] text-[36px] font-semibold leading-[0.96] tracking-[-0.05em] text-zinc-950 sm:mt-4 sm:text-[52px] lg:mt-6 lg:text-[72px] xl:text-[80px]">
              <span className="block">
                Make Your{' '}
                <span
                  className="inline-block text-orange-500"
                  style={{
                    fontFamily: '"Dancing Script", cursive',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Morocco Journey
                </span>
              </span>
              <span className="block">Unforgettable!</span>
            </h1>

            <p
              className="mx-auto mt-5 max-w-[760px] px-2 text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8 lg:mt-6 lg:text-[16px]"
              style={{
                fontFamily:
                  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              Get your dream trip planned with trusted local recommendations, safe
              navigation, scam alerts, and transport help — all in one premium experience.
            </p>

            <div className="mt-8 w-full max-w-[640px] px-1 sm:px-0">
              <div className="flex flex-col gap-2.5 sm:hidden">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSubmit()
                    }}
                    className="h-[54px] w-full rounded-2xl border border-zinc-200 bg-white px-5 text-[15px] text-zinc-800 shadow-sm outline-none transition-all duration-200 focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                  />
                  {!query && (
                    <div className="pointer-events-none absolute inset-0 flex items-center px-5">
                      <TypePlaceholder />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-sm font-semibold text-white transition duration-200 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Launching...' : 'Start Planning'}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>

              <div className="hidden w-full items-center gap-2 rounded-full border border-zinc-200 bg-white p-2 shadow-[0_8px_30px_rgba(24,24,27,0.08)] transition-all duration-200 focus-within:border-orange-300 focus-within:shadow-[0_8px_30px_rgba(249,115,22,0.10)] sm:flex">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSubmit()
                    }}
                    className="h-[52px] w-full bg-transparent pl-5 text-[15px] text-zinc-800 outline-none"
                  />
                  {!query && (
                    <div className="pointer-events-none absolute inset-0 flex items-center pl-5">
                      <TypePlaceholder />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(24,24,27,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Launching...' : 'Start Planning'}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#f8f3ee]/85 backdrop-blur-md">
                <div className="relative w-[320px] overflow-hidden rounded-[28px] border border-orange-100/70 bg-white px-7 py-8 text-center shadow-[0_30px_80px_rgba(249,115,22,0.18)]">
                  <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-orange-200/40 blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-amber-200/50 blur-2xl" />
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111827] text-white shadow-[0_12px_26px_rgba(15,23,42,0.28)]">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">Preparing your dashboard</p>
                  <p className="mt-2 text-xs text-zinc-500">Lining up bookings and collaborators</p>
                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-orange-100">
                    <div className="hero-loader h-full w-1/2 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 grid w-full max-w-[980px] grid-cols-2 gap-y-4 text-zinc-400 sm:mt-12 sm:grid-cols-3 lg:mt-14 lg:grid-cols-6">
              {features.map((item) => (
                <div
                  key={item}
                  className="text-center text-xs font-semibold tracking-tight sm:text-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="relative mt-10 w-full overflow-x-hidden overflow-y-visible pb-8 sm:mt-12 sm:pb-10 lg:mt-14 lg:pb-12">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20" />

              <div className="hero-marquee flex w-max items-center gap-4 px-3 sm:gap-5 sm:px-4">
                {repeatedImages.map((image, index) => (
                  <ImageCard
                    key={`${image.id}-${index}`}
                    src={image.src}
                    alt={image.alt}
                    className={
                      index % 4 === 0
                        ? 'h-[126px] w-[110px] sm:h-[170px] sm:w-[130px] lg:h-[200px] lg:w-[150px]'
                        : index % 4 === 1
                          ? 'h-[126px] w-[160px] sm:h-[170px] sm:w-[190px] lg:h-[200px] lg:w-[220px]'
                          : index % 4 === 2
                            ? 'h-[126px] w-[140px] sm:h-[170px] sm:w-[170px] lg:h-[200px] lg:w-[200px]'
                            : 'h-[126px] w-[120px] sm:h-[170px] sm:w-[145px] lg:h-[200px] lg:w-[165px]'
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
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .hero-loader {
          animation: heroLoader 1.1s ease-in-out infinite;
        }

        @keyframes heroLoader {
          0% {
            transform: translateX(-20%);
            width: 35%;
          }
          50% {
            transform: translateX(20%);
            width: 70%;
          }
          100% {
            transform: translateX(-20%);
            width: 35%;
          }
        }
      `}</style>
    </section>
  )
}
'use client'

import { ArrowRight, Sparkles } from 'lucide-react'

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
]

const repeatedImages = [...travelImages, ...travelImages]

export default function TravelHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#eaf4fb] pt-24">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[34px] bg-[#f7f2ea] px-6 pb-8 pt-14 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:px-10 lg:px-14 lg:pb-10 lg:pt-16">
          {/* soft background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-120px] h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-orange-200/30 blur-3xl" />
            <div className="absolute bottom-[-80px] left-[15%] h-[180px] w-[180px] rounded-full bg-sky-200/30 blur-3xl" />
            <div className="absolute bottom-[-80px] right-[15%] h-[180px] w-[180px] rounded-full bg-orange-100/40 blur-3xl" />
          </div>

          <div className="relative mx-auto flex min-h-[720px] max-w-6xl flex-col items-center justify-between">
            {/* top content */}
            <div className="w-full text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                Explore Morocco smarter
              </div>

              <h1 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.95] tracking-[-0.06em] text-zinc-950 sm:text-[68px] lg:text-[92px]">
                Make Your{' '}
                <span
                  className="inline-block text-orange-500"
                  style={{
                    fontFamily: '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive',
                    fontWeight: 600,
                  }}
                >
                  Morocco Journey
                </span>
                <br />
                Unforgettable!
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">
                Get your dream trip planned with trusted local recommendations,
                safe navigation, scam alerts, and transport help — all in one
                premium experience.
              </p>

              <div className="mt-8 flex items-center justify-center">
                <button className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(24,24,27,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-800">
                  Start Planning
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-y-4 text-zinc-400 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  'Trusted stays',
                  'Route help',
                  'Safe spots',
                  'Guided plans',
                  'City picks',
                  'Local gems',
                ].map((item) => (
                  <div
                    key={item}
                    className="text-center text-sm font-semibold tracking-tight"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* bottom carousel */}
            <div className="relative mt-10 w-full overflow-hidden pb-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#f7f2ea] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#f7f2ea] to-transparent" />

              <div className="hero-marquee flex w-max items-end gap-4">
                {repeatedImages.map((image, index) => (
                  <div
                    key={`${image.id}-${index}`}
                    className={`shrink-0 overflow-hidden rounded-[26px] shadow-[0_12px_30px_rgba(24,24,27,0.08)] ${
                      index % 6 === 0
                        ? 'h-[140px] w-[100px] sm:h-[160px] sm:w-[115px] lg:h-[185px] lg:w-[130px]'
                        : index % 6 === 1
                        ? 'h-[150px] w-[130px] sm:h-[170px] sm:w-[150px] lg:h-[195px] lg:w-[175px]'
                        : index % 6 === 2
                        ? 'h-[145px] w-[145px] sm:h-[165px] sm:w-[165px] lg:h-[190px] lg:w-[190px]'
                        : index % 6 === 3
                        ? 'h-[150px] w-[100px] sm:h-[170px] sm:w-[115px] lg:h-[195px] lg:w-[130px]'
                        : index % 6 === 4
                        ? 'h-[145px] w-[155px] sm:h-[165px] sm:w-[175px] lg:h-[190px] lg:w-[205px]'
                        : 'h-[150px] w-[115px] sm:h-[170px] sm:w-[130px] lg:h-[195px] lg:w-[145px]'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-marquee {
          animation: heroMarquee 32s linear infinite;
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
      `}</style>
    </section>
  )
}
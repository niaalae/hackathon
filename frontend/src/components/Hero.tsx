'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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

export default function TravelHeroSection() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const features = [
    t('hero.feature1'),
    t('hero.feature2'),
    t('hero.feature3'),
    t('hero.feature4'),
    t('hero.feature5'),
    t('hero.feature6'),
  ]

  return (
    <section className="relative overflow-hidden bg-[#ffffff] pt-3 sm:pt-4 lg:pt-5">
    <section className="relative overflow-hidden bg-[#eaf4fb] pt-3 sm:pt-4 lg:pt-5" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto px-3 sm:px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-[28px] bg-[#ffffff] px-4 pb-8 pt-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:rounded-[32px] sm:px-7 sm:pb-10 sm:pt-10 lg:rounded-[36px] lg:px-10 lg:pb-12 lg:pt-12">
          <div className="relative mx-auto flex min-h-[620px] max-w-[1120px] flex-col items-center text-center sm:min-h-[680px] lg:min-h-[760px]">
            <h1 className="mx-auto mt-2 max-w-[920px] text-[40px] font-semibold leading-[0.95] tracking-[-0.06em] text-zinc-950 sm:mt-4 sm:text-[56px] lg:mt-6 lg:text-[78px] xl:text-[86px]">
        <div className="relative overflow-hidden rounded-[28px] bg-[#f7f2ea] px-4 pb-5 pt-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:rounded-[32px] sm:px-7 sm:pb-7 sm:pt-10 lg:rounded-[36px] lg:px-10 lg:pb-8 lg:pt-12">
          {/* background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-110px] h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-orange-200/25 blur-3xl sm:h-[260px] sm:w-[260px]" />
            <div className="absolute bottom-[-70px] left-[12%] h-[140px] w-[140px] rounded-full bg-sky-200/25 blur-3xl sm:h-[180px] sm:w-[180px]" />
            <div className="absolute bottom-[-70px] right-[12%] h-[140px] w-[140px] rounded-full bg-orange-100/30 blur-3xl sm:h-[180px] sm:w-[180px]" />
          </div>

          <div className="relative mx-auto flex min-h-[580px] max-w-[1120px] flex-col items-center text-center sm:min-h-[640px] lg:min-h-[700px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-4 py-2 text-[11px] font-semibold text-zinc-700 shadow-sm backdrop-blur sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              {t('hero.badge')}
            </div>

            <h1 className="mx-auto mt-6 max-w-[920px] text-[42px] font-semibold leading-[0.94] tracking-[-0.06em] text-zinc-950 sm:mt-7 sm:text-[58px] lg:mt-8 lg:text-[84px]">
              <span className="block">
                {t('hero.title1')}{' '}
                <span
                  className="inline-block text-orange-500"
                  style={{
                    fontFamily:
                      '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t('hero.title2')}
                </span>
              </span>
              <span className="block">{t('hero.title3')}</span>
            </h1>

            <p className="mx-auto mt-5 max-w-[760px] px-2 text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8 lg:mt-6 lg:text-[16px]">
              Get your dream trip planned with trusted local recommendations, safe
              navigation, scam alerts, and transport help — all in one premium
              experience.
            <p className="mx-auto mt-5 max-w-[760px] text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8 lg:mt-6 lg:text-[16px]">
              {t('hero.description')}
            </p>

            <div className="mt-7 sm:mt-8">
              <button className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(24,24,27,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-800">
                {t('hero.cta')}
                <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-white/10 ${isRtl ? 'rotate-180' : ''}`}>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </div>

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

            <div className="relative mt-10 w-full overflow-x-hidden overflow-y-visible pb-4 sm:mt-12 lg:mt-14">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#ffffff] to-transparent sm:w-16" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#ffffff] to-transparent sm:w-16" />

              <div className="hero-marquee flex w-max items-end gap-3 px-2 sm:gap-4 sm:px-3">
                {repeatedImages.map((image, index) => (
                  <div
                    key={`${image.id}-${index}`}
                    className={`shrink-0 overflow-hidden rounded-[22px] shadow-[0_10px_24px_rgba(24,24,27,0.08)] ${
                      index % 8 === 0
                        ? 'h-[102px] w-[78px] sm:h-[122px] sm:w-[92px] lg:h-[142px] lg:w-[104px]'
                        : index % 8 === 1
                          ? 'h-[110px] w-[98px] sm:h-[130px] sm:w-[114px] lg:h-[150px] lg:w-[132px]'
                          : index % 8 === 2
                            ? 'h-[106px] w-[112px] sm:h-[126px] sm:w-[128px] lg:h-[146px] lg:w-[148px]'
                            : index % 8 === 3
                              ? 'h-[110px] w-[82px] sm:h-[130px] sm:w-[96px] lg:h-[150px] lg:w-[110px]'
                              : index % 8 === 4
                                ? 'h-[106px] w-[120px] sm:h-[126px] sm:w-[138px] lg:h-[146px] lg:w-[158px]'
                                : index % 8 === 5
                                  ? 'h-[110px] w-[90px] sm:h-[130px] sm:w-[104px] lg:h-[150px] lg:w-[120px]'
                                  : index % 8 === 6
                                    ? 'h-[106px] w-[110px] sm:h-[126px] sm:w-[126px] lg:h-[146px] lg:w-[146px]'
                                    : 'h-[110px] w-[96px] sm:h-[130px] sm:w-[112px] lg:h-[150px] lg:w-[128px]'
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
          animation: heroMarquee 30s linear infinite;
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
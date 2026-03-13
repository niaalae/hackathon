import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function ZellijLineBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.25]"
        viewBox="0 0 1600 1000"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="zellijFaqPattern" width="220" height="220" patternUnits="userSpaceOnUse">
            <g
              stroke="rgba(37,99,235,0.26)"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="110,22 124,60 110,72 96,60" />
              <polygon points="178,42 162,74 150,68 154,34" />
              <polygon points="198,110 160,124 148,110 160,96" />
              <polygon points="178,178 150,152 154,140 166,146" />
              <polygon points="110,198 96,160 110,148 124,160" />
              <polygon points="42,178 70,152 66,140 54,146" />
              <polygon points="22,110 60,96 72,110 60,124" />
              <polygon points="42,42 70,68 66,80 54,74" />
              <polygon points="110,72 138,80 148,110 138,140 110,148 82,140 72,110 82,80" />
              <line x1="28" y1="22" x2="42" y2="42" />
              <line x1="192" y1="22" x2="178" y2="42" />
              <line x1="28" y1="198" x2="42" y2="178" />
              <line x1="192" y1="198" x2="178" y2="178" />
              <line x1="68" y1="10" x2="54" y2="34" />
              <line x1="152" y1="10" x2="166" y2="34" />
              <line x1="68" y1="210" x2="54" y2="186" />
              <line x1="152" y1="210" x2="166" y2="186" />
            </g>
          </pattern>

          <radialGradient
            id="leftGlowFaq"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(300 260) rotate(90) scale(360 420)"
          >
            <stop stopColor="rgba(59,130,246,0.10)" />
            <stop offset="1" stopColor="rgba(59,130,246,0)" />
          </radialGradient>

          <radialGradient
            id="rightGlowFaq"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1280 240) rotate(90) scale(340 420)"
          >
            <stop stopColor="rgba(249,115,22,0.08)" />
            <stop offset="1" stopColor="rgba(249,115,22,0)" />
          </radialGradient>
        </defs>

        <rect width="1600" height="1000" fill="url(#zellijFaqPattern)" />
        <rect width="1600" height="1000" fill="url(#leftGlowFaq)" />
        <rect width="1600" height="1000" fill="url(#rightGlowFaq)" />
      </svg>
    </div>
  )
}

export default function FAQSection() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const removedQuestions = [
    'Is the medina large and easy to get around?',
    'Can the platform create a personalized itinerary?',
    'What preferences can I use to personalize my trip?',
  ]

  const faqCount = 8
  const faqs = Array.from({ length: faqCount }, (_, i) => ({
    question: t(`faq.q${i + 1}`),
    answer: t(`faq.a${i + 1}`),
  })).filter((faq) => !removedQuestions.includes(faq.question))

  return (
    <section
      className="relative w-full bg-white px-4 py-20 md:px-8 md:py-32"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Fixed-looking background layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ZellijLineBackground />
        <div className="absolute left-1/2 top-0 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-orange-50/30 blur-3xl" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 md:flex-row md:items-start md:gap-24">
        {/* Left Column */}
        <div
          className={`h-fit w-full md:sticky md:top-32 md:w-1/3 ${
            isRtl ? 'md:text-right' : 'md:text-left'
          }`}
        >
          <div className="inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500 sm:text-xs">
            FAQ
          </div>

          <h2 className="mb-4 mt-5 text-3xl font-semibold tracking-tight text-slate-900 md:mb-6 md:text-5xl">
            {t('faq.title')}
          </h2>

          <p className="max-w-sm text-base leading-relaxed text-slate-500 md:text-lg">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-2/3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full cursor-pointer border-b border-slate-200 py-4"
            >
              <div className="flex items-center justify-between gap-6">
                <h3
                  className={`text-base font-medium transition-colors duration-300 md:text-lg ${
                    openIndex === index ? 'text-orange-500' : 'text-slate-800'
                  } ${isRtl ? 'text-right' : 'text-left'}`}
                >
                  {faq.question}
                </h3>

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${openIndex === index ? 'rotate-180' : ''} shrink-0 transition-all duration-500 ease-in-out`}
                >
                  <path
                    d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                    stroke={openIndex === index ? '#f97316' : '#1D293D'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? 'max-h-[300px] pt-4 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p
                  className={`max-w-2xl text-sm text-slate-500 md:text-base ${
                    isRtl ? 'text-right' : 'text-left'
                  }`}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
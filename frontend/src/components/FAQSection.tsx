import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
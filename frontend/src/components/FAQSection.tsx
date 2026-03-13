import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FAQSection() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const faqCount = 8
    const faqs = Array.from({ length: faqCount }, (_, i) => ({
        question: t(`faq.q${i + 1}`),
        answer: t(`faq.a${i + 1}`)
    }))

    return (
        <section className='faq-section w-full py-20 md:py-32 px-4 md:px-8 bg-white'>
            <div className='w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-start relative'>
                {/* Left Column - Sticky */}
                <div className={`w-full md:w-1/3 md:sticky md:top-32 h-fit ${isRtl ? 'md:text-right' : 'md:text-left'}`}>
                    <h2 className='text-3xl md:text-5xl font-semibold text-slate-900 mb-4 md:mb-6 tracking-tight'>
                        {t('faq.title')}
                    </h2>
                    <p className='text-slate-500 text-base md:text-lg leading-relaxed max-w-sm'>
                        {t('faq.subtitle')}
                    </p>
                </div>

                {/* Right Column - Scrolling */}
                <div className='w-full md:w-2/3 flex flex-col' dir={isRtl ? 'rtl' : 'ltr'}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            onClick={() => toggleFAQ(index)}
                            className={`border-b border-slate-200 py-6 md:py-8 cursor-pointer group transition-all duration-300 ${openIndex === index ? 'bg-slate-50/50 -mx-4 px-4 md:mx-0 md:px-6 rounded-2xl border-transparent' : ''}`}
                        >
                            <div className='flex items-center justify-between gap-6'>
                                <h3 className={`text-lg md:text-xl font-medium text-slate-800 transition-colors group-hover:text-slate-600 ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {faq.question}
                                </h3>
                                <div className={`flex-shrink-0 transition-all duration-300 w-8 h-8 rounded-full flex items-center justify-center ${openIndex === index ? 'bg-slate-200 rotate-180 text-slate-900' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                            <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-4 md:mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className='overflow-hidden'>
                                    <p className={`text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

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
        <section className='faq-section w-full py-32 px-4 bg-white border-t border-neutral-100'>
            <div className='w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start relative'>
                {/* Left Column - Sticky */}
                <div className={`w-full md:w-1/3 md:sticky md:top-40 h-fit ${isRtl ? 'md:text-right' : 'md:text-left'}`}>
                    <h2 className='text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight'>
                        {t('faq.title')}
                    </h2>
                    <p className='text-neutral-500 text-xl leading-relaxed max-w-sm'>
                        {t('faq.subtitle')}
                    </p>
                </div>

                {/* Right Column - Scrolling */}
                <div className='w-full md:w-2/3 flex flex-col' dir={isRtl ? 'rtl' : 'ltr'}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            onClick={() => toggleFAQ(index)}
                            className='border-b border-neutral-200 py-8 cursor-pointer group'
                        >
                            <div className='flex items-center justify-between gap-8'>
                                <h3 className={`text-xl font-semibold text-neutral-800 transition-colors group-hover:text-neutral-500 ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {faq.question}
                                </h3>
                                <div className={`flex-shrink-0 transition-all duration-300 w-6 h-6 flex items-center justify-center ${openIndex === index ? 'rotate-180 text-neutral-800' : 'text-neutral-400'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                            <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className='overflow-hidden'>
                                    <p className={`text-lg text-neutral-500 leading-relaxed max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
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

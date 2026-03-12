import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FAQSection() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const faqs = [
        { question: t('faq.q1'), answer: t('faq.a1') },
        { question: t('faq.q2'), answer: t('faq.a2') },
        { question: t('faq.q3'), answer: t('faq.a3') },
        { question: t('faq.q4'), answer: t('faq.a4') },
        { question: t('faq.q5'), answer: t('faq.a5') },
        { question: t('faq.q6'), answer: t('faq.a6') },
        { question: t('faq.q7'), answer: t('faq.a7') },
        { question: t('faq.q8'), answer: t('faq.a8') }
    ]

    return (
        <>
            <style>
                {`
                    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
                    .faq-section {
                        font-family: "Poppins", sans-serif;
                    }
                `}
            </style>

            <section className='faq-section w-full flex flex-col items-center justify-center py-16 px-4 bg-white'>
                <div className='w-full max-w-5xl'>
                    <div className='mb-10'>
                        <h2 className={`text-3xl font-semibold text-neutral-900 text-center ${isRtl ? 'md:text-right' : 'md:text-left'} mb-4`}>
                            {t('faq.title')}
                        </h2>
                        <p className={`text-neutral-800 max-w-[416px] text-sm text-center ${isRtl ? 'md:text-right md:mr-0 md:ml-auto' : 'md:text-left md:ml-0 md:mr-auto'} mx-auto`}>
                            {t('faq.subtitle')}
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4' dir={isRtl ? 'rtl' : 'ltr'}>
                        {faqs.map((faq, index) => (
                            <div key={index} onClick={() => toggleFAQ(index)} className={`bg-slate-50 p-3.5 rounded-lg cursor-pointer transition-all duration-300 border border-slate-200 hover:bg-slate-100 ${openIndex === index ? 'row-span-2' : ''}`}>
                                <div className='flex items-center justify-between gap-4'>
                                    <span className={`text-sm font-medium text-neutral-800 ${isRtl ? 'text-right' : 'text-left'}`}>{faq.question}</span>
                                    <div className={`text-slate-400 p-1 rounded transition-colors ${openIndex === index ? 'bg-slate-200 text-slate-500' : 'hover:bg-slate-300 hover:text-slate-500'}`}>
                                        {openIndex === index ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus"><path d="M5 12h14" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                        )}
                                    </div>
                                </div>
                                <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className='overflow-hidden'>
                                        <p className={`text-sm text-neutral-600 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

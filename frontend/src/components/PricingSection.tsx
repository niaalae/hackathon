import { useTranslation } from 'react-i18next'

export default function PricingSection() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'

    return (
        <section className="bg-white w-full" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="py-20 max-w-5xl mx-auto px-4">
                <h1 className="text-center text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl text-gray-900">
                    {t('pricing.title')}
                </h1>
                <p className="text-center text-gray-400 md:text-lg mt-2">
                    {t('pricing.subtitle')}
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mt-10 text-left">
                    {/* Card 1 - Starter */}
                    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                        <div className="flex flex-col items-center border-b border-gray-300 pb-6">
                            <span className="mb-6 text-gray-800 font-medium">{t('pricing.free.name')}</span>
                            <span className="mb-3 text-4xl font-medium">${t('pricing.free.price')}/mo</span>
                            <span className="text-gray-500 text-sm">{t('pricing.free.desc')}</span>
                        </div>
                        <div className="space-y-4 py-9">
                            {[
                                { text: t('pricing.features.p1'), included: true },
                                { text: t('pricing.features.p2'), included: true },
                                { text: t('pricing.features.p3'), included: false },
                                { text: t('pricing.features.p4'), included: false },
                                { text: t('pricing.features.p5'), included: false },
                                { text: t('pricing.features.c4'), included: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className={`grid size-5 place-content-center rounded-full text-[10px] text-white ${item.included ? 'bg-indigo-500' : 'bg-gray-200 text-gray-600'}`}>
                                        {item.included ? (
                                            <svg stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24"
                                                strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24"
                                                strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        )}
                                    </span>
                                    <span className="text-sm text-gray-400">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 2 - Explorer */}
                    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                        <div className="flex flex-col items-center border-b border-gray-300 pb-6">
                            <span className="mb-6 text-gray-800 font-medium">{t('pricing.pro.name')}</span>
                            <span className="mb-3 text-4xl font-medium">${t('pricing.pro.price')}/mo</span>
                            <span className="text-gray-500 text-sm">{t('pricing.pro.desc')}</span>
                        </div>
                        <div className="space-y-4 py-9">
                            {[
                                { text: t('pricing.features.p1'), included: true },
                                { text: t('pricing.features.p2'), included: true },
                                { text: t('pricing.features.p3'), included: true },
                                { text: t('pricing.features.p4'), included: true },
                                { text: t('pricing.features.p5'), included: false },
                                { text: t('pricing.features.c4'), included: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className={`grid size-5 place-content-center rounded-full text-[10px] text-white ${item.included ? 'bg-indigo-500' : 'bg-gray-200 text-gray-600'}`}>
                                        {item.included ? (
                                            <svg stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24"
                                                strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24"
                                                strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        )}
                                    </span>
                                    <span className="text-sm text-gray-400">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 3 - Premium */}
                    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                        <div className="flex flex-col items-center border-b border-gray-300 pb-6">
                            <span className="mb-6 text-gray-800 font-medium">{t('pricing.custom.name')}</span>
                            <span className="mb-3 text-4xl font-medium">$149/mo</span>
                            <span className="text-gray-500 text-sm">{t('pricing.custom.desc')}</span>
                        </div>
                        <div className="space-y-4 py-9">
                            {[
                                { text: t('pricing.features.p1'), included: true },
                                { text: t('pricing.features.p2'), included: true },
                                { text: t('pricing.features.p3'), included: true },
                                { text: t('pricing.features.p4'), included: true },
                                { text: t('pricing.features.p5'), included: true },
                                { text: t('pricing.features.c4'), included: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className={`grid size-5 place-content-center rounded-full text-[10px] text-white ${item.included ? 'bg-indigo-500' : 'bg-gray-200 text-gray-600'}`}>
                                        {item.included ? (
                                            <svg stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24"
                                                strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24"
                                                strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        )}
                                    </span>
                                    <span className="text-sm text-gray-400">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

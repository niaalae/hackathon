import { useTranslation } from 'react-i18next'

const pricingPlans = [
    {
        id: 1,
        name: 'Starter',
        description: 'Perfect for solo travelers exploring Morocco for the first time.',
        price: 0,
        buttonText: 'Start for free',
        buttonStyle: 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50',
        subtext: 'Free forever. No credit card required.',
        isDark: false,
        features: [
            'Interactive map with 10 pins',
            'Basic route planning',
            'Flight & hotel search',
            'Offline access (limited)',
            'Community recommendations',
        ],
    },
    {
        id: 2,
        name: 'Explorer',
        description: 'Best for frequent travelers and groups planning real trips.',
        price: 19,
        period: '/mo',
        buttonText: 'Unlock full access',
        buttonStyle: 'bg-linear-to-r from-orange-500 to-orange-400 text-white',
        subtext: 'Cancel anytime. Full access to all features.',
        isDark: true,
        features: [
            'Unlimited map pins & custom routes',
            'Travel time estimates (walk, transit, drive)',
            'Rail & road overlays',
            'All-in-one booking hub (flights, hotels, activities)',
            'Email import for bookings',
            'Full offline access',
            'Group collaboration (shared dates, budgets, photos)',
            'AI travel agent assistant',
            'Personalized local recommendations',
            'Cost estimates (tolls, fuel, tickets)',
        ],
    },
    {
        id: 3,
        name: 'Premium',
        description: 'Built for agencies and large groups shipping trips together.',
        price: 49,
        period: '/mo',
        buttonText: 'Get premium access',
        buttonStyle: 'bg-linear-to-r from-orange-500 to-orange-400 text-white',
        subtext: 'Priority support and dedicated concierge.',
        isDark: false,
        features: [
            'Everything in Explorer',
            'Dedicated travel concierge',
            'Private transport booking',
            'Travel theft insurance',
            'Team accounts & management',
            'Verified security escorts',
            'Exclusive villa & riad access',
        ],
    },
]

export default function PricingSection() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'

    return (
        <section className="bg-white py-16 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-[40px] font-semibold text-slate-900 mb-3">
                        {t('pricing.title')}
                    </h1>
                    <p className="text-sm md:text-base/7 text-slate-600 max-w-md mx-auto">
                        {t('pricing.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`rounded-2xl px-6 py-8 ${plan.isDark ? 'bg-slate-900 shadow-xl shadow-black/10' : 'bg-white border border-slate-200'}`}
                        >
                            <h3 className={`text-sm font-medium mb-6 ${plan.isDark ? 'text-white' : 'text-slate-900'}`}>
                                {plan.name}
                            </h3>

                            <p className={`text-sm mb-8 max-w-58 ${plan.isDark ? 'text-white' : 'text-slate-800'}`}>
                                {plan.description}
                            </p>

                            <div className="mb-8">
                                <div className="flex items-start gap-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-3xl ${plan.isDark ? 'text-white' : 'text-slate-900'}`}>$</span>
                                        <span className={`text-5xl font-semibold leading-none ${plan.isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {plan.price}
                                        </span>
                                    </div>
                                    {plan.price > 0 && (
                                        <p className="text-sm">
                                            <span className={plan.isDark ? 'text-white' : 'text-black'}>{plan.period}</span>
                                            <br />
                                            <span className={plan.isDark ? 'text-white/50' : 'text-black/45'}>plus local taxes</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button className={`w-full py-3 rounded-sm text-sm mb-2.5 transition cursor-pointer ${plan.buttonStyle}`}>
                                {plan.buttonText}
                            </button>

                            <p className={`text-sm/5 max-w-60 mb-6 ${plan.isDark ? 'text-white/80' : 'text-black/50'}`}>
                                {plan.subtext}
                            </p>

                            <div className={`border-t mb-5 ${plan.isDark ? 'border-white/90' : 'border-slate-300'}`} />

                            <div className="space-y-2.5">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mt-0.5 shrink-0"
                                        >
                                            <path
                                                d="M7.75 14.75a7 7 0 1 0 0-14 7 7 0 0 0 0 14"
                                                stroke={plan.isDark ? '#F8FAFC' : '#62748e'}
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="m5.65 7.752 1.4 1.4 2.8-2.8"
                                                stroke={plan.isDark ? '#F8FAFC' : '#62748e'}
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className={`text-sm ${plan.isDark ? 'text-slate-50' : 'text-slate-600'}`}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

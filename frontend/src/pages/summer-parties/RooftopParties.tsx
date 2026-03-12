import { useTranslation } from 'react-i18next'
import { Building2, MapPin, Star, ArrowRight } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'

const venues = [
    {
        title: 'Sky Lounge Marrakech',
        location: 'Marrakech',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop',
        description: 'Overlooking the Atlas Mountains, this luxury rooftop bar serves craft cocktails with panoramic sunset views and live DJ sets every weekend.',
        priceRange: '$$$',
    },
    {
        title: 'Medina Terrace',
        location: 'Fes',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?q=80&w=600&auto=format&fit=crop',
        description: 'A hidden gem atop a centuries-old riad overlooking the Fes medina. Moroccan mint tea by day, Gnawa fusion music by night.',
        priceRange: '$$',
    },
    {
        title: 'Ocean View Casablanca',
        location: 'Casablanca',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop',
        description: 'Casablanca\'s hottest rooftop facing the Atlantic Ocean. International DJs, craft cocktails, and a chic urban crowd every Friday.',
        priceRange: '$$$',
    },
    {
        title: 'Kasbah Heights',
        location: 'Tangier',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600&auto=format&fit=crop',
        description: 'Perched above the Strait of Gibraltar with views of Spain. A bohemian rooftop with tapas, local wines, and acoustic sessions.',
        priceRange: '$$',
    },
    {
        title: 'Sunset Terrace Essaouira',
        location: 'Essaouira',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
        description: 'Watch the sun melt into the Atlantic from this wind-protected rooftop. Fresh seafood, local wines, and Gnawa music every evening.',
        priceRange: '$$',
    },
    {
        title: 'Royal Palm Agadir',
        location: 'Agadir',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=600&auto=format&fit=crop',
        description: 'A tropical rooftop with palm trees and a pool overlooking Agadir\'s bay. Weekend pool parties with international DJs and brunch specials.',
        priceRange: '$$$',
    },
]

export default function RooftopParties() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'

    return (
        <PageLayout>
            <div dir={isRtl ? 'rtl' : 'ltr'}>
                {/* Hero */}
                <section className="relative bg-white pt-20 pb-28">
                    <div className="relative mx-auto max-w-4xl px-6 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm">
                            <Building2 className="h-3.5 w-3.5 text-orange-500" />
                            {t('nav.rooftopParties')}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                            Morocco's Finest
                            <span className="block text-orange-500">Rooftop Parties</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
                            Experience Morocco from above — curated rooftop venues with stunning views, live music, and unforgettable nightlife across the kingdom.
                        </p>
                    </div>
                </section>

                {/* Venues Grid */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {venues.map((venue) => (
                            <div key={venue.title} className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative h-52 overflow-hidden">
                                    <img src={venue.image} alt={venue.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-zinc-700 backdrop-blur">
                                            {venue.priceRange}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-zinc-700 backdrop-blur">
                                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" /> {venue.rating}
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-lg font-semibold text-zinc-900">{venue.title}</h3>
                                    <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                                        <MapPin className="h-3 w-3 text-orange-400" /> {venue.location}
                                    </span>
                                    <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-500">{venue.description}</p>
                                    <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 transition hover:text-orange-600">
                                        View Details <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-4xl px-6 pb-24">
                    <div className="rounded-3xl bg-zinc-900 p-10 text-center sm:p-14">
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">Get VIP access to rooftop events</h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                            Premium members get priority reservations, exclusive event invites, and complimentary welcome drinks at partner venues.
                        </p>
                        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg">
                            Unlock VIP Access <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}

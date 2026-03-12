import { useTranslation } from 'react-i18next'
import { Route, Clock, Star, ArrowRight, Sparkles } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'

const itineraries = [
    {
        title: 'Fes Medina Deep Dive',
        days: 3,
        difficulty: 'Easy',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?q=80&w=600&auto=format&fit=crop',
        description: 'Explore the world\'s largest car-free urban area with guided routes through historic gates, artisan workshops, and hidden riads.',
        tags: ['Culture', 'History', 'Food'],
    },
    {
        title: 'Imperial Cities Circuit',
        days: 7,
        difficulty: 'Moderate',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600&auto=format&fit=crop',
        description: 'Journey through Morocco\'s four imperial cities — Fes, Meknes, Rabat, and Marrakech — experiencing royal palaces and ancient medinas.',
        tags: ['Cities', 'Architecture', 'Culture'],
    },
    {
        title: 'Desert & Oasis Adventure',
        days: 5,
        difficulty: 'Challenging',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d23?q=80&w=600&auto=format&fit=crop',
        description: 'From the Atlas Mountains to the Sahara dunes of Merzouga, experience camel treks, starlit camps, and oasis villages.',
        tags: ['Adventure', 'Nature', 'Desert'],
    },
    {
        title: 'Coastal Morocco',
        days: 6,
        difficulty: 'Easy',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
        description: 'Discover Morocco\'s stunning Atlantic coast from Tangier to Essaouira, with stops at charming fishing villages and surf spots.',
        tags: ['Beach', 'Relaxation', 'Surfing'],
    },
    {
        title: 'Artisan & Craft Trail',
        days: 4,
        difficulty: 'Easy',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=600&auto=format&fit=crop',
        description: 'Visit master craftsmen in Fes — leatherwork tanneries, pottery workshops, zellige tile studios, and brass artisan quarters.',
        tags: ['Crafts', 'Shopping', 'Culture'],
    },
    {
        title: 'Atlas Mountains Trek',
        days: 4,
        difficulty: 'Challenging',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop',
        description: 'Hike through Berber villages, walnut groves, and alpine meadows with views of North Africa\'s highest peak, Mount Toubkal.',
        tags: ['Trekking', 'Nature', 'Adventure'],
    },
]

const difficultyColor: Record<string, string> = {
    Easy: 'bg-green-50 text-green-600',
    Moderate: 'bg-amber-50 text-amber-600',
    Challenging: 'bg-red-50 text-red-600',
}

export default function Itineraries() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'

    return (
        <PageLayout>
            <div dir={isRtl ? 'rtl' : 'ltr'}>
                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-orange-50 pt-20 pb-28">
                    <div className="pointer-events-none absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-100/30 blur-3xl" />
                    <div className="relative mx-auto max-w-4xl px-6 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-600 shadow-sm">
                            <Route className="h-3.5 w-3.5" />
                            {t('nav.itineraries')}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                            Curated Morocco
                            <span className="block text-orange-500">Itineraries</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
                            Browse expertly crafted travel routes designed by locals. From quick city breaks to multi-week adventures, find the perfect journey for your style.
                        </p>
                    </div>
                </section>

                {/* Filters */}
                <section className="relative -mt-10 mx-auto max-w-6xl px-6">
                    <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-zinc-100 bg-white p-4 shadow-lg shadow-zinc-100/60">
                        {['All', '1-3 Days', '4-7 Days', '1-2 Weeks', 'Easy', 'Moderate', 'Challenging'].map((filter) => (
                            <button key={filter} className={`rounded-full px-5 py-2.5 text-xs font-semibold transition ${filter === 'All' ? 'bg-zinc-900 text-white' : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Grid */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {itineraries.map((item) => (
                            <div key={item.title} className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative h-52 overflow-hidden">
                                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-zinc-800 backdrop-blur">
                                            <Clock className="h-3 w-3" /> {item.days} days
                                        </span>
                                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur ${difficultyColor[item.difficulty]}`}>
                                            {item.difficulty}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-amber-600 backdrop-blur">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {item.rating}
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
                                    <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">{item.description}</p>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {item.tags.map((tag) => (
                                            <span key={tag} className="rounded-full bg-zinc-50 px-2.5 py-1 text-[11px] font-medium text-zinc-500">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 transition hover:text-orange-600">
                                        Explore Itinerary <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-4xl px-6 pb-24">
                    <div className="rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-800 p-10 text-center sm:p-14">
                        <Sparkles className="mx-auto mb-4 h-8 w-8 text-orange-400" />
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">Want a custom itinerary?</h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                            Let our AI planner build a personalized route based on your interests, budget, and travel style.
                        </p>
                        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg">
                            Create Custom Itinerary <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}

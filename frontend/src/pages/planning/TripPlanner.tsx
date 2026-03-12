import { useTranslation } from 'react-i18next'
import { MapPin, Calendar, Compass, ArrowRight, Clock, Users } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'

const sampleItineraries = [
    {
        title: 'Fes Medina Discovery',
        duration: '3 days',
        image: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?q=80&w=600&auto=format&fit=crop',
        highlights: ['Bou Inania Madrasa', 'Tanneries', 'Artisan Workshops'],
    },
    {
        title: 'Imperial Cities Tour',
        duration: '7 days',
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600&auto=format&fit=crop',
        highlights: ['Fes', 'Meknes', 'Rabat', 'Marrakech'],
    },
    {
        title: 'Sahara & Mountains',
        duration: '5 days',
        image: 'https://plus.unsplash.com/premium_photo-1699536873907-9e9ff18868e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2FoYXJhJTIwJTI2JTIwTW91bnRhaW5zfGVufDB8fDB8fHww',
        highlights: ['Atlas Mountains', 'Merzouga', 'Todra Gorges'],
    },
]

export default function TripPlanner() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'

    return (
        <PageLayout>
            <div dir={isRtl ? 'rtl' : 'ltr'}>
                {/* Hero */}
                <section className="relative bg-white pt-20 pb-28">
                    <div className="relative mx-auto max-w-4xl px-6 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm">
                            <Compass className="h-3.5 w-3.5 text-orange-500" />
                            {t('nav.tripPlanner')}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                            Plan Your Perfect
                            <span className="block text-orange-500">Morocco Adventure</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
                            Tell us your preferences and we'll craft a personalized itinerary with trusted local recommendations, safe routes, and authentic experiences.
                        </p>
                    </div>
                </section>

                {/* Planner Form */}
                <section className="relative -mt-16 mx-auto max-w-5xl px-6">
                    <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-100/60 sm:p-12">
                        <h2 className="mb-8 text-2xl font-semibold text-zinc-900">Start Planning</h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">Destination</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                    <input type="text" placeholder="Fes, Morocco" className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-500/10" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">Travel Dates</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                    <input type="text" placeholder="Select dates" className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-500/10" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">Group Size</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                    <select className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-500/10">
                                        <option>Solo Traveler</option>
                                        <option>Couple (2)</option>
                                        <option>Small Group (3-5)</option>
                                        <option>Large Group (6+)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">Trip Duration</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                    <select className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-500/10">
                                        <option>1-3 days</option>
                                        <option>4-7 days</option>
                                        <option>1-2 weeks</option>
                                        <option>2+ weeks</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="mb-3 block text-sm font-medium text-zinc-700">Interests</label>
                            <div className="flex flex-wrap gap-2">
                                {['Culture', 'Gastronomy', 'Photography', 'Shopping', 'Adventure', 'Relaxation', 'History', 'Nature'].map((tag) => (
                                    <button key={tag} className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl">
                            Generate My Itinerary
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </section>

                {/* Sample Itineraries */}
                <section className="mx-auto max-w-5xl px-6 py-24">
                    <div className="mb-10 flex items-center gap-3">
                        <Compass className="h-5 w-5 text-orange-500" />
                        <h2 className="text-2xl font-semibold text-zinc-900">Popular Itineraries</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {sampleItineraries.map((item) => (
                            <div key={item.title} className="group overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                                <div className="relative h-48 overflow-hidden">
                                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
                                        {item.duration}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {item.highlights.map((h) => (
                                            <span key={h} className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-600">
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                    <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 transition hover:text-orange-600">
                                        View Details <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}

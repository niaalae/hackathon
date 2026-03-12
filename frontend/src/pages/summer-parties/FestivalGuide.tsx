import { useTranslation } from 'react-i18next'
import { Tent, MapPin, Calendar, ArrowRight, Sparkles, Music2 } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'

const festivals = [
    {
        title: 'Gnaoua World Music Festival',
        location: 'Essaouira',
        dates: 'June 20 – June 23',
        image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=600&auto=format&fit=crop',
        description: 'The legendary Gnaoua festival brings world-class musicians and Gnaoua masters together for four unforgettable days of spiritual music, fusion concerts, and street performances.',
        highlight: 'Must See',
    },
    {
        title: 'Fes Festival of World Sacred Music',
        location: 'Fes',
        dates: 'May 10 – May 18',
        image: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?q=80&w=600&auto=format&fit=crop',
        description: 'A global celebration of sacred music in the spiritual heart of Morocco. Sufi chanting, gospel choirs, and classical Eastern melodies within ancient palaces.',
        highlight: 'Cultural',
    },
    {
        title: 'Mawazine Festival',
        location: 'Rabat',
        dates: 'June 28 – July 6',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop',
        description: 'Africa\'s biggest music festival featuring international superstars and local artists. Free outdoor stages, VIP concerts, and a celebration of world music.',
        highlight: 'Major',
    },
    {
        title: 'Merzouga Desert Music Festival',
        location: 'Merzouga',
        dates: 'March 15 – March 17',
        image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d23?q=80&w=600&auto=format&fit=crop',
        description: 'Under the Saharan stars, experience nomadic music traditions alongside contemporary world music. Camel treks, sand-dune stages, and desert camping.',
        highlight: 'Unique',
    },
    {
        title: 'Tanjazz Festival',
        location: 'Tangier',
        dates: 'September 18 – September 21',
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600&auto=format&fit=crop',
        description: 'Tangier\'s annual jazz festival transforms the legendary port city with performances in palaces, gardens, and intimate jazz clubs overlooking the Mediterranean.',
        highlight: 'Jazz',
    },
    {
        title: 'Timitar Festival',
        location: 'Agadir',
        dates: 'July 10 – July 13',
        image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=600&auto=format&fit=crop',
        description: 'A vibrant celebration of Amazigh culture mixing traditional Berber music with international pop and rock acts. Free open-air concerts by the beach.',
        highlight: 'Free',
    },
]

const highlightColor: Record<string, string> = {
    'Must See': 'bg-red-50 text-red-600',
    Cultural: 'bg-indigo-50 text-indigo-600',
    Major: 'bg-orange-50 text-orange-600',
    Unique: 'bg-amber-50 text-amber-600',
    Jazz: 'bg-blue-50 text-blue-600',
    Free: 'bg-green-50 text-green-600',
}

export default function FestivalGuide() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'

    return (
        <PageLayout>
            <div dir={isRtl ? 'rtl' : 'ltr'}>
                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-red-50 pt-20 pb-28">
                    <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-red-100/30 blur-3xl" />
                    <div className="relative mx-auto max-w-4xl px-6 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-600 shadow-sm">
                            <Tent className="h-3.5 w-3.5" />
                            {t('nav.festivalGuide')}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                            Morocco Festival
                            <span className="block text-orange-500">Calendar 2025</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
                            From Gnaoua rhythms in Essaouira to sacred music in Fes, explore Morocco's vibrant festival scene with our comprehensive guide.
                        </p>
                    </div>
                </section>

                {/* Timeline / Grid */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <div className="mb-10 flex items-center gap-3">
                        <Music2 className="h-5 w-5 text-orange-500" />
                        <h2 className="text-2xl font-semibold text-zinc-900">Upcoming Festivals</h2>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2">
                        {festivals.map((fest) => (
                            <div key={fest.title} className="group flex overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative w-48 min-w-[192px] overflow-hidden max-sm:hidden">
                                    <img src={fest.image} alt={fest.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${highlightColor[fest.highlight]}`}>
                                            {fest.highlight}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-zinc-900">{fest.title}</h3>
                                    <div className="mt-2 flex flex-col gap-1">
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                                            <MapPin className="h-3 w-3 text-orange-400" /> {fest.location}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                                            <Calendar className="h-3 w-3 text-orange-400" /> {fest.dates}
                                        </span>
                                    </div>
                                    <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-500">{fest.description}</p>
                                    <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 transition hover:text-orange-600">
                                        Get Tickets <ArrowRight className="h-3.5 w-3.5" />
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
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">Plan your trip around a festival</h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                            Our AI planner can build a complete itinerary around your chosen festival — including accommodation, transport, and local tips.
                        </p>
                        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg">
                            Plan Festival Trip <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}

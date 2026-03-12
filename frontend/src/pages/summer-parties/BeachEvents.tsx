import { useTranslation } from 'react-i18next'
import { Waves, MapPin, Calendar, ArrowRight } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'

const events = [
    {
        title: 'Sunset Beach Festival',
        location: 'Essaouira Beach',
        date: 'Jun 15 – Jun 17',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
        description: 'Three days of music, art, and surfing on Essaouira\'s legendary windswept shores. Live DJs, local food vendors, and bonfire nights.',
    },
    {
        title: 'Full Moon Beach Party',
        location: 'Taghazout Bay',
        date: 'Jul 8',
        image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=600&auto=format&fit=crop',
        description: 'Dance under the full moon to the sound of Gnawa drums and electronic beats. A magical night where the desert meets the sea.',
    },
    {
        title: 'Mediterranean Chill',
        location: 'Al Hoceima Coast',
        date: 'Jul 22 – Jul 23',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=600&auto=format&fit=crop',
        description: 'Relax on the pristine Mediterranean beaches of Al Hoceima with live acoustic music, yoga sessions, and seafood tastings.',
    },
    {
        title: 'Surf & Soul Weekend',
        location: 'Imsouane Beach',
        date: 'Aug 5 – Aug 6',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
        description: 'Catch the longest wave in Africa and connect with fellow travelers over campfire stories, surf lessons, and coastal hikes.',
    },
    {
        title: 'Asilah Arts & Beach',
        location: 'Asilah',
        date: 'Aug 18 – Aug 20',
        image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=600&auto=format&fit=crop',
        description: 'Combine art gallery walks through Asilah\'s painted medina with afternoon beach relaxation and evening outdoor concerts.',
    },
    {
        title: 'Dakhla Lagoon Kitesurf',
        location: 'Dakhla',
        date: 'Sep 1 – Sep 3',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop',
        description: 'Join kitesurfers from around the world in one of the planet\'s best wind spots. Competitions, workshops, and desert camp vibes.',
    },
]

export default function BeachEvents() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'

    return (
        <PageLayout>
            <div dir={isRtl ? 'rtl' : 'ltr'}>
                {/* Hero */}
                <section className="relative bg-white pt-20 pb-28">
                    <div className="relative mx-auto max-w-4xl px-6 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm">
                            <Waves className="h-3.5 w-3.5 text-orange-500" />
                            {t('nav.beachEvents')}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                            Morocco's Best
                            <span className="block text-orange-500">Beach Events</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
                            From Atlantic surf festivals to Mediterranean chill weekends, discover unforgettable coastal events across Morocco's stunning coastline.
                        </p>
                    </div>
                </section>

                {/* Events Grid */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <div key={event.title} className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative h-52 overflow-hidden">
                                    <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-lg font-semibold text-zinc-900">{event.title}</h3>
                                    <div className="mt-2 flex flex-col gap-1">
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                                            <MapPin className="h-3 w-3 text-orange-400" /> {event.location}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                                            <Calendar className="h-3 w-3 text-orange-400" /> {event.date}
                                        </span>
                                    </div>
                                    <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-500">{event.description}</p>
                                    <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 transition hover:text-orange-600">
                                        Learn More <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-4xl px-6 pb-24">
                    <div className="rounded-3xl bg-zinc-900 p-10 text-center sm:p-14">
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">Never miss a beach event</h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                            Subscribe to get early access to event tickets and exclusive beach party invites across Morocco.
                        </p>
                        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg">
                            Get Event Alerts <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}

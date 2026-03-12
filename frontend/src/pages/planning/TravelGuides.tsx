import { useTranslation } from 'react-i18next'
import { BookOpen, Shield, Utensils, Navigation, Languages, Landmark, ArrowRight } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'

const guides = [
    {
        icon: <Landmark className="h-6 w-6 text-orange-500" />,
        title: 'Culture & Heritage',
        description: 'Discover Morocco\'s rich cultural tapestry — from UNESCO medinas and ancient madrasas to royal palaces and sacred tombs.',
        articles: 12,
    },
    {
        icon: <Utensils className="h-6 w-6 text-orange-500" />,
        title: 'Food & Dining',
        description: 'Navigate Morocco\'s incredible cuisine — from street food favorites like msemen and harira to fine-dining riads and cooking classes.',
        articles: 8,
    },
    {
        icon: <Shield className="h-6 w-6 text-orange-500" />,
        title: 'Safety & Scam Prevention',
        description: 'Stay safe with practical alerts about common tourist issues, fake guides, overcharging patterns, and pressure-selling zones.',
        articles: 15,
    },
    {
        icon: <Navigation className="h-6 w-6 text-orange-500" />,
        title: 'Navigation & Transport',
        description: 'Master Morocco\'s transport system — from navigating the medina on foot to booking trains, grand taxis, and airport transfers.',
        articles: 10,
    },
    {
        icon: <Languages className="h-6 w-6 text-orange-500" />,
        title: 'Language & Etiquette',
        description: 'Essential phrases in Darija and French, cultural etiquette tips, and local communication norms to help you connect authentically.',
        articles: 6,
    },
    {
        icon: <BookOpen className="h-6 w-6 text-orange-500" />,
        title: 'First-Time Visitor',
        description: 'Everything you need for your first Morocco trip — visa, currency, weather, packing tips, must-knows before arrival, and more.',
        articles: 14,
    },
]

const featuredGuides = [
    {
        title: 'The Ultimate Fes Medina Survival Guide',
        image: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?q=80&w=800&auto=format&fit=crop',
        readTime: '12 min read',
        category: 'Navigation',
    },
    {
        title: 'Top 20 Foods You Must Try in Morocco',
        image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=800&auto=format&fit=crop',
        readTime: '8 min read',
        category: 'Food',
    },
    {
        title: 'How to Avoid Tourist Scams in Fes',
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800&auto=format&fit=crop',
        readTime: '6 min read',
        category: 'Safety',
    },
]

export default function TravelGuides() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'

    return (
        <PageLayout>
            <div dir={isRtl ? 'rtl' : 'ltr'}>
                {/* Hero */}
                <section className="relative bg-white pt-20 pb-28">
                    <div className="relative mx-auto max-w-4xl px-6 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm">
                            <BookOpen className="h-3.5 w-3.5 text-orange-500" />
                            {t('nav.travelGuides')}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                            Your Morocco
                            <span className="block text-orange-500">Travel Library</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
                            Expert guides written by locals covering everything from cultural etiquette to street food secrets, helping you travel smarter and safer.
                        </p>
                    </div>
                </section>

                {/* Featured */}
                <section className="relative -mt-14 mx-auto max-w-6xl px-6">
                    <div className="grid gap-6 sm:grid-cols-3">
                        {featuredGuides.map((g) => (
                            <div key={g.title} className="group overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-lg shadow-zinc-100/60 transition-all hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative h-44 overflow-hidden">
                                    <img src={g.image} alt={g.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-zinc-700 backdrop-blur">
                                        {g.category}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-[15px] font-semibold leading-snug text-zinc-900">{g.title}</h3>
                                    <p className="mt-2 text-xs text-zinc-400">{g.readTime}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Categories */}
                <section className="mx-auto max-w-6xl px-6 py-24">
                    <h2 className="mb-10 text-2xl font-semibold text-zinc-900">Browse by Category</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {guides.map((guide) => (
                            <div key={guide.title} className="group flex flex-col rounded-2xl border border-zinc-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                                    {guide.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-900">{guide.title}</h3>
                                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">{guide.description}</p>
                                <div className="mt-5 flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-400">{guide.articles} articles</span>
                                    <button className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 transition hover:text-orange-600">
                                        Browse <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-4xl px-6 pb-24">
                    <div className="rounded-3xl bg-zinc-900 p-10 text-center sm:p-14">
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">Get personalized travel advice</h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                            Our chatbot can answer your specific questions about Morocco travel — from visa requirements to hidden gems.
                        </p>
                        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg">
                            Ask a Question <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}

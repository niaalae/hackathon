import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Facebook, Twitter, Instagram, Github, Mail, ArrowRight } from 'lucide-react'

export default function Footer() {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.language === 'ar'

    return (
        <footer className="w-full bg-white border-t border-gray-100 pt-20 pb-10" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-gray-50">

                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="flex items-center gap-2 group mb-6">
                            <span className="text-orange-500 transition-transform duration-200 group-hover:scale-110">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 12L21 4L17 12L21 20L3 12Z" />
                                </svg>
                            </span>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">
                                Trippple
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs transition-colors hover:text-gray-700">
                            {t('footer.tagline')}
                        </p>
                        <div className="flex items-center gap-4 mt-8">
                            {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-all duration-200"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-6">
                            {t('footer.quickLinks')}
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { label: t('nav.home'), to: '/' },
                                { label: t('nav.planning'), to: '/planning/trip-planner' },
                                { label: t('nav.pricing'), to: '/pricing' },
                                { label: t('nav.faqs'), to: '/faqs' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link to={item.to} className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-6">
                            {t('footer.legal')}
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                                    {t('footer.privacy')}
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                                    {t('footer.terms')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-4">
                        <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-6">
                            {t('footer.newsletter')}
                        </h4>
                        <p className="text-sm text-gray-500 mb-6 tracking-tight">
                            {t('footer.newsletterDesc')}
                        </p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder={t('footer.newsletterPlaceholder')}
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white focus:border-orange-500 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
                            >
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-gray-400 font-medium tracking-tight">
                        {t('footer.rights')}
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Mail size={14} className="text-orange-500/60" />
                            <span>hello@trippple.com</span>
                        </div>
                        <div className="h-4 w-px bg-gray-100 hidden md:block"></div>
                        <p className="text-xs text-gray-400 font-medium">
                            {t('footer.bottomTagline')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

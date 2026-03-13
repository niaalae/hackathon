import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '@/components/Navbar'

export default function NotFound() {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-sm px-4 pt-16">
                <h1 className="text-8xl md:text-9xl font-bold text-orange-500 selection:bg-orange-100 selection:text-orange-600">404</h1>
                <div className="h-1.5 w-20 rounded-full bg-orange-500 my-6 md:my-8 shadow-[0_0_15px_rgba(249,115,22,0.3)]"></div>
                <p className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">{t('404.title')}</p>
                <p className="text-sm md:text-base mt-4 text-gray-500/90 max-w-md text-center leading-relaxed">
                    {t('404.description')}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                    <Link
                        to="/"
                        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 px-8 py-3.5 text-white font-semibold rounded-2xl active:scale-95 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center justify-center"
                    >
                        {t('404.returnHome')}
                    </Link>
                    <Link
                        to="/faqs"
                        className="w-full sm:w-auto border border-gray-200 px-8 py-3.5 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center"
                    >
                        {t('404.support')}
                    </Link>
                </div>
            </main>
        </div>
    )
}

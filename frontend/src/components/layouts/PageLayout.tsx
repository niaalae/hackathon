import Navbar from '../Navbar'
import Footer from '../Footer'

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-white">
            <div className="relative z-20">
                <Navbar />
            </div>
            <main className="relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    )
}

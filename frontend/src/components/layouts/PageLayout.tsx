import Navbar from '../Navbar'
import Footer from '../Footer'

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Fixed navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      {/* Push content below navbar — adjust pt value to match your navbar height */}
      <main className="relative z-10 flex-1 pt-18 lg:pt-22">
        {children}
      </main>

      <Footer />
    </div>
  )
}
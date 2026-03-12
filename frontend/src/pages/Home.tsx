import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProblemSection from "../components/ProblemSection";
import FeaturesSection from "../components/FeaturesSection";
import MVPSection from "../components/MVPSection";
import CTASection from "../components/CTASection";

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-100px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-[-80px] top-[140px] h-[280px] w-[280px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/3 h-[320px] w-[320px] rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <MVPSection />
        <CTASection />
      </div>
    </div>
  );
}

export default Home;
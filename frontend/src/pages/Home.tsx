import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CollaborationSection from "../components/CollaborationSection";
import FeaturesSection from "../components/FeaturesSection";
import MVPSection from "../components/MVPSection";
import CTASection from "../components/CTASection";

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#eaf4fb]">
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <CollaborationSection />
        <FeaturesSection />
        <MVPSection />
        <CTASection />
      </div>
    </div>
  );
}

export default Home;
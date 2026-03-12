import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CollaborationSection from "../components/CollaborationSection";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#eaf4fb]">
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <CollaborationSection />
        <PricingSection />
        <FAQSection />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
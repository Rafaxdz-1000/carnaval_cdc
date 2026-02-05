import { useEffect } from "react";
import { Confetti } from "@/components/Confetti";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { registrarAnalytics } from "@/lib/supabaseService";

const Index = () => {
  // Registrar visualização da página
  useEffect(() => {
    registrarAnalytics("page_view", "home");
    sendGTMEvent({
      event: "lp_page_view",
      event_category: "Page View",
      event_action: "page_view",
      event_label: "home",
      page_section: "home",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Confetti />
      <UrgencyBanner />
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

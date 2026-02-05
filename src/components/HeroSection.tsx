import { useState } from "react";
import { ArrowRight, Sparkles, Users, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormModal } from "./LeadFormModal";
import { registrarAnalytics } from "@/lib/supabaseService";
import { trackButtonClick } from "@/lib/gtmAnalytics";
import heroImage from "@/assets/hero-carnival.jpg";

export const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    registrarAnalytics("form_open", "hero");
    trackButtonClick("hero", "QUERO MEU DIAGNÓSTICO + SITE GRÁTIS");
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 border border-secondary/30 animate-bounce-in">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>DIAGNÓSTICO DIGITAL GRÁTIS</span>
              <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-bold">
                NOVO
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Descubra se seu negócio está{" "}
              <span className="text-gradient">preparado</span>
              <br />
              para o{" "}
              <span className="text-primary">Carnaval</span>!
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Faça nosso diagnóstico digital gratuito e ainda ganhe um{" "}
              <strong className="text-foreground">site grátis em até 3 dias</strong> — 
              tudo para você aproveitar a temporada mais lucrativa do ano!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleOpenModal}
                size="lg"
                className="gradient-cta text-primary-foreground font-bold text-lg px-8 py-6 rounded-xl hover:scale-105 transition-all shadow-carnival animate-pulse-glow group"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                QUERO MEU DIAGNÓSTICO + SITE GRÁTIS
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Mais de <strong className="text-foreground">647 diagnósticos</strong> realizados esta semana
              </p>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 md:gap-12">
              <StatItem icon={<Users className="w-5 h-5" />} value="1.000+" label="Empresas Beneficiadas" />
              <StatItem icon={<TrendingUp className="w-5 h-5" />} value="3x" label="Aumento em Vendas" />
              <StatItem icon={<Zap className="w-5 h-5" />} value="24/7" label="Automação Ativa" />
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 rounded-full bg-secondary/30 blur-xl animate-float" />
        <div className="hidden md:block absolute bottom-32 right-16 w-32 h-32 rounded-full bg-accent/20 blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="hidden lg:block absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-primary/20 blur-xl animate-float" style={{ animationDelay: "2s" }} />
      </section>

      <LeadFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

const StatItem = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border w-full sm:w-auto">
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-carnival flex items-center justify-center text-primary-foreground flex-shrink-0">
      {icon}
    </div>
    <div className="text-left min-w-0">
      <p className="text-lg sm:text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

import { useState } from "react";
import { ArrowRight, Sparkles, Gift, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormModal } from "./LeadFormModal";
import { registrarAnalytics } from "@/lib/supabaseService";
import { trackButtonClick } from "@/lib/gtmAnalytics";

export const CTASection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    registrarAnalytics("form_open", "cta");
    trackButtonClick("cta", "QUERO MEU DIAGNÓSTICO + SITE GRÁTIS!");
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 gradient-carnival opacity-90" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary-foreground/30 animate-bounce-in">
              <Gift className="w-4 h-4" />
              <span>OFERTA POR TEMPO LIMITADO</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Não Fique Para Trás no{" "}
              <span className="underline decoration-4 decoration-secondary">
                Bloco da Concorrência!
              </span>
            </h2>

            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Descubra se seu negócio está preparado para o Carnaval com nosso diagnóstico digital gratuito 
              e ainda ganhe um <strong>site grátis em até 3 dias</strong> — tudo para você aproveitar a temporada mais lucrativa do ano!
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <FeatureTag icon={<Gift className="w-4 h-4" />} text="100% Gratuito" />
              <FeatureTag icon={<Clock className="w-4 h-4" />} text="Site em 3 Dias" />
              <FeatureTag icon={<Shield className="w-4 h-4" />} text="Diagnóstico Completo" />
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleOpenModal}
              size="lg"
              className="bg-primary-foreground text-primary font-bold text-base sm:text-lg px-6 sm:px-12 py-5 sm:py-7 rounded-xl hover:scale-105 transition-all shadow-2xl group w-full sm:w-auto"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              QUERO MEU DIAGNÓSTICO + SITE GRÁTIS!
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="mt-6 text-sm opacity-80">
              É rápido, fácil e feito especialmente para pequenos negócios e e-commerces!
            </p>
          </div>
        </div>

        {/* Floating Decorations */}
        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 rounded-full bg-primary-foreground/20 blur-xl animate-float" />
        <div className="hidden md:block absolute bottom-10 right-20 w-32 h-32 rounded-full bg-secondary/30 blur-2xl animate-float" style={{ animationDelay: "1.5s" }} />
      </section>

      <LeadFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

const FeatureTag = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm px-4 py-2 rounded-full">
    {icon}
    <span className="font-medium">{text}</span>
  </div>
);

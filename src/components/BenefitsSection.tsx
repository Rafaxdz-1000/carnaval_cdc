import { useState } from "react";
import { Eye, Clock, TrendingUp, Target, ArrowRight, CheckCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormModal } from "./LeadFormModal";
import { registrarAnalytics } from "@/lib/supabaseService";
import { trackButtonClick } from "@/lib/gtmAnalytics";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const benefits = [
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Raio-X do Seu Negócio",
    description: "Identifique exatamente onde está o gargalo que trava seu faturamento. Pare de trabalhar no escuro e descubra onde o dinheiro está vazando para agir no lugar certo.",
    color: "primary",
    features: ["Apontamento de Gargalos", "Visibilidade Operacional", "Ação Direcionada"],
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Visão de Automação Personalizada",
    description: "Descubra quais tarefas repetitivas estão roubando seu tempo. Saiba exatamente quais partes da sua rotina podem rodar no piloto automático para você voltar a focar na estratégia.",
    color: "secondary",
    features: ["Identificação de Tarefas", "Automação Inteligente", "Economia de Tempo"],
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Score de Maturidade Digital",
    description: "Entenda como o mercado enxerga sua empresa hoje versus seus concorrentes. Descubra o passo mais rápido (Tráfego ou Site) para inverter o jogo e sair da invisibilidade digital.",
    color: "accent",
    features: ["Análise Competitiva", "Posicionamento Digital", "Estratégia de Visibilidade"],
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Diretriz de Aquisição de Clientes",
    description: "Saiba qual é o motor de vendas ideal para o seu momento. Descubra se deve focar em tráfego pago agora ou se primeiro precisa organizar a casa para não queimar dinheiro à toa.",
    color: "primary",
    features: ["Processo Previsível", "Estratégia de Vendas", "Crescimento Sustentável"],
  },
];

const colorClasses = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
};

export const BenefitsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    registrarAnalytics("form_open", "benefits");
    trackButtonClick("benefits", "QUERO MEU DIAGNÓSTICO + SITE GRÁTIS!");
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 bg-card relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-2 gradient-carnival" />
        
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
           
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              O Que Você Vai Receber no{" "}
              <span className="text-gradient">Diagnóstico Digital</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Análise completa do seu negócio + site grátis em até 3 dias para você aproveitar o Carnaval
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-background rounded-2xl p-6 sm:p-8 border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl ${colorClasses[benefit.color as keyof typeof colorClasses]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {benefit.icon}
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {benefit.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {benefit.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {benefit.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-muted/50 text-foreground text-xs px-3 py-1.5 rounded-full"
                    >
                      <CheckCircle className="w-3 h-3 text-primary" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="text-center mb-8">
              
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Dúvidas sobre seu{" "}
                <span className="text-gradient">Diagnóstico e Site</span>?
              </h3>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-background border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  O que exatamente eu vou receber no meu e-mail em até 3 dias?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  <p className="mb-3">Você receberá duas coisas:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong className="text-foreground">Seu Relatório de Maturidade Digital</strong> com a análise do gargalo da sua empresa e o plano de ação sugerido.
                    </li>
                    <li>
                      <strong className="text-foreground">Uma Versão Demonstrativa do seu Site</strong>, já criada e publicada em um link temporário, com as informações básicas que você nos passou no formulário. É uma "prova real" de como sua empresa pode se posicionar na internet.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-background border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  Esse site que vou receber já é o meu site oficial e definitivo?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  <p className="mb-3">
                    Ele é um <strong className="text-foreground">modelo funcional (MVP)</strong> para você visualizar o potencial do seu negócio online. Ele virá com um endereço temporário e com os textos/dados que captamos no diagnóstico.
                  </p>
                  <p>
                    Para conectar um endereço próprio, hospedá-lo definitivamente ou fazer personalizações avançadas de design e funcionalidades, isso é um serviço à parte contratado através do Clube dos Cisnes.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-background border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  Por que o resultado leva até 3 dias úteis para chegar?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  <p>
                    Diferente de testes automáticos, este diagnóstico é <strong className="text-foreground">analisado pessoalmente pela nossa equipe</strong>. Além disso, nós usamos esse tempo para construir manualmente a primeira versão do seu site e desenhar um plano que faça sentido para a sua realidade. Preferimos gastar um tempo estudando seu caso para lhe entregar algo concreto e visual do que apenas uma resposta automática.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-background border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  Minha empresa é pequena ou "não entendo nada de tecnologia". Isso serve para mim?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  <p className="mb-3">
                    <strong className="text-foreground">Sim, foi feito exatamente para você.</strong> O objetivo do diagnóstico e do site demonstrativo é mostrar como ferramentas de IA e Web simplificam sua vida.
                  </p>
                  <p>
                    Se a solução final envolver aplicativos ou automações complexas, toda a parte técnica fica com o Clube dos Cisnes; você só precisa focar em atender seus clientes e vender.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-background border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  Sou obrigado a contratar o Clube dos Cisnes após ver o site?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  <p className="mb-3">
                    <strong className="text-foreground">De forma alguma.</strong> O diagnóstico e o site demonstrativo são ferramentas de consultoria para lhe dar clareza. O site ficará no ar por tempo limitado para sua visualização.
                  </p>
                  <p>
                    Se você gostar do que viu e quiser oficializar esse projeto, expandir para um aplicativo ou rodar tráfego pago, ficaremos felizes em apresentar uma proposta comercial para tornar isso definitivo.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              onClick={handleOpenModal}
              size="lg"
              className="gradient-cta text-primary-foreground font-bold text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-6 rounded-xl hover:scale-105 transition-all shadow-carnival group w-full sm:w-auto"
            >
              QUERO MEU DIAGNÓSTICO + SITE GRÁTIS!
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <LeadFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

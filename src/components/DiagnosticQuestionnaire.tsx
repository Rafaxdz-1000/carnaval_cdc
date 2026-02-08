import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { salvarRespostasQuestionario, registrarAnalytics } from "@/lib/supabaseService";
import { sendGTMEvent, trackButtonClick } from "@/lib/gtmAnalytics";
import { useNavigate, useSearchParams } from "react-router-dom";

const questions = [
  {
    id: 1,
    title: "Sobre Aquisição de Clientes",
    subtitle: "Foco: Tráfego Pago e Sites",
    question: "Hoje, se você precisasse dobrar o número de clientes na próxima semana, qual seria sua principal ação?",
    options: [
      {
        value: "A",
        label: "Dependeria exclusivamente de indicações (boca a boca) ou de quem passa na frente da loja."
      },
      {
        value: "B",
        label: "Postaria mais fotos no Instagram/Facebook, mas sem impulsionar (orgânico)."
      },
      {
        value: "C",
        label: "Tenho uma lista de contatos antigos e ligaria um por um."
      },
      {
        value: "D",
        label: "Não saberia exatamente o que fazer para ter resultado rápido."
      }
    ]
  },
  {
    id: 2,
    title: "Sobre Processos Internos e Burocracia",
    subtitle: "Foco: Apps e IA",
    question: "Qual tarefa operacional hoje consome a maior parte do tempo da sua equipe (ou o seu) e impede de focar nas vendas?",
    options: [
      {
        value: "A",
        label: "Responder perguntas repetitivas de clientes no WhatsApp o dia todo."
      },
      {
        value: "B",
        label: "Preencher documentos, gerar contratos, orçamentos ou emitir notas manualmente."
      },
      {
        value: "C",
        label: "Controle de estoque, agenda ou financeiro feito no papel ou planilhas soltas."
      },
      {
        value: "D",
        label: "Treinar funcionários novos sobre como a empresa funciona."
      }
    ]
  },
  {
    id: 3,
    title: "Sobre Presença Digital",
    subtitle: "Foco: Site e Posicionamento",
    question: "Quando um cliente tenta achar sua empresa no Google hoje, o que ele encontra?",
    options: [
      {
        value: "A",
        label: "Apenas meu endereço no mapa (Google Meu Negócio) ou redes sociais desatualizadas."
      },
      {
        value: "B",
        label: "Não encontra nada, não apareço nas pesquisas."
      },
      {
        value: "C",
        label: "Encontra um site antigo que não abre direito no celular."
      },
      {
        value: "D",
        label: "Encontra meus concorrentes antes de mim."
      }
    ]
  },
  {
    id: 4,
    title: "Sobre Gestão de Dados",
    subtitle: "Foco: Apps e Inteligência de Dados",
    question: "Se eu te perguntasse agora quem são seus 10 melhores clientes e qual o produto mais vendido no último mês, como você buscaria essa informação?",
    options: [
      {
        value: "A",
        label: "\"De cabeça\" ou na intuição, não tenho isso anotado."
      },
      {
        value: "B",
        label: "Precisaria de um tempo para somar as comandas de papel ou cadernos."
      },
      {
        value: "C",
        label: "Tenho várias planilhas diferentes, teria que cruzar os dados manualmente."
      },
      {
        value: "D",
        label: "Tenho um sistema, mas ele é confuso e não me dá esse relatório."
      }
    ]
  },
  {
    id: 5,
    title: "Visão de Futuro",
    subtitle: "Pergunta de Fechamento",
    question: "Para os próximos 6 meses, o que impediria sua empresa de crescer?",
    options: [
      {
        value: "A",
        label: "Falta de clientes novos chegando (Funil vazio)."
      },
      {
        value: "B",
        label: "Bagunça interna: vendemos bem, mas a operação é caótica e perdemos prazos/dados."
      },
      {
        value: "C",
        label: "Falta de tempo: sou \"eu-quipe\" e faço tudo sozinho."
      },
      {
        value: "D",
        label: "Concorrência desleal: outros parecem mais modernos/profissionais que eu."
      }
    ]
  }
];

export const DiagnosticQuestionnaire = () => {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("leadId");
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (answers[questions[currentQuestion].id]) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        // Registrar progresso no questionário
        registrarAnalytics("questionnaire_progress", "questionnaire", leadId || undefined, {
          question_number: currentQuestion + 2,
          total_questions: questions.length,
        });
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!leadId) {
      console.error("Lead ID não encontrado");
      return;
    }

    setIsSubmitting(true);

    try {
      // Salvar respostas no banco
      const resultado = await salvarRespostasQuestionario(leadId, answers);

      if (resultado.success) {
        await registrarAnalytics("questionnaire_complete", "questionnaire", leadId);
        
        // Enviar evento GTM
        sendGTMEvent({
          event: "lp_questionnaire_complete",
          event_category: "Conversion",
          event_action: "questionnaire_complete",
          event_label: "questionnaire",
          lead_id: leadId || undefined,
          value: 1,
        });
        setIsComplete(true);
      } else {
        console.error("Erro ao salvar respostas:", resultado.error);
        alert("Erro ao salvar respostas. Tente novamente.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Erro ao processar questionário:", error);
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full gradient-carnival flex items-center justify-center mb-6 mx-auto animate-bounce-in">
                <CheckCircle className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Questionário Concluído!
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Obrigado por responder todas as perguntas. Nossa equipe está analisando suas respostas e você receberá seu diagnóstico completo em até 3 dias úteis no email informado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const hasAnswer = !!answers[currentQ.id];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Pergunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-2 border-border shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full gradient-carnival flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-lg">
                  {currentQuestion + 1}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl">{currentQ.title}</CardTitle>
                <CardDescription className="text-sm mt-1">{currentQ.subtitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {currentQ.question}
            </p>

            <RadioGroup
              value={answers[currentQ.id] || ""}
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {currentQ.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
                  onClick={() => handleAnswer(option.value)}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`q${currentQ.id}-${option.value}`}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={`q${currentQ.id}-${option.value}`}
                    className="flex-1 cursor-pointer text-foreground leading-relaxed"
                  >
                    <span className="font-semibold mr-2">{option.value})</span>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {currentQuestion > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 sm:flex-initial"
                  disabled={isSubmitting}
                >
                  Voltar
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                disabled={!hasAnswer || isSubmitting}
                className="flex-1 gradient-cta text-primary-foreground font-bold group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : isLastQuestion ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Finalizar Questionário
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Próxima Pergunta
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

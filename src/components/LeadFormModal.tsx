import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { salvarLead, registrarAnalytics } from "@/lib/supabaseService";
import { trackButtonClick } from "@/lib/gtmAnalytics";

interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const companyPortes = [
  "MEI / Autônomo",
  "Microempresa (até 9 funcionários)",
  "Pequena Empresa (10-49 funcionários)",
  "Média Empresa (50-99 funcionários)",
  "Grande Empresa (100+ funcionários)",
];

const companyNiches = [
  "E-commerce / Loja Virtual",
  "Varejo / Loja Física",
  "Serviços",
  "Alimentação / Restaurante",
  "Beleza / Estética",
  "Turismo / Hotelaria",
  "Saúde / Bem-estar",
  "Educação",
  "Tecnologia",
  "Outro",
];

const tiposServicos = [
  "Consultoria",
  "Design Gráfico / Branding",
  "Desenvolvimento Web / Apps",
  "Marketing Digital / Social Media",
  "Fotografia / Vídeo",
  "Redação / Copywriting",
  "Tradução",
  "Aulas Particulares / Ensino",
  "Personal Trainer / Fitness",
  "Beleza / Estética (autônomo)",
  "Massagem / Terapias",
  "Limpeza / Organização",
  "Manutenção / Reparos",
  "Contabilidade / Financeiro",
  "Jurídico / Advocacia",
  "Coaching / Mentoria",
  "Eventos / Festas",
  "Culinária / Gastronomia",
  "Artesanato / Handmade",
  "Outro",
];

export const LeadFormModal = ({ open, onOpenChange }: LeadFormModalProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [semEmpresa, setSemEmpresa] = useState(false);
  const [ofereceServico, setOfereceServico] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    celular: "",
    email: "",
    instagram: "",
    facebook: "",
    empresa: "",
    porte: "",
    nicho: "",
    tipoServico: "",
  });

  // Registrar quando o modal é aberto
  useEffect(() => {
    if (open) {
      registrarAnalytics("form_open", "modal");
      trackButtonClick("modal", "Formulário Aberto");
    } else {
      // Resetar formulário quando o modal fecha
      setSemEmpresa(false);
      setOfereceServico(false);
      setError(null);
      setFormData({ nome: "", celular: "", email: "", instagram: "", facebook: "", empresa: "", porte: "", nicho: "", tipoServico: "" });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Registrar tentativa de submit
    await registrarAnalytics("form_submit", "modal");

    // Salvar lead no Supabase
    const resultado = await salvarLead({
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      celular: formData.celular,
      instagram: formData.instagram.trim() || null,
      facebook: formData.facebook.trim() || null,
      empresa: formData.empresa.trim() || null,
      porte_empresa: formData.porte || null,
      nicho_empresa: formData.nicho || null,
      sem_empresa: semEmpresa,
      oferece_servico: semEmpresa ? ofereceServico : null,
      tipo_servico: semEmpresa && ofereceServico ? formData.tipoServico || null : null,
    });

    setIsSubmitting(false);

    if (resultado.success && resultado.data) {
      setIsSuccess(true);
      
      // Registrar sucesso
      await registrarAnalytics("form_submit", "modal", resultado.data.id, { success: true });
      
      // Redirecionar para o questionário após 2 segundos
      setTimeout(() => {
        onOpenChange(false);
        setIsSuccess(false);
        setSemEmpresa(false);
        setError(null);
        setFormData({ nome: "", celular: "", email: "", instagram: "", facebook: "", empresa: "", porte: "", nicho: "", tipoServico: "" });
        setOfereceServico(false);
        // Redirecionar para o questionário com o ID do lead
        navigate(`/questionario?leadId=${resultado.data.id}`);
      }, 2000);
    } else {
      setError(resultado.error || "Erro ao salvar dados. Tente novamente.");
      // Registrar erro
      await registrarAnalytics("form_error", "modal", undefined, { error: resultado.error });
    }
  };

  const handleSemEmpresaChange = (checked: boolean) => {
    setSemEmpresa(checked);
    if (checked) {
      setFormData({ ...formData, empresa: "", porte: "", nicho: "" });
      setOfereceServico(false);
      setFormData(prev => ({ ...prev, tipoServico: "" }));
    }
  };

  const handleOfereceServicoChange = (checked: boolean) => {
    setOfereceServico(checked);
    if (!checked) {
      setFormData(prev => ({ ...prev, tipoServico: "" }));
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 rounded-full gradient-carnival flex items-center justify-center mb-4 animate-bounce-in">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Parabéns!</h3>
            <p className="text-muted-foreground mb-4">
              Seu cadastro foi realizado com sucesso!
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-4 w-full">
              <p className="text-sm text-muted-foreground text-center">
                Nossa equipe entrará em contato em breve para realizar seu diagnóstico digital e iniciar a criação do seu site grátis!
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Verifique seu email e WhatsApp para mais informações.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full gradient-carnival flex items-center justify-center mb-3 shadow-carnival">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            🎭 DIAGNÓSTICO DIGITAL GRÁTIS!
          </DialogTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Descubra se seu negócio está preparado para o Carnaval e ganhe um site grátis em até 3 dias
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mt-3">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              💡 <strong>Importante:</strong> O Instagram profissional, Facebook profissional e as informações da empresa serão usados para construir e personalizar seu site grátis em até 3 dias!
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-foreground">Nome Completo *</Label>
            <Input
              id="nome"
              placeholder="Seu nome"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="celular" className="text-foreground">Celular (WhatsApp) *</Label>
            <Input
              id="celular"
              placeholder="(00) 00000-0000"
              required
              value={formData.celular}
              onChange={(e) => setFormData({ ...formData, celular: formatPhone(e.target.value) })}
              className="bg-background border-border focus:ring-primary"
              maxLength={15}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">E-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-foreground">Instagram Profissional</Label>
            <Input
              id="instagram"
              type="text"
              placeholder="@seuinstagram ou link do perfil"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="bg-background border-border focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Essas informações serão usadas para construir seu site grátis
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook" className="text-foreground">Facebook Profissional</Label>
            <Input
              id="facebook"
              type="text"
              placeholder="Link do seu perfil ou página do Facebook"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="semEmpresa"
              checked={semEmpresa}
              onCheckedChange={handleSemEmpresaChange}
            />
            <Label
              htmlFor="semEmpresa"
              className="text-sm font-normal cursor-pointer text-foreground"
            >
              Não tenho empresa
            </Label>
          </div>

          {semEmpresa && (
            <>
              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="ofereceServico"
                  checked={ofereceServico}
                  onCheckedChange={handleOfereceServicoChange}
                />
                <Label
                  htmlFor="ofereceServico"
                  className="text-sm font-normal cursor-pointer text-foreground"
                >
                  Ofereço um serviço
                </Label>
              </div>

              {ofereceServico && (
                <div className="space-y-2">
                  <Label className="text-foreground">Tipo de Serviço *</Label>
                  <Select
                    required={ofereceServico}
                    value={formData.tipoServico}
                    onValueChange={(value) => setFormData({ ...formData, tipoServico: value })}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Selecione o tipo de serviço" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {tiposServicos.map((servico) => (
                        <SelectItem key={servico} value={servico}>
                          {servico}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="empresa" className="text-foreground">Nome da Empresa</Label>
            <Input
              id="empresa"
              placeholder="Nome da sua empresa"
              value={formData.empresa}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              className="bg-background border-border focus:ring-primary"
              disabled={semEmpresa}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Porte da Empresa {!semEmpresa && "*"}</Label>
            <Select
              required={!semEmpresa}
              value={formData.porte}
              onValueChange={(value) => setFormData({ ...formData, porte: value })}
              disabled={semEmpresa}
            >
              <SelectTrigger className="bg-background border-border disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue placeholder="Selecione o porte" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {companyPortes.map((porte) => (
                  <SelectItem key={porte} value={porte}>
                    {porte}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Nicho / Segmento {!semEmpresa && "*"}</Label>
            <Select
              required={!semEmpresa}
              value={formData.nicho}
              onValueChange={(value) => setFormData({ ...formData, nicho: value })}
              disabled={semEmpresa}
            >
              <SelectTrigger className="bg-background border-border disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue placeholder="Selecione o nicho" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {companyNiches.map((nicho) => (
                  <SelectItem key={nicho} value={nicho}>
                    {nicho}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full gradient-cta text-primary-foreground font-bold text-lg py-6 rounded-xl hover:scale-[1.02] transition-transform shadow-carnival"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                QUERO MEU DIAGNÓSTICO + SITE GRÁTIS
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            🔒 Seus dados estão seguros. Não compartilhamos com terceiros.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

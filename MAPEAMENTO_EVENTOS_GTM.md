# 📊 Mapeamento de Eventos - Google Tag Manager e Google Ads

## 🎯 Eventos Mapeados

Todos os eventos são enviados automaticamente para o **dataLayer** do Google Tag Manager e são compatíveis com Google Ads.

---

## 📋 Lista Completa de Eventos

### 1. **lp_page_view**
**Quando:** Usuário visualiza a página inicial  
**Categoria:** Page View  
**Ação:** Visualização da landing page  
**Label:** "home"  
**Google Ads:** Compatível com evento de visualização

**Onde é disparado:**
- `src/pages/Index.tsx` - Quando a página carrega

---

### 2. **lp_form_start** (lp_form_open)
**Quando:** Usuário abre o formulário  
**Categoria:** Engagement  
**Ação:** Abertura do formulário  
**Label:** Seção onde foi aberto (hero, cta, benefits, modal)  
**Google Ads:** Evento "form_start" para conversão

**Onde é disparado:**
- `src/components/HeroSection.tsx` - Botão principal
- `src/components/CTASection.tsx` - Seção CTA
- `src/components/BenefitsSection.tsx` - Seção de benefícios
- `src/components/LeadFormModal.tsx` - Quando modal abre

**Campos adicionais:**
- `page_section`: Localização do botão (hero, cta, benefits)

---

### 3. **lp_form_submit**
**Quando:** Usuário submete o formulário  
**Categoria:** Conversion  
**Ação:** Submissão do formulário  
**Label:** "modal"  
**Google Ads:** Evento de conversão principal

**Onde é disparado:**
- `src/components/LeadFormModal.tsx` - Ao clicar em "QUERO MEU DIAGNÓSTICO + SITE GRÁTIS"

**Campos adicionais:**
- `lead_id`: ID do lead criado
- `success`: true/false

---

### 4. **lp_form_success**
**Quando:** Formulário submetido com sucesso  
**Categoria:** Conversion  
**Ação:** Formulário completo com sucesso  
**Label:** "modal"  
**Google Ads:** Conversão confirmada

**Onde é disparado:**
- `src/components/LeadFormModal.tsx` - Após salvar lead com sucesso

**Campos adicionais:**
- `lead_id`: ID do lead criado
- `value`: 1 (para Google Ads)

---

### 5. **lp_form_error**
**Quando:** Erro ao submeter formulário  
**Categoria:** Error  
**Ação:** Erro no formulário  
**Label:** "modal"  
**Google Ads:** Não é conversão

**Onde é disparado:**
- `src/components/LeadFormModal.tsx` - Quando há erro ao salvar

**Campos adicionais:**
- `error`: Mensagem de erro

---

### 6. **lp_button_click**
**Quando:** Usuário clica em qualquer botão CTA  
**Categoria:** Engagement  
**Ação:** Clique em botão  
**Label:** Localização do botão (hero, cta, benefits)  
**Google Ads:** Evento de engajamento

**Onde é disparado:**
- `src/components/HeroSection.tsx` - Botão principal
- `src/components/CTASection.tsx` - Botão CTA
- `src/components/BenefitsSection.tsx` - Botão de benefícios

**Campos adicionais:**
- `button_text`: Texto do botão
- `page_section`: Seção da página

---

### 7. **lp_questionnaire_start**
**Quando:** Usuário inicia o questionário  
**Categoria:** Engagement  
**Ação:** Início do questionário  
**Label:** "questionnaire"  
**Google Ads:** Evento de engajamento

**Onde é disparado:**
- `src/components/DiagnosticQuestionnaire.tsx` - Quando o componente carrega

**Campos adicionais:**
- `lead_id`: ID do lead

---

### 8. **lp_questionnaire_progress**
**Quando:** Usuário avança para próxima pergunta  
**Categoria:** Engagement  
**Ação:** Progresso no questionário  
**Label:** "questionnaire"  
**Google Ads:** Evento de engajamento

**Onde é disparado:**
- `src/components/DiagnosticQuestionnaire.tsx` - Ao clicar em "Próxima Pergunta"

**Campos adicionais:**
- `question_number`: Número da pergunta atual
- `total_questions`: Total de perguntas (5)
- `lead_id`: ID do lead

---

### 9. **lp_questionnaire_complete**
**Quando:** Usuário completa o questionário  
**Categoria:** Conversion  
**Ação:** Questionário completo  
**Label:** "questionnaire"  
**Google Ads:** Conversão secundária (micro-conversão)

**Onde é disparado:**
- `src/components/DiagnosticQuestionnaire.tsx` - Ao finalizar todas as perguntas

**Campos adicionais:**
- `lead_id`: ID do lead
- `value`: 1 (para Google Ads)

---

## 🔧 Configuração no Google Tag Manager

### 1. Criar Triggers

#### Trigger: "LP - Form Start"
- **Tipo:** Custom Event
- **Nome do evento:** `lp_form_start`
- **Condição:** Nenhuma (ou adicione condições específicas)

#### Trigger: "LP - Form Submit"
- **Tipo:** Custom Event
- **Nome do evento:** `lp_form_submit`
- **Condição:** Nenhuma

#### Trigger: "LP - Form Success"
- **Tipo:** Custom Event
- **Nome do evento:** `lp_form_success`
- **Condição:** Nenhuma

#### Trigger: "LP - Questionnaire Complete"
- **Tipo:** Custom Event
- **Nome do evento:** `lp_questionnaire_complete`
- **Condição:** Nenhuma

---

### 2. Criar Tags para Google Ads

#### Tag: "Conversão - Formulário Completo"
- **Tipo:** Google Ads - Conversão
- **Trigger:** "LP - Form Success"
- **Categoria de conversão:** "Formulário Preenchido"
- **Valor:** `{{value}}` (se disponível)

#### Tag: "Conversão - Questionário Completo"
- **Tipo:** Google Ads - Conversão
- **Trigger:** "LP - Questionnaire Complete"
- **Categoria de conversão:** "Questionário Completo"
- **Valor:** `{{value}}` (se disponível)

---

### 3. Variáveis Personalizadas (Opcional)

Crie variáveis para capturar dados dos eventos:

- `{{lead_id}}` - ID do lead
- `{{page_section}}` - Seção da página
- `{{button_text}}` - Texto do botão clicado
- `{{question_number}}` - Número da pergunta (questionário)

---

## 📈 Eventos para Google Ads

### Conversões Principais:
1. **lp_form_success** - Formulário preenchido com sucesso
2. **lp_questionnaire_complete** - Questionário completo

### Engajamento:
1. **lp_form_start** - Interesse em preencher formulário
2. **lp_button_click** - Cliques em CTAs
3. **lp_questionnaire_start** - Início do questionário

---

## 🔍 Estrutura do dataLayer

Todos os eventos seguem este formato:

```javascript
window.dataLayer.push({
  event: "lp_form_start",           // Nome do evento
  event_category: "Landing Page",   // Categoria
  event_action: "lp_form_start",    // Ação
  event_label: "hero",              // Label (seção)
  page_section: "hero",             // Seção da página
  lead_id: "uuid-do-lead",          // ID do lead (se disponível)
  value: 1,                         // Valor (para conversões)
  // ... outros campos customizados
});
```

---

## ✅ Checklist de Configuração

- [ ] Google Tag Manager instalado na página (via `index.html`)
- [ ] Eventos sendo enviados para dataLayer (verificar console)
- [ ] Triggers criados no GTM
- [ ] Tags do Google Ads configuradas
- [ ] Conversões testadas no Google Ads

---

## 🧪 Como Testar

1. Abra o DevTools (F12)
2. Vá na aba Console
3. Execute: `window.dataLayer`
4. Você verá todos os eventos enviados
5. Preencha o formulário e veja os eventos sendo adicionados

---

## 📝 Notas Importantes

- Todos os eventos são enviados automaticamente
- Os eventos são compatíveis com Google Ads
- O dataLayer é inicializado automaticamente
- Eventos não bloqueiam o fluxo da aplicação (se GTM falhar, continua funcionando)

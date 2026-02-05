# ✅ Eventos GTM/Google Ads - Implementação Completa

## 🎯 O que foi feito

Todos os eventos de analytics agora estão mapeados e enviados automaticamente para o **Google Tag Manager (GTM)** e são compatíveis com **Google Ads**.

---

## 📦 Arquivos Criados/Modificados

### ✅ Novos Arquivos:
1. **`src/lib/gtmAnalytics.ts`** - Serviço completo de integração com GTM
2. **`MAPEAMENTO_EVENTOS_GTM.md`** - Documentação completa dos eventos
3. **`EVENTOS_GTM_RESUMO.md`** - Este arquivo (resumo executivo)

### ✅ Arquivos Modificados:
1. **`src/lib/supabaseService.ts`** - Integrado com GTM
2. **`src/lib/supabase.ts`** - Tipos atualizados para novos eventos
3. **`supabase_schema.sql`** - Constraint atualizada para novos eventos
4. **`index.html`** - Preparado para GTM (comentado, aguardando ID)
5. **`src/components/HeroSection.tsx`** - Eventos de clique
6. **`src/components/CTASection.tsx`** - Eventos de clique
7. **`src/components/BenefitsSection.tsx`** - Eventos de clique
8. **`src/components/LeadFormModal.tsx`** - Eventos de formulário
9. **`src/components/DiagnosticQuestionnaire.tsx`** - Eventos de questionário
10. **`src/pages/Index.tsx`** - Evento de visualização de página

---

## 🚀 Eventos Implementados

### 1. **lp_page_view**
- Visualização da página inicial
- Disparado em: `Index.tsx`

### 2. **lp_form_start**
- Usuário abre o formulário
- Disparado em: Hero, CTA, Benefits, Modal

### 3. **lp_button_click**
- Clique em qualquer botão CTA
- Disparado em: Hero, CTA, Benefits

### 4. **lp_form_submit**
- Tentativa de submeter formulário
- Disparado em: `LeadFormModal.tsx`

### 5. **lp_form_success**
- Formulário submetido com sucesso
- **CONVERSÃO PRINCIPAL** para Google Ads
- Disparado em: `LeadFormModal.tsx` (quando sucesso)

### 6. **lp_form_error**
- Erro ao submeter formulário
- Disparado em: `LeadFormModal.tsx` (quando erro)

### 7. **lp_questionnaire_start**
- Início do questionário
- Disparado em: `DiagnosticQuestionnaire.tsx`

### 8. **lp_questionnaire_progress**
- Progresso no questionário (avança pergunta)
- Disparado em: `DiagnosticQuestionnaire.tsx`

### 9. **lp_questionnaire_complete**
- Questionário completo
- **CONVERSÃO SECUNDÁRIA** para Google Ads
- Disparado em: `DiagnosticQuestionnaire.tsx`

---

## 🔧 Próximos Passos (Configuração)

### 1. Instalar Google Tag Manager

No arquivo `index.html`, descomente e substitua `GTM-XXXXXXX` pelo seu ID do GTM:

```html
<!-- Google Tag Manager -->
<script async src="https://www.googletagmanager.com/gtm.js?id=SEU-GTM-ID"></script>
```

E no `<body>`:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=SEU-GTM-ID" ...></noscript>
```

### 2. Criar Triggers no GTM

Crie triggers para cada evento:
- `lp_form_start`
- `lp_form_success` ⭐ (Conversão)
- `lp_questionnaire_complete` ⭐ (Conversão)
- `lp_button_click`
- `lp_page_view`

### 3. Configurar Tags do Google Ads

Crie tags de conversão no GTM:
- **Conversão Principal:** `lp_form_success`
- **Conversão Secundária:** `lp_questionnaire_complete`

---

## 🧪 Como Testar

1. Abra o DevTools (F12)
2. Vá na aba Console
3. Digite: `window.dataLayer`
4. Você verá todos os eventos sendo enviados
5. Preencha o formulário e veja os eventos aparecendo

---

## 📊 Estrutura dos Eventos

Todos os eventos seguem este formato:

```javascript
{
  event: "lp_form_start",
  event_category: "Landing Page",
  event_action: "lp_form_start",
  event_label: "hero",
  page_section: "hero",
  lead_id: "uuid-do-lead", // quando disponível
  value: 1 // para conversões
}
```

---

## ✅ Checklist de Verificação

- [x] Eventos mapeados e autoexplicativos
- [x] Integração com dataLayer do GTM
- [x] Compatibilidade com Google Ads
- [x] Eventos de conversão identificados
- [x] Documentação completa criada
- [x] Schema do banco atualizado
- [ ] GTM instalado no site (aguardando ID)
- [ ] Triggers criados no GTM
- [ ] Tags do Google Ads configuradas
- [ ] Conversões testadas

---

## 🎯 Eventos de Conversão (Google Ads)

### Conversão Principal:
- **Evento:** `lp_form_success`
- **Quando:** Formulário preenchido com sucesso
- **Valor:** 1

### Conversão Secundária:
- **Evento:** `lp_questionnaire_complete`
- **Quando:** Questionário completo
- **Valor:** 1

---

## 📝 Notas Importantes

- ✅ Todos os eventos são enviados automaticamente
- ✅ Se o GTM não estiver disponível, o site continua funcionando normalmente
- ✅ Os eventos são salvos no Supabase E enviados para GTM
- ✅ Os nomes dos eventos são autoexplicativos e seguem padrão `lp_*`
- ✅ Compatível com Google Ads Conversion Tracking

---

## 🔗 Documentação Completa

Para detalhes completos de cada evento, consulte: **`MAPEAMENTO_EVENTOS_GTM.md`**

/**
 * Serviço de Analytics para Google Tag Manager e Google Ads
 * Envia eventos para dataLayer do GTM e mantém compatibilidade com Google Ads
 */

// Declaração do tipo dataLayer para TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tipos de eventos padronizados para GTM/Google Ads
 */
export type GTMEventType =
  | "lp_page_view" // Visualização da página
  | "lp_form_start" // Usuário abriu o formulário
  | "lp_form_submit" // Usuário submeteu o formulário
  | "lp_form_error" // Erro ao submeter formulário
  | "lp_form_success" // Formulário submetido com sucesso
  | "lp_questionnaire_start" // Iniciou o questionário
  | "lp_questionnaire_progress" // Progresso no questionário
  | "lp_questionnaire_complete" // Questionário completo
  | "lp_button_click" // Clique em botão CTA
  | "lp_scroll_depth"; // Scroll depth (opcional)

/**
 * Interface para eventos do GTM
 */
export interface GTMEvent {
  event: GTMEventType;
  event_category?: string;
  event_action?: string;
  event_label?: string;
  page_section?: string;
  lead_id?: string;
  value?: number;
  [key: string]: any; // Permite campos customizados
}

/**
 * Inicializa o dataLayer se não existir
 */
function initDataLayer() {
  if (typeof window !== "undefined" && !window.dataLayer) {
    window.dataLayer = [];
  }
}

/**
 * Envia evento para Google Tag Manager (dataLayer)
 */
export function sendGTMEvent(eventData: GTMEvent) {
  if (typeof window === "undefined") return;

  initDataLayer();

  // Preparar evento no formato padrão do GTM
  const gtmEvent: any = {
    event: eventData.event,
    event_category: eventData.event_category || "Landing Page",
    event_action: eventData.event_action || eventData.event,
    event_label: eventData.event_label || eventData.page_section || "",
  };

  // Adicionar campos customizados
  if (eventData.page_section) {
    gtmEvent.page_section = eventData.page_section;
  }

  if (eventData.lead_id) {
    gtmEvent.lead_id = eventData.lead_id;
  }

  if (eventData.value !== undefined) {
    gtmEvent.value = eventData.value;
  }

  // Adicionar campos extras do metadata
  Object.keys(eventData).forEach((key) => {
    if (
      !["event", "event_category", "event_action", "event_label"].includes(
        key
      )
    ) {
      gtmEvent[key] = eventData[key];
    }
  });

  // Enviar para dataLayer
  window.dataLayer.push(gtmEvent);

  // Também enviar para gtag se disponível (Google Ads)
  if (window.gtag) {
    window.gtag("event", eventData.event, {
      event_category: gtmEvent.event_category,
      event_action: gtmEvent.event_action,
      event_label: gtmEvent.event_label,
      value: gtmEvent.value,
      ...gtmEvent,
    });
  }

  // Log para debug (apenas em desenvolvimento)
  if (import.meta.env.DEV) {
    console.log("GTM Event:", gtmEvent);
  }
}

/**
 * Mapeia eventos do sistema para eventos GTM/Google Ads
 */
export function mapToGTMEvent(
  eventType: string,
  pageSection?: string,
  leadId?: string,
  metadata?: Record<string, any>
): GTMEvent {
  const eventMap: Record<string, GTMEventType> = {
    page_view: "lp_page_view",
    form_open: "lp_form_start",
    form_submit: "lp_form_submit",
    form_error: "lp_form_error",
    questionnaire_complete: "lp_questionnaire_complete",
  };

  const gtmEventType =
    eventMap[eventType] || (`lp_${eventType}` as GTMEventType);

  return {
    event: gtmEventType,
    event_category: "Landing Page",
    event_action: gtmEventType,
    event_label: pageSection || "",
    page_section: pageSection,
    lead_id: leadId,
    ...metadata,
  };
}

/**
 * Helper para eventos de conversão (Google Ads)
 */
export function trackConversion(
  conversionType: "form_submit" | "questionnaire_complete",
  leadId?: string,
  value?: number
) {
  sendGTMEvent({
    event: conversionType === "form_submit" ? "lp_form_success" : "lp_questionnaire_complete",
    event_category: "Conversion",
    event_action: conversionType,
    lead_id: leadId,
    value: value || 1,
  });
}

/**
 * Helper para eventos de clique em botão CTA
 */
export function trackButtonClick(
  buttonLocation: string,
  buttonText?: string
) {
  sendGTMEvent({
    event: "lp_button_click",
    event_category: "Engagement",
    event_action: "button_click",
    event_label: buttonLocation,
    button_text: buttonText,
    page_section: buttonLocation,
  });
}

/**
 * Serviços para interagir com o Supabase
 */
import { supabase, isSupabaseConfigured, getSupabaseConfigError, type Lead, type Analytics } from "./supabase";

/**
 * Salva um novo lead no banco de dados
 */
export async function salvarLead(dados: Omit<Lead, "id" | "created_at" | "updated_at">) {
  if (!isSupabaseConfigured() || !supabase) {
    const errorMsg = getSupabaseConfigError() || "Supabase não configurado";
    console.error("Erro de configuração:", errorMsg);
    return {
      success: false,
      error: `Configuração do Supabase: ${errorMsg}. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel.`,
      data: null,
    };
  }

  try {
    // Capturar informações do navegador
    const userAgent = navigator.userAgent;
    
    // Tentar obter IP (via serviço externo, se necessário)
    let ipAddress: string | null = null;
    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch {
      // Se falhar, continua sem IP
    }

    // Preparar dados do lead
    const leadData: Lead = {
      nome: dados.nome,
      email: dados.email.toLowerCase().trim(),
      celular: dados.celular,
      instagram: dados.instagram?.trim() || null,
      facebook: dados.facebook?.trim() || null,
      empresa: dados.sem_empresa ? null : dados.empresa || null,
      porte_empresa: dados.sem_empresa ? null : dados.porte_empresa || null,
      nicho_empresa: dados.sem_empresa ? null : dados.nicho_empresa || null,
      sem_empresa: dados.sem_empresa,
      oferece_servico: dados.sem_empresa ? dados.oferece_servico || false : null,
      tipo_servico: dados.sem_empresa && dados.oferece_servico ? dados.tipo_servico || null : null,
      status: "pendente",
      ip_address: ipAddress,
      user_agent: userAgent,
      source: "formulario",
    };

    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured() || !supabase) {
      const errorMsg = getSupabaseConfigError() || "Supabase não configurado";
      return {
        success: false,
        error: `Configuração do Supabase: ${errorMsg}. Configure as variáveis de ambiente no Vercel.`,
        data: null,
      };
    }

    // Inserir lead
    // Garantir que estamos usando o cliente correto
    if (import.meta.env.DEV) {
      console.log("📝 Tentando inserir lead:", leadData);
      console.log("🔗 Supabase URL:", supabaseUrl);
      console.log("✅ Supabase configurado:", isSupabaseConfigured());
      console.log("🔑 Supabase client:", supabase ? "Criado" : "NULL");
    }
    
    const { data, error } = await supabase
      .from("leads")
      .insert([leadData])
      .select()
      .single();
    
    // Log detalhado do erro
    if (error) {
      console.error("❌ Erro ao inserir lead:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        // Verificar se é erro de RLS
        isRLSError: error.code === '42501' || error.message.includes('row-level security'),
      });
    } else {
      console.log("✅ Lead inserido com sucesso:", data);
    }
    
    // Log para debug
    if (error) {
      console.error("Erro detalhado ao inserir lead:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
    }

    if (error) {
      // Se o erro for de email duplicado, retornar informação útil
      if (error.code === "23505") {
        return {
          success: false,
          error: "Este email já está cadastrado. Verifique sua caixa de entrada!",
          duplicate: true,
        };
      }
      throw error;
    }


    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Erro ao salvar lead:", error);
    return {
      success: false,
      error: error.message || "Erro ao salvar dados. Tente novamente.",
    };
  }
}

/**
 * Registra um evento de analytics
 * Agora também envia para Google Tag Manager e Google Ads
 */
export async function registrarAnalytics(
  eventType: Analytics["event_type"],
  pageSection?: string,
  leadId?: string,
  metadata?: Record<string, any>
) {
  try {
    // Enviar para Supabase (apenas se configurado)
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("analytics").insert([
      {
        lead_id: leadId || null,
        event_type: eventType,
        page_section: pageSection || null,
        metadata: metadata || null,
      },
      ]);

      if (error) {
        console.error("Erro ao registrar analytics:", error);
      }
    } else {
      // Se Supabase não estiver configurado, apenas loga (não quebra)
      if (import.meta.env.DEV) {
        console.warn("Supabase não configurado, analytics não será salvo no banco");
      }
    }

    // Enviar para Google Tag Manager
    try {
      const { sendGTMEvent, mapToGTMEvent, trackConversion } = await import(
        "./gtmAnalytics"
      );

      // Mapear evento para formato GTM
      const gtmEvent = mapToGTMEvent(eventType, pageSection, leadId, metadata);
      sendGTMEvent(gtmEvent);

      // Se for evento de conversão, enviar também como conversão
      if (eventType === "form_submit" && metadata?.success) {
        trackConversion("form_submit", leadId);
      } else if (eventType === "questionnaire_complete") {
        trackConversion("questionnaire_complete", leadId);
      }
    } catch (gtmError) {
      // Se GTM não estiver disponível, apenas loga (não quebra o fluxo)
      if (import.meta.env.DEV) {
        console.warn("GTM não disponível:", gtmError);
      }
    }
  } catch (error) {
    console.error("Erro ao registrar analytics:", error);
  }
}

/**
 * Busca portes de empresa disponíveis
 */
export async function buscarPortes() {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: "Supabase não configurado", data: [] };
  }

  try {
    const { data, error } = await supabase
      .from("company_portes")
      .select("*")
      .order("ordem", { ascending: true });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Erro ao buscar portes:", error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Busca nichos disponíveis
 */
export async function buscarNichos() {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: "Supabase não configurado", data: [] };
  }

  try {
    const { data, error } = await supabase
      .from("company_niches")
      .select("*")
      .order("ordem", { ascending: true });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Erro ao buscar nichos:", error);
    return { success: false, error: error.message, data: [] };
  }
}


/**
 * Salva as respostas do questionário de diagnóstico
 */
export async function salvarRespostasQuestionario(
  leadId: string,
  answers: Record<number, string>
) {
  if (!isSupabaseConfigured() || !supabase) {
    const errorMsg = getSupabaseConfigError() || "Supabase não configurado";
    return {
      success: false,
      error: `Configuração do Supabase: ${errorMsg}. Configure as variáveis de ambiente no Vercel.`,
      data: null,
    };
  }

  try {
    // Preparar dados das respostas
    const responseData = {
      lead_id: leadId,
      question_1: answers[1] || null,
      question_2: answers[2] || null,
      question_3: answers[3] || null,
      question_4: answers[4] || null,
      question_5: answers[5] || null,
      responses: answers,
      completed: true,
    };

    // Verificar se já existe resposta para este lead
    const { data: existing } = await supabase
      .from("questionnaire_responses")
      .select("id")
      .eq("lead_id", leadId)
      .single();

    let result;
    if (existing) {
      // Atualizar resposta existente
      const { data, error } = await supabase
        .from("questionnaire_responses")
        .update(responseData)
        .eq("lead_id", leadId)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Inserir nova resposta
      const { data, error } = await supabase
        .from("questionnaire_responses")
        .insert([responseData])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    // Atualizar status do lead para "processado"
    await supabase
      .from("leads")
      .update({ status: "processado" })
      .eq("id", leadId);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Erro ao salvar respostas do questionário:", error);
    return {
      success: false,
      error: error.message || "Erro ao salvar respostas. Tente novamente.",
    };
  }
}

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

    // Inserir lead APENAS via função RPC (bypassa RLS - evita erro 401/42501)
    if (import.meta.env.DEV) {
      console.log("📝 Inserindo lead via RPC insert_lead");
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc('insert_lead', {
      p_nome: leadData.nome,
      p_email: leadData.email,
      p_celular: leadData.celular,
      p_instagram: leadData.instagram ?? null,
      p_facebook: leadData.facebook ?? null,
      p_empresa: leadData.empresa ?? null,
      p_porte_empresa: leadData.porte_empresa ?? null,
      p_nicho_empresa: leadData.nicho_empresa ?? null,
      p_sem_empresa: leadData.sem_empresa,
      p_oferece_servico: leadData.oferece_servico ?? null,
      p_tipo_servico: leadData.tipo_servico ?? null,
      p_status: leadData.status ?? 'pendente',
      p_ip_address: leadData.ip_address ?? null,
      p_user_agent: leadData.user_agent ?? null,
      p_source: leadData.source ?? null,
      p_utm_source: leadData.utm_source ?? null,
      p_utm_medium: leadData.utm_medium ?? null,
      p_utm_campaign: leadData.utm_campaign ?? null,
    });

    if (rpcError) {
      console.error("❌ Erro RPC insert_lead:", rpcError.message, rpcError.code);
      if (rpcError.code === "23505") {
        return {
          success: false,
          error: "Este email já está cadastrado. Verifique sua caixa de entrada!",
          data: null,
        };
      }
      return {
        success: false,
        error: rpcError.message || "Erro ao salvar. Tente novamente.",
        data: null,
      };
    }

    const row = Array.isArray(rpcData) && rpcData.length > 0
      ? rpcData[0]
      : rpcData && typeof rpcData === "object" && "id" in rpcData
        ? rpcData
        : null;

    if (row && row.id) {
      return {
        success: true,
        data: { id: row.id, nome: row.nome, email: row.email, celular: row.celular, created_at: row.created_at },
      };
    }

    console.warn("RPC sem id, tentando INSERT direto (RLS desabilitado)");
    const { data: insertData, error: insertError } = await supabase
      .from("leads")
      .insert([leadData])
      .select("id, nome, email, celular, created_at")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return { success: false, error: "Este email já está cadastrado. Verifique sua caixa de entrada!", data: null };
      }
      return {
        success: false,
        error: insertError.message || "Erro ao salvar. Tente novamente.",
        data: null,
      };
    }
    if (insertData?.id) {
      return { success: true, data: insertData };
    }

    return {
      success: false,
      error: "Resposta inválida do servidor. Tente novamente.",
      data: null,
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

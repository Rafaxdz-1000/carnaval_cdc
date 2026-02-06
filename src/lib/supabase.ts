/**
 * Cliente Supabase configurado para o projeto
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Criar cliente Supabase mesmo sem variáveis (para não quebrar a aplicação)
// As funções que usam o Supabase devem verificar se está configurado
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
      },
    })
  : null;

// Log para debug (apenas em desenvolvimento)
if (import.meta.env.DEV && supabase) {
  console.log('🔧 Supabase Client Configurado:');
  console.log('  URL:', supabaseUrl);
  console.log('  Key (primeiros 20 chars):', supabaseAnonKey?.substring(0, 20) + '...');
  console.log('  Key type:', supabaseAnonKey?.startsWith('sb_publishable_') ? 'publishable' : supabaseAnonKey?.startsWith('eyJ') ? 'legacy anon' : 'unknown');
}

// Função helper para verificar se Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Função helper para obter mensagem de erro de configuração
export const getSupabaseConfigError = () => {
  if (!supabaseUrl) {
    return "VITE_SUPABASE_URL não configurada";
  }
  if (!supabaseAnonKey) {
    return "VITE_SUPABASE_ANON_KEY não configurada";
  }
  return null;
};

// Tipos TypeScript para as tabelas
export interface Lead {
  id?: string;
  nome: string;
  email: string;
  celular: string;
  instagram?: string | null;
  facebook?: string | null;
  empresa?: string | null;
  porte_empresa?: string | null;
  nicho_empresa?: string | null;
  sem_empresa: boolean;
  oferece_servico?: boolean | null;
  tipo_servico?: string | null;
  status?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  source?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  created_at?: string;
  updated_at?: string;
}


export interface Analytics {
  id?: string;
  lead_id?: string | null;
  event_type:
    | "page_view"
    | "form_open"
    | "form_submit"
    | "form_error"
    | "questionnaire_start"
    | "questionnaire_progress"
    | "questionnaire_complete"
    | "button_click"
    | "scroll_depth";
  page_section?: string | null;
  timestamp?: string;
  metadata?: Record<string, any> | null;
}

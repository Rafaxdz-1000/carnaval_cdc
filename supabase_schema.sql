-- ============================================
-- SCHEMA DO BANCO DE DADOS - CLUBE DOS CISNES
-- Landing Page - Carnaval Sales Booster
-- ============================================

-- Tabela: leads (Principal)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    celular VARCHAR(20) NOT NULL,
    instagram VARCHAR(255) NULL,
    facebook VARCHAR(255) NULL,
    empresa VARCHAR(255) NULL,
    porte_empresa VARCHAR(50) NULL,
    nicho_empresa VARCHAR(50) NULL,
    sem_empresa BOOLEAN DEFAULT false NOT NULL,
    oferece_servico BOOLEAN DEFAULT false NULL,
    tipo_servico VARCHAR(255) NULL,
    status VARCHAR(20) DEFAULT 'pendente' NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    source VARCHAR(50) NULL,
    utm_source VARCHAR(100) NULL,
    utm_medium VARCHAR(100) NULL,
    utm_campaign VARCHAR(100) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT chk_status CHECK (status IN ('pendente', 'processado', 'entregue', 'erro')),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices para a tabela leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================

-- Tabela: analytics (Tracking de Eventos)
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NULL REFERENCES leads(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    page_section VARCHAR(50) NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metadata JSONB NULL,
    
    CONSTRAINT chk_event_type CHECK (event_type IN (
        'page_view',
        'form_open',
        'form_submit',
        'form_error',
        'questionnaire_start',
        'questionnaire_progress',
        'questionnaire_complete',
        'button_click',
        'scroll_depth'
    ))
);

-- Índices para a tabela analytics
CREATE INDEX IF NOT EXISTS idx_analytics_lead_id ON analytics(lead_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_metadata ON analytics USING GIN(metadata);

-- ============================================

-- Tabelas de Referência: company_portes
CREATE TABLE IF NOT EXISTS company_portes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    ordem INT NOT NULL
);

-- Tabelas de Referência: company_niches
CREATE TABLE IF NOT EXISTS company_niches (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    ordem INT NOT NULL
);

-- ============================================
-- DADOS INICIAIS (Seed Data)
-- ============================================

-- Inserir valores padrão para company_portes
INSERT INTO company_portes (nome, ordem) VALUES
    ('MEI / Autônomo', 1),
    ('Microempresa (até 9 funcionários)', 2),
    ('Pequena Empresa (10-49 funcionários)', 3),
    ('Média Empresa (50-99 funcionários)', 4),
    ('Grande Empresa (100+ funcionários)', 5)
ON CONFLICT (nome) DO NOTHING;

-- Inserir valores padrão para company_niches
INSERT INTO company_niches (nome, ordem) VALUES
    ('E-commerce / Loja Virtual', 1),
    ('Varejo / Loja Física', 2),
    ('Serviços', 3),
    ('Alimentação / Restaurante', 4),
    ('Beleza / Estética', 5),
    ('Turismo / Hotelaria', 6),
    ('Saúde / Bem-estar', 7),
    ('Educação', 8),
    ('Tecnologia', 9),
    ('Outro', 10)
ON CONFLICT (nome) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Supabase
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_portes ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_niches ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar conforme necessário)
-- Permite inserção pública para leads (formulário)
CREATE POLICY "Permitir inserção de leads" ON leads
    FOR INSERT
    WITH CHECK (true);

-- Permite leitura pública das tabelas de referência
CREATE POLICY "Permitir leitura de portes" ON company_portes
    FOR SELECT
    USING (true);

CREATE POLICY "Permitir leitura de nichos" ON company_niches
    FOR SELECT
    USING (true);

-- Permitir inserção de analytics (tracking)
DROP POLICY IF EXISTS "Permitir inserção de analytics" ON analytics;

CREATE POLICY "Permitir inserção pública analytics" ON analytics
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Permitir inserção anon analytics" ON analytics
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- ============================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================

COMMENT ON TABLE leads IS 'Tabela principal de leads capturados pelo formulário';
COMMENT ON TABLE analytics IS 'Eventos de tracking e analytics da landing page';
COMMENT ON TABLE company_portes IS 'Tabela de referência para portes de empresa';
COMMENT ON TABLE company_niches IS 'Tabela de referência para nichos/segmentos';

-- ============================================
-- Tabela: questionnaire_responses (Respostas do Questionário)
-- ============================================

CREATE TABLE IF NOT EXISTS questionnaire_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    question_1 VARCHAR(1) NULL,
    question_2 VARCHAR(1) NULL,
    question_3 VARCHAR(1) NULL,
    question_4 VARCHAR(1) NULL,
    question_5 VARCHAR(1) NULL,
    responses JSONB NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices para a tabela questionnaire_responses
CREATE INDEX IF NOT EXISTS idx_questionnaire_lead_id ON questionnaire_responses(lead_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_completed ON questionnaire_responses(completed);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_questionnaire_updated_at BEFORE UPDATE ON questionnaire_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS na tabela questionnaire_responses
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para questionnaire_responses
CREATE POLICY "Permitir inserção pública questionnaire" ON questionnaire_responses
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Permitir inserção anon questionnaire" ON questionnaire_responses
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Permitir atualização pública questionnaire" ON questionnaire_responses
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir atualização anon questionnaire" ON questionnaire_responses
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

COMMENT ON TABLE questionnaire_responses IS 'Armazena as respostas do questionário de diagnóstico';

# Resumo Técnico - Arquitetura de Banco de Dados
## Landing Page - Clube dos Cisnes (Carnaval Sales Booster)

---

## 1. VISÃO GERAL DO SISTEMA

### 1.1 Propósito
Sistema de captura de leads através de landing page para distribuição de eBook gratuito sobre estratégias de vendas no período do Carnaval.

### 1.2 Fluxo Principal
```
Usuário → Landing Page → Formulário de Captura → Validação → Armazenamento → Entrega do eBook
```

---

## 2. ENTIDADES E DADOS COLETADOS

### 2.1 Entidade: LEAD (Principal)
**Dados Obrigatórios:**
- `nome` (VARCHAR) - Nome completo do lead
- `email` (VARCHAR, UNIQUE) - Email para entrega do eBook
- `celular` (VARCHAR) - WhatsApp formatado: (XX) XXXXX-XXXX
- `created_at` (TIMESTAMP) - Data/hora de cadastro
- `updated_at` (TIMESTAMP) - Última atualização

**Dados Opcionais (Condicionais):**
- `empresa` (VARCHAR, NULLABLE) - Nome da empresa
- `porte_empresa` (ENUM, NULLABLE) - Porte da empresa
- `nicho_empresa` (ENUM, NULLABLE) - Nicho/segmento
- `sem_empresa` (BOOLEAN, DEFAULT false) - Flag indicando se não possui empresa

**Campos de Controle:**
- `id` (UUID/INT PRIMARY KEY)
- `status` (ENUM) - 'pendente', 'processado', 'entregue', 'erro'
- `ip_address` (VARCHAR) - IP de origem (LGPD)
- `user_agent` (TEXT) - Navegador/dispositivo
- `source` (VARCHAR) - Origem do lead (ex: 'hero', 'cta', 'benefits')
- `utm_source` (VARCHAR) - Parâmetro UTM
- `utm_medium` (VARCHAR) - Parâmetro UTM
- `utm_campaign` (VARCHAR) - Parâmetro UTM

### 2.2 Entidade: EBOOK_DELIVERY (Histórico de Entrega)
**Relacionamento:** 1:N com LEAD
- `id` (UUID/INT PRIMARY KEY)
- `lead_id` (FOREIGN KEY → LEAD.id)
- `email_enviado` (BOOLEAN, DEFAULT false)
- `data_envio` (TIMESTAMP, NULLABLE)
- `tentativas_envio` (INT, DEFAULT 0)
- `erro_envio` (TEXT, NULLABLE)
- `created_at` (TIMESTAMP)

### 2.3 Entidade: COMPANY_PORTE (Tabela de Referência)
**Valores:**
- MEI / Autônomo
- Microempresa (até 9 funcionários)
- Pequena Empresa (10-49 funcionários)
- Média Empresa (50-99 funcionários)
- Grande Empresa (100+ funcionários)

### 2.4 Entidade: COMPANY_NICHE (Tabela de Referência)
**Valores:**
- E-commerce / Loja Virtual
- Varejo / Loja Física
- Serviços
- Alimentação / Restaurante
- Beleza / Estética
- Turismo / Hotelaria
- Saúde / Bem-estar
- Educação
- Tecnologia
- Outro

### 2.5 Entidade: ANALYTICS (Métricas e Tracking)
**Relacionamento:** 1:N com LEAD
- `id` (UUID/INT PRIMARY KEY)
- `lead_id` (FOREIGN KEY → LEAD.id, NULLABLE)
- `event_type` (ENUM) - 'page_view', 'form_open', 'form_submit', 'form_error'
- `page_section` (VARCHAR) - 'hero', 'benefits', 'cta', 'footer'
- `timestamp` (TIMESTAMP)
- `metadata` (JSON) - Dados adicionais do evento

---

## 3. RELACIONAMENTOS ENTRE ENTIDADES

### 3.1 Diagrama de Relacionamentos

```
LEAD (1) ──────< (N) EBOOK_DELIVERY
  │
  │
  └──────< (N) ANALYTICS

LEAD.porte_empresa ──> COMPANY_PORTE (Referência)
LEAD.nicho_empresa ──> COMPANY_NICHE (Referência)
```

### 3.2 Cardinalidades

| Entidade A | Relacionamento | Entidade B | Cardinalidade |
|------------|----------------|------------|---------------|
| LEAD | possui | EBOOK_DELIVERY | 1:N |
| LEAD | gera | ANALYTICS | 1:N |
| LEAD | referencia | COMPANY_PORTE | N:1 |
| LEAD | referencia | COMPANY_NICHE | N:1 |

---

## 4. FLUXOS DE DADOS

### 4.1 Fluxo de Captura de Lead

```
[Frontend - LeadFormModal]
    │
    ├─> Validação de Campos (Client-side)
    │   ├─ Nome: obrigatório, min 3 caracteres
    │   ├─ Email: formato válido, obrigatório
    │   ├─ Celular: formato brasileiro, obrigatório
    │   └─ Empresa: condicional (se sem_empresa = false)
    │
    ├─> Formatação de Dados
    │   ├─ Celular: (XX) XXXXX-XXXX
    │   └─ Email: lowercase, trim
    │
    └─> POST /api/leads
        │
        ├─> Validação Backend
        │   ├─ Email único (verificar duplicatas)
        │   ├─ Validação de formato
        │   └─ Sanitização de dados
        │
        ├─> Persistência no Banco
        │   ├─ INSERT INTO leads (...)
        │   ├─ Log de analytics (form_submit)
        │   └─ Retornar lead_id
        │
        └─> Processamento Assíncrono
            ├─ Criar registro em ebook_delivery
            ├─ Enfileirar envio de email
            └─ Retornar sucesso ao frontend
```

### 4.2 Fluxo de Entrega do eBook

```
[Queue/Worker]
    │
    ├─> Buscar entregas pendentes
    │   SELECT * FROM ebook_delivery 
    │   WHERE email_enviado = false 
    │   AND tentativas_envio < 3
    │
    ├─> Buscar dados do lead
    │   SELECT * FROM leads WHERE id = lead_id
    │
    ├─> Enviar Email
    │   ├─ Template: eBook gratuito
    │   ├─ Anexo: PDF do eBook
    │   └─ Tracking: pixel de abertura
    │
    └─> Atualizar Status
        ├─ Se sucesso:
        │   ├─ UPDATE ebook_delivery SET email_enviado = true
        │   └─ UPDATE ebook_delivery SET data_envio = NOW()
        │
        └─ Se erro:
            ├─ UPDATE ebook_delivery SET tentativas_envio += 1
            └─ UPDATE ebook_delivery SET erro_envio = 'mensagem'
```

### 4.3 Fluxo de Analytics/Tracking

```
[Frontend - Eventos]
    │
    ├─> Page View
    │   └─> POST /api/analytics
    │       └─> INSERT INTO analytics (event_type='page_view')
    │
    ├─> Form Open
    │   └─> POST /api/analytics
    │       └─> INSERT INTO analytics (event_type='form_open')
    │
    ├─> Form Submit
    │   └─> POST /api/analytics
    │       └─> INSERT INTO analytics (event_type='form_submit', lead_id=X)
    │
    └─> Form Error
        └─> POST /api/analytics
            └─> INSERT INTO analytics (event_type='form_error', metadata={...})
```

---

## 5. REGRAS DE NEGÓCIO

### 5.1 Validações de Lead

1. **Email Único:**
   - Não permitir cadastro duplicado por email
   - Se email existir, retornar mensagem amigável
   - Opção: atualizar dados existentes se lead antigo (>30 dias)

2. **Campos Condicionais:**
   - Se `sem_empresa = true`: empresa, porte, nicho = NULL
   - Se `sem_empresa = false`: porte e nicho são obrigatórios

3. **Formatação de Celular:**
   - Aceitar apenas números
   - Formatar automaticamente: (XX) XXXXX-XXXX
   - Validar DDD válido (11-99)

### 5.2 Processamento de Entrega

1. **Tentativas de Envio:**
   - Máximo 3 tentativas
   - Intervalo entre tentativas: 1h, 6h, 24h
   - Após 3 falhas, marcar como erro manual

2. **Deduplicação:**
   - Verificar se email já recebeu eBook nos últimos 90 dias
   - Se sim, não reenviar, apenas atualizar lead

3. **LGPD Compliance:**
   - Armazenar IP apenas para segurança (não compartilhar)
   - Permitir exclusão de dados via endpoint
   - Log de consentimento implícito (ao submeter formulário)

---

## 6. ESTRUTURA DE TABELAS (SQL)

### 6.1 Tabela: leads

```sql
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    celular VARCHAR(20) NOT NULL,
    empresa VARCHAR(255) NULL,
    porte_empresa VARCHAR(50) NULL,
    nicho_empresa VARCHAR(50) NULL,
    sem_empresa BOOLEAN DEFAULT false NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    source VARCHAR(50) NULL,
    utm_source VARCHAR(100) NULL,
    utm_medium VARCHAR(100) NULL,
    utm_campaign VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT chk_status CHECK (status IN ('pendente', 'processado', 'entregue', 'erro')),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_source ON leads(source);
```

### 6.2 Tabela: ebook_delivery

```sql
CREATE TABLE ebook_delivery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    email_enviado BOOLEAN DEFAULT false NOT NULL,
    data_envio TIMESTAMP NULL,
    tentativas_envio INT DEFAULT 0 NOT NULL,
    erro_envio TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT chk_tentativas CHECK (tentativas_envio >= 0 AND tentativas_envio <= 3)
);

CREATE INDEX idx_ebook_delivery_lead_id ON ebook_delivery(lead_id);
CREATE INDEX idx_ebook_delivery_pendente ON ebook_delivery(email_enviado, tentativas_envio) 
    WHERE email_enviado = false;
```

### 6.3 Tabela: analytics

```sql
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NULL REFERENCES leads(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    page_section VARCHAR(50) NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metadata JSONB NULL,
    
    CONSTRAINT chk_event_type CHECK (event_type IN ('page_view', 'form_open', 'form_submit', 'form_error'))
);

CREATE INDEX idx_analytics_lead_id ON analytics(lead_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX idx_analytics_metadata ON analytics USING GIN(metadata);
```

### 6.4 Tabelas de Referência

```sql
CREATE TABLE company_portes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    ordem INT NOT NULL
);

CREATE TABLE company_niches (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    ordem INT NOT NULL
);

-- Inserir valores padrão
INSERT INTO company_portes (nome, ordem) VALUES
    ('MEI / Autônomo', 1),
    ('Microempresa (até 9 funcionários)', 2),
    ('Pequena Empresa (10-49 funcionários)', 3),
    ('Média Empresa (50-99 funcionários)', 4),
    ('Grande Empresa (100+ funcionários)', 5);

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
    ('Outro', 10);
```

---

## 7. ENDPOINTS DA API

### 7.1 POST /api/leads
**Descrição:** Criar novo lead

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "celular": "(11) 98765-4321",
  "empresa": "Minha Empresa LTDA",
  "porte_empresa": "Pequena Empresa (10-49 funcionários)",
  "nicho_empresa": "E-commerce / Loja Virtual",
  "sem_empresa": false,
  "source": "hero",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "carnaval2026"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "lead_id": "uuid-do-lead",
  "message": "Lead cadastrado com sucesso"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Email já cadastrado",
  "lead_id": "uuid-do-lead-existente"
}
```

### 7.2 GET /api/leads/:id
**Descrição:** Buscar lead por ID

### 7.3 DELETE /api/leads/:id (LGPD)
**Descrição:** Excluir lead e dados relacionados

### 7.4 POST /api/analytics
**Descrição:** Registrar evento de analytics

**Request Body:**
```json
{
  "event_type": "form_open",
  "page_section": "hero",
  "lead_id": "uuid-opcional",
  "metadata": {
    "device": "mobile",
    "browser": "chrome"
  }
}
```

### 7.5 GET /api/stats/dashboard
**Descrição:** Estatísticas para dashboard administrativo

**Response:**
```json
{
  "total_leads": 1250,
  "leads_hoje": 45,
  "taxa_conversao": 12.5,
  "leads_por_fonte": {
    "hero": 600,
    "cta": 400,
    "benefits": 250
  },
  "leads_por_nicho": {
    "E-commerce": 300,
    "Varejo": 200
  }
}
```

---

## 8. CONSIDERAÇÕES DE PERFORMANCE

### 8.1 Índices Recomendados
- Email (único, busca frequente)
- Status (filtros de dashboard)
- Created_at (relatórios temporais)
- Source (análise de origem)

### 8.2 Otimizações
- Particionamento de tabela `analytics` por mês (se volume alto)
- Cache de estatísticas agregadas (Redis)
- Queue assíncrona para envio de emails (RabbitMQ/SQS)

### 8.3 Escalabilidade
- Read replicas para consultas de analytics
- Sharding por email hash (se necessário)
- Arquivo de leads antigos (>1 ano) em cold storage

---

## 9. SEGURANÇA E LGPD

### 9.1 Proteção de Dados
- Criptografia de dados sensíveis (email, celular)
- Rate limiting por IP (máx 5 submits/hora)
- Validação de CAPTCHA em produção
- Logs de auditoria para alterações

### 9.2 Conformidade LGPD
- Consentimento implícito ao submeter formulário
- Endpoint de exclusão de dados pessoais
- Anonimização de dados após 2 anos
- Política de privacidade acessível

---

## 10. MÉTRICAS E KPIs

### 10.1 Métricas Principais
- Taxa de conversão (submits / page views)
- Tempo médio até conversão
- Taxa de entrega de email (sucesso)
- Taxa de abertura do email
- Distribuição por fonte (hero, cta, benefits)
- Distribuição por nicho/porte

### 10.2 Queries Úteis

```sql
-- Taxa de conversão diária
SELECT 
    DATE(created_at) as data,
    COUNT(*) as leads,
    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM analytics WHERE event_type = 'page_view' AND DATE(timestamp) = DATE(leads.created_at))) as taxa_conversao
FROM leads
GROUP BY DATE(created_at)
ORDER BY data DESC;

-- Leads por fonte
SELECT source, COUNT(*) as total
FROM leads
GROUP BY source
ORDER BY total DESC;

-- Taxa de entrega de email
SELECT 
    COUNT(*) FILTER (WHERE email_enviado = true) * 100.0 / COUNT(*) as taxa_sucesso
FROM ebook_delivery;
```

---

## 11. PRÓXIMOS PASSOS

1. **Implementação Backend:**
   - API REST (Node.js/Express ou Python/FastAPI)
   - Integração com banco de dados (PostgreSQL recomendado)
   - Queue para processamento assíncrono

2. **Integração Frontend:**
   - Substituir mock de API no `LeadFormModal.tsx`
   - Implementar tracking de analytics
   - Adicionar tratamento de erros

3. **Serviços Externos:**
   - Serviço de email (SendGrid, AWS SES, Mailchimp)
   - Storage do eBook (S3, Cloudflare R2)
   - Analytics avançado (Google Analytics, Mixpanel)

4. **Monitoramento:**
   - Logs estruturados (Winston, Pino)
   - Alertas de erro (Sentry, Rollbar)
   - Dashboard de métricas (Grafana, Metabase)

---

**Documento gerado em:** 2026-01-27  
**Versão:** 1.0  
**Autor:** Análise Técnica - Clube dos Cisnes

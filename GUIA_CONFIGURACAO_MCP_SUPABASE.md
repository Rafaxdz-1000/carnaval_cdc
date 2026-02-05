# Guia de Configuração - MCP Supabase no Cursor

## 📋 Pré-requisitos

1. Conta no Supabase (nova conta configurada)
2. Projeto criado no Supabase
3. Cursor IDE instalado

---

## 🔧 Passo 1: Configurar o arquivo MCP

O arquivo `.cursor/mcp.json` já foi criado. Agora você precisa preencher suas credenciais:

### 1.1 Obter as informações do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings > API**
4. Copie:
   - **Project URL** (exemplo: `https://abcdefghijklmnop.supabase.co`)
   - **anon/public key** (a chave pública, não a service_role)

### 1.2 Editar o arquivo `.cursor/mcp.json`

Abra o arquivo `.cursor/mcp.json` e substitua:

- `SEU-PROJETO-ID` → O ID do seu projeto (parte antes de `.supabase.co`)
- `SUA-API-KEY-AQUI` → Sua chave anon/public do Supabase

**Exemplo de como deve ficar:**

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp",
      "env": {
        "SUPABASE_URL": "https://abcdefghijklmnop.supabase.co",
        "SUPABASE_ANON_KEY": "sua-chave-anon-public-aqui"
      }
    }
  }
}
```

**⚠️ IMPORTANTE:**
- Use a chave **anon/public**, NÃO a service_role
- Não commite este arquivo com suas credenciais reais no Git
- O arquivo `.cursor/mcp.json.example` está disponível como template

---

## 🔐 Passo 2: Autenticação

1. **Reinicie o Cursor IDE** para que ele detecte a nova configuração MCP

2. **Autenticação automática:**
   - O Cursor abrirá automaticamente uma janela do navegador
   - Faça login na sua **nova conta do Supabase**
   - Selecione a **organização** que contém o projeto que você quer usar
   - Autorize o acesso

3. **Confirmação:**
   - Após autorizar, você será redirecionado de volta ao Cursor
   - A conexão será estabelecida automaticamente

---

## ✅ Passo 3: Verificar a conexão

1. **No Cursor:**
   - Vá em **Settings > Cursor Settings > Tools & MCP**
   - Verifique se o servidor `supabase` aparece na lista
   - Se não aparecer, reinicie o Cursor novamente

2. **Teste a conexão:**
   - Pergunte ao assistente: *"Quais tabelas existem no meu banco de dados do Supabase? Use as ferramentas MCP."*
   - Ou: *"Liste os projetos do Supabase usando MCP"*

---

## 🗄️ Passo 4: Obter informações do projeto

Você precisará das seguintes informações do seu projeto Supabase:

1. **URL do projeto:** `https://[seu-projeto-id].supabase.co`
2. **API Key (anon/public):** Encontrada em Settings > API
3. **Database Password:** Definida ao criar o projeto

**Onde encontrar:**
- Acesse: https://supabase.com/dashboard
- Selecione seu projeto
- Vá em **Settings > API** para ver a URL e API Key
- Vá em **Settings > Database** para ver/resetar a senha

---

## 📝 Passo 5: Executar o schema SQL

Após configurar o MCP, você pode executar o schema SQL de duas formas:

### Opção A: Via Dashboard do Supabase (Recomendado)
1. Acesse seu projeto no Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `supabase_schema.sql`
4. Clique em **Run** ou pressione `Ctrl+Enter`

### Opção B: Via MCP (se disponível)
Após configurar, peça ao assistente:
*"Execute o arquivo supabase_schema.sql no meu banco de dados do Supabase usando MCP"*

---

## 🔍 Troubleshooting

### Problema: MCP não aparece nas configurações
**Solução:**
- Verifique se o arquivo `.cursor/mcp.json` está na raiz do projeto
- Reinicie o Cursor completamente
- Verifique se o JSON está válido (sem vírgulas extras)

### Problema: Erro de autenticação
**Solução:**
- Certifique-se de estar logado na conta correta do Supabase
- Verifique se você tem acesso ao projeto/organização
- Tente limpar o cache do navegador e autenticar novamente

### Problema: Não consigo executar SQL via MCP
**Solução:**
- Use o SQL Editor do Supabase Dashboard (mais confiável)
- Verifique se as permissões do projeto estão corretas
- Confirme que a API Key tem permissões adequadas

---

## 📚 Recursos Adicionais

- [Documentação oficial do Supabase MCP](https://supabase.com/docs/guides/getting-started/mcp)
- [Documentação do Cursor sobre MCP](https://cursor.com/docs/context/mcp)
- [Guia do Model Context Protocol](https://modelcontextprotocol.io/)

---

## ✨ Próximos Passos

Após configurar o MCP e executar o schema:

1. ✅ Verificar se todas as tabelas foram criadas
2. ✅ Testar inserção de um lead de teste
3. ✅ Configurar as variáveis de ambiente no projeto
4. ✅ Integrar o front-end com o Supabase

---

**Última atualização:** 2026-01-27

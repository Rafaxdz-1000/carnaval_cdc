# 🚀 Configurar Variáveis de Ambiente no Vercel

## ⚠️ Problema Atual

A página está em branco porque as variáveis de ambiente do Supabase não estão configuradas no Vercel.

**Erro:** `Variáveis de ambiente do Supabase não configuradas`

---

## ✅ Solução: Configurar Variáveis no Vercel

### 📋 Passo a Passo

#### 1. Acesse o Dashboard do Vercel

1. Vá para: https://vercel.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto **carnaval_cdc** (ou o nome do seu projeto)

#### 2. Acesse as Configurações

1. Clique no projeto
2. Vá em **Settings** (Configurações)
3. No menu lateral, clique em **Environment Variables** (Variáveis de Ambiente)

#### 3. Adicione as Variáveis

Você precisa adicionar **2 variáveis**:

##### Variável 1: `VITE_SUPABASE_URL`
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://kdtsmxxzqepclzygqbmw.supabase.co`
- **Environment:** Selecione todas as opções:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

##### Variável 2: `VITE_SUPABASE_ANON_KEY`
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdHNteHh6cWVwY2x6eWdxYm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTMxMTYsImV4cCI6MjA4NTY2OTExNn0.1Y39k3ftFzEYUm74vlC9J3Tw2C2s3mbrLOH6XZkxQ-U`
- **Environment:** Selecione todas as opções:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

#### 4. Salvar e Fazer Redeploy

1. Clique em **Save** (Salvar) para cada variável
2. Vá em **Deployments** (Deployments)
3. Clique nos **3 pontinhos** (⋯) do último deployment
4. Selecione **Redeploy**
5. Ou simplesmente faça um novo commit/push para triggerar um novo deploy

---

## 🔍 Como Obter as Credenciais do Supabase

Se você não tem as credenciais em mãos:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → Use como `VITE_SUPABASE_URL`
   - **anon public** key → Use como `VITE_SUPABASE_ANON_KEY`

---

## 📸 Visual Guide (Passo a Passo com Imagens)

### Passo 1: Dashboard do Vercel
```
Dashboard → Selecione Projeto → Settings
```

### Passo 2: Environment Variables
```
Settings → Environment Variables (menu lateral)
```

### Passo 3: Adicionar Variável
```
+ Add New → 
  Name: VITE_SUPABASE_URL
  Value: https://kdtsmxxzqepclzygqbmw.supabase.co
  Environments: ✅ Production ✅ Preview ✅ Development
  → Save
```

### Passo 4: Adicionar Segunda Variável
```
+ Add New → 
  Name: VITE_SUPABASE_ANON_KEY
  Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Environments: ✅ Production ✅ Preview ✅ Development
  → Save
```

### Passo 5: Redeploy
```
Deployments → ⋯ (3 pontinhos) → Redeploy
```

---

## ⚡ Método Rápido (Via Vercel CLI)

Se você tem o Vercel CLI instalado:

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Login
vercel login

# Adicionar variáveis
vercel env add VITE_SUPABASE_URL production
# Cole o valor quando solicitado

vercel env add VITE_SUPABASE_ANON_KEY production
# Cole o valor quando solicitado

# Fazer deploy
vercel --prod
```

---

## ✅ Verificação

Após configurar:

1. **Aguarde o redeploy** (pode levar 1-2 minutos)
2. **Acesse sua URL** do Vercel
3. **Abra o Console do navegador** (F12)
4. **Verifique** que não há mais erros sobre variáveis de ambiente

---

## 🔒 Segurança

⚠️ **IMPORTANTE:**
- A chave `anon/public` do Supabase é **segura** para usar no front-end
- Ela já está visível no código do cliente
- **NÃO** use a chave `service_role` (ela tem acesso total ao banco)

---

## 🐛 Troubleshooting

### Problema: Variáveis não estão sendo aplicadas

**Solução:**
1. Certifique-se de que selecionou **todas as environments** (Production, Preview, Development)
2. Faça um **redeploy** após adicionar as variáveis
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Problema: Ainda aparece erro

**Solução:**
1. Verifique se os nomes das variáveis estão **exatamente** como:
   - `VITE_SUPABASE_URL` (não `SUPABASE_URL`)
   - `VITE_SUPABASE_ANON_KEY` (não `SUPABASE_ANON_KEY`)
2. O prefixo `VITE_` é **obrigatório** para variáveis do Vite

### Problema: Erro 401 ou RLS

**Solução:**
- Verifique se a chave `anon` está correta
- Verifique as políticas RLS no Supabase
- Consulte a documentação de RLS se necessário

---

## 📝 Checklist

Antes de considerar resolvido:

- [ ] Variável `VITE_SUPABASE_URL` adicionada no Vercel
- [ ] Variável `VITE_SUPABASE_ANON_KEY` adicionada no Vercel
- [ ] Ambas variáveis configuradas para Production, Preview e Development
- [ ] Redeploy realizado
- [ ] Página carregando sem erros no console
- [ ] Formulário funcionando corretamente

---

**Após configurar, sua aplicação deve funcionar normalmente!** 🎉

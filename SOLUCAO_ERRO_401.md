# 🔴 Solução para Erro 401 (Unauthorized)

## Problema Identificado

O erro `401 (Unauthorized)` indica que o Supabase não está reconhecendo a autenticação. Isso pode acontecer por:

1. **Chave anon incorreta** no Vercel
2. **Chave não está sendo enviada corretamente** nos headers
3. **Problema com a versão do cliente Supabase**

## ✅ Solução Aplicada

1. **Simplifiquei a configuração do cliente** - Removi headers customizados que podem estar causando conflito
2. **O cliente Supabase já envia automaticamente** os headers necessários quando você passa a chave anon

## 🔧 Verificar no Vercel

### Passo 1: Verificar Chave Anon

1. Acesse: https://supabase.com/dashboard
2. Seu projeto → **Settings** → **API**
3. Copie a chave **anon/public** (legacy) - deve começar com `eyJhbGci...`

### Passo 2: Verificar no Vercel

1. Acesse: https://vercel.com/dashboard
2. Seu projeto → **Settings** → **Environment Variables**
3. Verifique `VITE_SUPABASE_ANON_KEY`:
   - Deve ser a chave **anon** completa
   - Deve começar com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **NÃO** use a chave `sb_publishable_...` (essa é nova e pode não funcionar com versões antigas do cliente)

### Passo 3: Redeploy

Após verificar/corrigir, faça um **Redeploy** no Vercel.

## 🧪 Testar

1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Abra o Console (F12)
3. Tente enviar o formulário
4. Verifique se ainda retorna 401

## 🔍 Se Ainda Retornar 401

### Verificar Headers da Requisição

1. Abra DevTools (F12) → **Network**
2. Tente enviar o formulário
3. Clique na requisição para `supabase.co`
4. Vá em **Headers** → **Request Headers**
5. Verifique se contém:
   - `apikey: eyJhbGci...` (sua chave anon)
   - `Authorization: Bearer eyJhbGci...` (sua chave anon)

Se não aparecer, o problema está na configuração do cliente.

### Verificar Versão do Cliente

No `package.json`, verifique a versão de `@supabase/supabase-js`. Se for muito antiga, pode precisar atualizar:

```bash
npm install @supabase/supabase-js@latest
```

---

**Última atualização:** Simplificada configuração do cliente para usar apenas a chave anon padrão.

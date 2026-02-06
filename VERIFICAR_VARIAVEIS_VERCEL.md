# 🔍 Verificar Variáveis de Ambiente no Vercel

## ⚠️ Problema Identificado

O INSERT funciona no Supabase SQL Editor, mas não funciona no front-end. Isso indica que:

✅ **Políticas RLS estão corretas** (funciona no SQL Editor)  
❌ **Problema está na configuração do cliente Supabase no front-end**

## 🔧 Solução: Verificar Variáveis no Vercel

### Passo 1: Acessar Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto **carnaval_cdc** (ou o nome do seu projeto)

### Passo 2: Verificar Environment Variables

1. Vá em **Settings** → **Environment Variables**
2. Verifique se existem estas variáveis:

#### Variável 1: `VITE_SUPABASE_URL`
- **Valor deve ser:** `https://kdtsmxxzqepclzygqbmw.supabase.co`
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variável 2: `VITE_SUPABASE_ANON_KEY`
- **Valor deve ser:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdHNteHh6cWVwY2x6eWdxYm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTMxMTYsImV4cCI6MjA4NTY2OTExNn0.1Y39k3ftFzEYUm74vlC9J3Tw2C2s3mbrLOH6XZkxQ-U`
- **Environments:** ✅ Production ✅ Preview ✅ Development

### Passo 3: Verificar se Está Usando a Chave Correta

⚠️ **IMPORTANTE:** Você deve usar a chave **anon** (legacy), não a service_role!

A chave anon começa com: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Passo 4: Fazer Redeploy

Após verificar/corrigir as variáveis:

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** (⋯) do último deployment
3. Selecione **Redeploy**
4. Ou simplesmente faça um novo commit/push

## 🧪 Como Verificar se Está Funcionando

1. **Abra o Console do Navegador** (F12)
2. **Recarregue a página** (Ctrl+Shift+R)
3. **Procure por logs** que começam com:
   - `🔧 Supabase Client Configurado:`
   - `📝 Tentando inserir lead:`
4. **Tente enviar o formulário**
5. **Verifique os logs** no console

## 🔍 Se Ainda Não Funcionar

### Verificar no Console do Navegador

Abra o DevTools (F12) → Console e procure por:

- `Supabase Client Configurado` - Deve mostrar URL e Key
- `Tentando inserir lead` - Deve mostrar os dados
- Erros detalhados com código `42501` (RLS) ou outros

### Verificar Network Tab

1. Abra DevTools (F12) → **Network**
2. Tente enviar o formulário
3. Procure por requisições para `supabase.co`
4. Clique na requisição e verifique:
   - **Headers** → Deve ter `apikey` com a chave anon
   - **Response** → Verifique o erro retornado

### Testar com Console do Navegador

Abra o Console (F12) e execute:

```javascript
// Verificar se as variáveis estão carregadas
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
```

Se retornar `undefined`, as variáveis não estão configuradas no Vercel!

## ✅ Checklist Final

- [ ] Variável `VITE_SUPABASE_URL` existe no Vercel
- [ ] Variável `VITE_SUPABASE_ANON_KEY` existe no Vercel
- [ ] Ambas variáveis estão configuradas para Production, Preview e Development
- [ ] A chave anon está correta (começa com `eyJhbGci...`)
- [ ] Redeploy realizado após configurar variáveis
- [ ] Console do navegador mostra logs de configuração
- [ ] Testado enviar formulário novamente

---

**Se tudo estiver correto e ainda não funcionar, verifique os logs no console do navegador para mais detalhes!**

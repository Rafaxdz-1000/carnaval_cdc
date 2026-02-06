# ✅ Solução RLS Definitiva

## 🔧 Política Criada

Foi criada uma política específica para o role `anon`:

```sql
CREATE POLICY allow_insert_leads_anon ON leads
FOR INSERT
TO anon
WITH CHECK (true);

GRANT INSERT ON leads TO anon;
```

## 🧪 Como Testar

1. **Limpe o cache do navegador** (Ctrl+Shift+R ou Cmd+Shift+R)
2. **Abra o Console do Navegador** (F12)
3. **Tente enviar o formulário novamente**
4. **Verifique os logs** no console (se estiver em desenvolvimento)

## 🔍 Se Ainda Não Funcionar

### Verificar Variáveis de Ambiente no Vercel

1. Acesse: https://vercel.com/dashboard
2. Seu projeto → Settings → Environment Variables
3. Verifique se existem:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **IMPORTANTE:** Certifique-se de que está usando a chave **anon** (não service_role)

### Verificar no Console do Navegador

Abra o DevTools (F12) e verifique:
- Se há erros de rede
- Se as variáveis de ambiente estão sendo carregadas
- Qual é o erro exato retornado

### Testar Diretamente no Supabase

1. Acesse: https://supabase.com/dashboard
2. Seu projeto → SQL Editor
3. Execute:

```sql
-- Testar INSERT como anon
SET ROLE anon;
INSERT INTO leads (nome, email, celular, sem_empresa, status) 
VALUES ('Teste RLS', 'teste@teste.com', '11999999999', false, 'pendente');
RESET ROLE;
```

Se este comando funcionar, o problema está no código frontend.
Se não funcionar, há algo errado com as políticas RLS.

## 📝 Checklist

- [ ] Política RLS criada para role `anon`
- [ ] GRANT INSERT concedido para `anon`
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Cache do navegador limpo
- [ ] Testado no Supabase SQL Editor

---

**Última atualização:** Política criada especificamente para `anon` com GRANT explícito.

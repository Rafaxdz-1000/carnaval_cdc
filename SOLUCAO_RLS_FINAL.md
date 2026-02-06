# ✅ Solução Final para Erro RLS

## 🔴 Problema
Erro ao enviar formulário: `new row violates row-level security policy for table "leads"`

## ✅ Solução Aplicada

### Política RLS Criada

Foi criada uma política permissiva que permite INSERT na tabela `leads` para todos os roles:

```sql
CREATE POLICY allow_insert_leads ON leads
FOR INSERT
TO anon, public, authenticated
WITH CHECK (true);
```

### Verificação

A política foi criada e está ativa. Ela permite que:
- ✅ Usuários anônimos (`anon`) insiram leads
- ✅ Usuários públicos (`public`) insiram leads  
- ✅ Usuários autenticados (`authenticated`) insiram leads

## 🧪 Como Testar

1. Acesse a landing page
2. Preencha o formulário
3. Clique em enviar
4. O formulário deve funcionar sem erros de RLS

## 📝 Notas

- A política usa `WITH CHECK (true)` que permite qualquer inserção
- RLS está habilitado na tabela `leads` (segurança ativa)
- A política cobre todos os roles necessários

## 🔍 Se Ainda Der Erro

Se ainda aparecer erro de RLS:

1. Verifique se as variáveis de ambiente estão configuradas no Vercel
2. Verifique se está usando a chave `anon` (não `service_role`)
3. Limpe o cache do navegador
4. Verifique o console do navegador para erros adicionais

---

**Status:** ✅ Política RLS configurada e ativa

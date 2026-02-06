# 🔍 Diagnóstico RLS - Tabela Leads

## ✅ Políticas Criadas

Foram criadas 3 políticas para garantir que INSERT funcione:

1. **allow_insert_leads_anon** - Para role `anon`
2. **allow_insert_leads_public** - Para role `public`
3. **allow_insert_leads_authenticated** - Para role `authenticated`

Todas com `WITH CHECK (true)` - devem permitir qualquer inserção.

## 🔍 Verificações Realizadas

- ✅ RLS está habilitado na tabela
- ✅ Políticas criadas para todos os roles
- ✅ Constraints da tabela verificadas
- ✅ Estrutura da tabela verificada

## 🐛 Possíveis Causas do Problema

1. **Cache do navegador** - Limpar cache e tentar novamente
2. **Variáveis de ambiente** - Verificar se estão configuradas corretamente no Vercel
3. **Chave Supabase** - Verificar se está usando a chave `anon` (não `service_role`)
4. **Cliente Supabase** - Pode estar usando um role diferente

## 🔧 Próximos Passos para Debug

1. Abrir Console do Navegador (F12)
2. Verificar erros detalhados
3. Verificar qual role está sendo usado
4. Testar com um INSERT direto no Supabase SQL Editor

## 📝 Comando para Testar no Supabase SQL Editor

```sql
-- Testar INSERT como role anon
SET ROLE anon;
INSERT INTO leads (nome, email, celular, sem_empresa, status) 
VALUES ('Teste', 'teste@teste.com', '11999999999', false, 'pendente');
RESET ROLE;
```

Se este comando funcionar, o problema está no código frontend.
Se não funcionar, há algo errado com as políticas RLS.

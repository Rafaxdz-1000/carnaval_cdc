# 🚀 Comandos Git para Upload

## ⚠️ IMPORTANTE - Antes de começar

Certifique-se de que:
- ✅ O arquivo `.env` está no `.gitignore` (já verificado)
- ✅ Nenhuma credencial está hardcoded no código (já verificado)
- ✅ Arquivos temporários foram removidos (já feito)

## 📋 Passo a Passo

### 1. Verificar status do Git
```bash
git status
```

### 2. Adicionar remote (se ainda não foi adicionado)
```bash
git remote add origin https://github.com/Rafaxdz-1000/carnaval_cdc.git
```

Ou se já existe, atualizar:
```bash
git remote set-url origin https://github.com/Rafaxdz-1000/carnaval_cdc.git
```

### 3. Verificar arquivos que serão commitados
```bash
git status
```

### 4. Adicionar todos os arquivos (exceto os do .gitignore)
```bash
git add .
```

### 5. Verificar novamente o que será commitado
```bash
git status
```

**IMPORTANTE:** Certifique-se de que:
- ❌ `.env` NÃO está na lista
- ❌ `node_modules/` NÃO está na lista
- ❌ `dist/` NÃO está na lista
- ✅ Apenas arquivos de código e configuração estão listados

### 6. Fazer commit inicial
```bash
git commit -m "feat: landing page carnaval sales booster - versão inicial"
```

Ou se já houver commits anteriores:
```bash
git commit -m "chore: preparação para deploy - remoção de arquivos temporários e atualização de documentação"
```

### 7. Verificar branch atual
```bash
git branch
```

### 8. Renomear branch para main (se necessário)
```bash
git branch -M main
```

### 9. Push para o repositório remoto
```bash
git push -u origin main
```

Se der erro de conflito (por exemplo, se o repositório já tiver conteúdo):
```bash
git pull origin main --allow-unrelated-histories
# Resolva conflitos se houver
git push -u origin main
```

## 🔍 Verificação Final

Após o push, verifique no GitHub:
1. Acesse: https://github.com/Rafaxdz-1000/carnaval_cdc
2. Confirme que:
   - ✅ Código está presente
   - ❌ Arquivo `.env` NÃO está visível
   - ❌ Pasta `node_modules/` NÃO está presente
   - ✅ README.md está presente e legível

## 🛡️ Segurança

Se por acaso você commitar credenciais acidentalmente:

1. **Remover do histórico (CUIDADO - apenas se necessário):**
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

2. **Rotacionar credenciais no Supabase:**
   - Acesse Supabase Dashboard
   - Settings > API
   - Gere novas chaves

3. **Force push (apenas se necessário e com cuidado):**
```bash
git push origin --force --all
```

## 📝 Próximos Passos Após Upload

1. Configure variáveis de ambiente no serviço de deploy (Vercel, Netlify, etc.)
2. Execute o script `supabase_schema.sql` no Supabase
3. Configure Google Tag Manager com os eventos mapeados
4. Teste a aplicação em produção

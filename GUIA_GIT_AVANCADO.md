# 🗑️ Guia: Remover Arquivos e Contribuidores no Git

## 📁 PARTE 1: Remover Arquivos do Git

### ⚠️ IMPORTANTE: Diferença entre Remover do Git e Deletar do Disco

- **Remover do Git apenas:** O arquivo continua no seu computador, mas não será mais rastreado pelo Git
- **Remover do Git E do disco:** O arquivo é deletado completamente

---

### 🔹 Opção 1: Remover Arquivo do Git (mas manter no disco)

```bash
# Remover um arquivo específico
git rm --cached nome-do-arquivo.md

# Remover uma pasta inteira
git rm --cached -r nome-da-pasta/

# Exemplo prático: remover arquivos de documentação temporária
git rm --cached CHECKUP_SEGURANCA.md
git rm --cached COMANDOS_GIT.md
git rm --cached INICIALIZAR_GIT.md
git rm --cached ARQUIVOS_PARA_GIT.md
git rm --cached RESUMO_UPLOAD.md
git rm --cached GUIA_GIT_AVANCADO.md
```

**Depois de remover, você precisa:**
1. Adicionar o arquivo ao `.gitignore` (se quiser que continue ignorado)
2. Fazer commit das mudanças

```bash
# Adicionar ao .gitignore (opcional)
echo "CHECKUP_SEGURANCA.md" >> .gitignore
echo "COMANDOS_GIT.md" >> .gitignore

# Fazer commit
git add .gitignore
git commit -m "chore: remover arquivos temporários do Git"
git push
```

---

### 🔹 Opção 2: Remover Arquivo do Git E do Disco (deletar completamente)

```bash
# Remover arquivo do Git e do disco
git rm nome-do-arquivo.md

# Remover pasta do Git e do disco
git rm -r nome-da-pasta/

# Fazer commit
git commit -m "chore: remover arquivos desnecessários"
git push
```

**⚠️ CUIDADO:** Esta opção deleta o arquivo permanentemente do seu computador!

---

### 🔹 Opção 3: Remover Arquivos que Já Foram Commitados (mas manter no histórico)

Se você quer remover arquivos que já foram commitados anteriormente:

```bash
# 1. Remover do índice (staging)
git rm --cached arquivo.md

# 2. Adicionar ao .gitignore para não ser commitado novamente
echo "arquivo.md" >> .gitignore

# 3. Commit
git add .gitignore
git commit -m "chore: remover arquivo do rastreamento Git"
git push
```

---

### 🔹 Opção 4: Remover Arquivos do Histórico Completo (CUIDADO!)

Se você quer remover arquivos do histórico Git completamente (por exemplo, arquivos com credenciais que foram commitados por engano):

```bash
# Usar git filter-branch (método antigo, mas funciona)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch nome-do-arquivo.md" \
  --prune-empty --tag-name-filter cat -- --all

# OU usar git filter-repo (método moderno - precisa instalar)
# pip install git-filter-repo
# git filter-repo --path nome-do-arquivo.md --invert-paths

# Depois force push (CUIDADO!)
git push origin --force --all
```

**⚠️ ATENÇÃO:** Isso reescreve o histórico Git. Se outras pessoas já fizeram clone do repositório, isso pode causar problemas!

---

## 👥 PARTE 2: Remover Contribuidores do Repositório

### 🔹 Opção 1: Remover Colaborador no GitHub (Interface Web)

1. Acesse: https://github.com/Rafaxdz-1000/carnaval_cdc
2. Vá em **Settings** (Configurações)
3. Clique em **Collaborators** (Colaboradores) no menu lateral
4. Encontre o colaborador que deseja remover
5. Clique no ícone de **engrenagem** ao lado do nome
6. Selecione **Remove access** (Remover acesso)
7. Confirme a remoção

---

### 🔹 Opção 2: Remover Colaborador via GitHub CLI

```bash
# Instalar GitHub CLI (se não tiver)
# Windows: winget install GitHub.cli

# Autenticar
gh auth login

# Remover colaborador
gh api repos/Rafaxdz-1000/carnaval_cdc/collaborators/USERNAME -X DELETE
```

---

### 🔹 Opção 3: Remover Commits de um Contribuidor (do Histórico)

Se você quer remover commits de um autor específico do histórico:

```bash
# Remover todos os commits de um autor específico
git filter-branch --force --env-filter '
if [ "$GIT_AUTHOR_EMAIL" = "email-do-contribuidor@exemplo.com" ]
then
    export GIT_AUTHOR_NAME="Seu Nome"
    export GIT_AUTHOR_EMAIL="seu-email@exemplo.com"
    export GIT_COMMITTER_NAME="Seu Nome"
    export GIT_COMMITTER_EMAIL="seu-email@exemplo.com"
fi
' --tag-name-filter cat -- --branches --tags

# Force push (CUIDADO!)
git push origin --force --all
```

**⚠️ ATENÇÃO:** Isso reescreve o histórico Git completamente!

---

## 📋 Exemplos Práticos

### Exemplo 1: Remover Arquivos de Documentação Temporária

```bash
# Listar arquivos que você quer remover
git ls-files | grep -E "(CHECKUP|COMANDOS|INICIALIZAR|ARQUIVOS|RESUMO|GUIA)"

# Remover do Git (mas manter no disco)
git rm --cached CHECKUP_SEGURANCA.md
git rm --cached COMANDOS_GIT.md
git rm --cached INICIALIZAR_GIT.md
git rm --cached ARQUIVOS_PARA_GIT.md
git rm --cached RESUMO_UPLOAD.md
git rm --cached GUIA_GIT_AVANCADO.md

# Commit
git commit -m "chore: remover arquivos de documentação temporária"
git push
```

### Exemplo 2: Remover Arquivo que Contém Credenciais (do Histórico)

```bash
# 1. Remover do histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch arquivo-com-credenciais.md" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Adicionar ao .gitignore
echo "arquivo-com-credenciais.md" >> .gitignore
git add .gitignore
git commit -m "chore: adicionar arquivo sensível ao .gitignore"

# 3. Force push
git push origin --force --all

# 4. IMPORTANTE: Rotacionar credenciais no serviço (Supabase, etc.)
```

---

## ⚠️ AVISOS IMPORTANTES

### ⚠️ Antes de Remover Arquivos:

1. **Faça backup** dos arquivos importantes
2. **Verifique** se outros desenvolvedores precisam dos arquivos
3. **Comunique** mudanças importantes à equipe
4. **Teste** em uma branch separada antes de fazer no `main`

### ⚠️ Antes de Remover Contribuidores:

1. **Comunique** a decisão ao contribuidor
2. **Verifique** se há commits importantes dele que você quer manter
3. **Considere** se é melhor apenas remover acesso futuro, mantendo histórico

### ⚠️ Antes de Force Push:

1. **Avisar** todos os colaboradores
2. **Fazer backup** do repositório
3. **Ter certeza** de que é necessário reescrever o histórico
4. **Considerar** criar uma nova branch ao invés de reescrever `main`

---

## 🔍 Verificar o que Será Removido

```bash
# Ver arquivos que estão sendo rastreados pelo Git
git ls-files

# Ver arquivos que serão removidos (dry-run)
git rm --cached --dry-run nome-do-arquivo.md

# Ver histórico de commits de um autor
git log --author="nome-do-autor"
```

---

## 📚 Comandos Úteis Adicionais

```bash
# Ver quem são os colaboradores (via GitHub CLI)
gh api repos/Rafaxdz-1000/carnaval_cdc/collaborators

# Ver commits de um autor específico
git log --author="email@exemplo.com" --oneline

# Ver arquivos modificados por um autor
git log --author="email@exemplo.com" --name-only --pretty=format:"" | sort -u

# Desfazer último commit (mas manter mudanças)
git reset --soft HEAD~1

# Desfazer último commit (e descartar mudanças)
git reset --hard HEAD~1
```

---

## ✅ Checklist Antes de Remover

- [ ] Fiz backup dos arquivos importantes?
- [ ] Verifiquei se outros precisam dos arquivos?
- [ ] Adicionei arquivos sensíveis ao `.gitignore`?
- [ ] Testei os comandos em uma branch de teste?
- [ ] Comuniquei mudanças à equipe?
- [ ] Estou pronto para fazer force push (se necessário)?

---

**Dica:** Sempre teste comandos destrutivos em uma branch separada primeiro!

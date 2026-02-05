# 📦 Arquivos para Upload no Git

## ✅ ARQUIVOS ESSENCIAIS (DEVEM SER COMMITADOS)

### 📁 Configuração do Projeto
```
✅ .gitignore                    # Configuração do Git
✅ package.json                  # Dependências do projeto
✅ package-lock.json             # Lock das versões
✅ tsconfig.json                 # Configuração TypeScript
✅ tsconfig.app.json             # Config TypeScript (app)
✅ tsconfig.node.json            # Config TypeScript (node)
✅ vite.config.ts                # Configuração do Vite
✅ tailwind.config.ts            # Configuração do Tailwind
✅ postcss.config.js             # Configuração do PostCSS
✅ eslint.config.js              # Configuração do ESLint
✅ components.json               # Configuração do Shadcn UI
✅ vitest.config.ts              # Configuração de testes
```

### 📁 Código Fonte
```
✅ src/                          # TODA a pasta src/
   ✅ App.tsx
   ✅ App.css
   ✅ main.tsx
   ✅ index.css
   ✅ vite-env.d.ts
   ✅ components/                # Todos os componentes
   ✅ lib/                       # Todos os serviços
   ✅ pages/                     # Todas as páginas
   ✅ hooks/                     # Todos os hooks
   ✅ assets/                    # Imagens e recursos
   ✅ test/                      # Arquivos de teste
```

### 📁 Arquivos Públicos
```
✅ public/                       # TODA a pasta public/
   ✅ favicon.png
   ✅ robots.txt
   ✅ placeholder.svg
   ✅ *.jpg (imagens necessárias)
```

### 📁 Arquivos Raiz Essenciais
```
✅ index.html                    # HTML principal
✅ README.md                     # Documentação principal
✅ supabase_schema.sql           # Schema do banco de dados
✅ .env.example                  # Template de variáveis (SEM credenciais)
```

### 📁 Documentação Técnica (Opcional mas Recomendado)
```
✅ MAPEAMENTO_EVENTOS_GTM.md     # Documentação dos eventos GTM
✅ EVENTOS_GTM_RESUMO.md         # Resumo dos eventos
✅ ARQUITETURA_BANCO_DADOS.md    # Arquitetura do banco
✅ INTEGRACAO_SUPABASE.md        # Guia de integração
✅ GUIA_CONFIGURACAO_MCP_SUPABASE.md  # Guia MCP (sem credenciais)
```

---

## ❌ ARQUIVOS QUE NÃO DEVEM SER COMMITADOS

### 🔒 Arquivos Sensíveis (Já no .gitignore)
```
❌ .env                          # Variáveis de ambiente COM credenciais
❌ .env.local
❌ .env.production
❌ .env.development
❌ .cursor/mcp.json              # Configuração MCP com credenciais
```

### 📦 Dependências e Builds (Já no .gitignore)
```
❌ node_modules/                 # Dependências (instalar com npm install)
❌ dist/                         # Build de produção
❌ dist-ssr/                     # Build SSR
❌ *.local                       # Arquivos locais
```

### 🗑️ Arquivos Temporários/Debug (Já Removidos)
```
❌ CHECKUP_SEGURANCA.md          # Pode remover após verificação
❌ COMANDOS_GIT.md               # Pode remover após uso
❌ INICIALIZAR_GIT.md            # Pode remover após uso
❌ ARQUIVOS_PARA_GIT.md          # Este arquivo (pode remover após uso)
```

### 📝 Outros Arquivos Desnecessários
```
❌ bun.lockb                     # Lock do Bun (se não usar Bun)
```

---

## 🎯 RESUMO RÁPIDO

### ✅ COMMITAR:
- ✅ Todo o código fonte (`src/`)
- ✅ Todas as configurações (`package.json`, `vite.config.ts`, etc.)
- ✅ Arquivos públicos (`public/`)
- ✅ `index.html`
- ✅ `README.md`
- ✅ `supabase_schema.sql`
- ✅ `.env.example`
- ✅ `.gitignore`
- ✅ Documentação técnica (opcional)

### ❌ NÃO COMMITAR:
- ❌ `.env` (com credenciais)
- ❌ `node_modules/`
- ❌ `dist/`
- ❌ `.cursor/mcp.json`
- ❌ Arquivos temporários de debug

---

## 🚀 Comando para Verificar Antes do Commit

```bash
# Ver o que será commitado
git status

# Verificar se .env está sendo ignorado
git status --ignored | grep .env

# Se aparecer .env na lista, NÃO FAÇA COMMIT!
```

---

## ✅ Checklist Final

Antes de fazer `git add .` e `git commit`, verifique:

- [ ] Executei `git status` e `.env` NÃO aparece
- [ ] Executei `git status` e `node_modules/` NÃO aparece
- [ ] Executei `git status` e `dist/` NÃO aparece
- [ ] Todos os arquivos de código estão presentes
- [ ] README.md está atualizado
- [ ] `.env.example` existe e está sem credenciais reais

**Se tudo estiver OK, pode fazer o commit!** ✅

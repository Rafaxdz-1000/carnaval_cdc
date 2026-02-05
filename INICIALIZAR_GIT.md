# 🚀 Inicializar Repositório Git

Como o repositório ainda não foi inicializado, siga estes passos:

## 📋 Comandos Completos

### 1. Inicializar Git
```bash
git init
```

### 2. Adicionar Remote
```bash
git remote add origin https://github.com/Rafaxdz-1000/carnaval_cdc.git
```

### 3. Verificar arquivos que serão commitados
```bash
git status
```

**IMPORTANTE:** Certifique-se de que `.env` NÃO aparece na lista!

### 4. Adicionar todos os arquivos
```bash
git add .
```

### 5. Verificar novamente
```bash
git status
```

### 6. Fazer commit inicial
```bash
git commit -m "feat: landing page carnaval sales booster - versão inicial com integração Supabase e GTM"
```

### 7. Renomear branch para main
```bash
git branch -M main
```

### 8. Push para o GitHub
```bash
git push -u origin main
```

## ⚠️ Se o repositório já tiver conteúdo

Se o GitHub mostrar que o repositório não está vazio, use:

```bash
git pull origin main --allow-unrelated-histories
# Resolva conflitos se houver
git push -u origin main
```

## ✅ Verificação Final

Após o push, acesse: https://github.com/Rafaxdz-1000/carnaval_cdc

Confirme que:
- ✅ Código está presente
- ❌ Arquivo `.env` NÃO está visível
- ❌ Pasta `node_modules/` NÃO está presente
- ✅ README.md está presente

---

**Tudo pronto!** 🎉

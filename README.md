# 🎉 Carnaval Sales Booster - Landing Page

Landing page desenvolvida para captura de leads durante o período do Carnaval, oferecendo diagnóstico digital gratuito + site demonstrativo em até 3 dias.

## 🚀 Tecnologias

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** para estilização
- **Shadcn UI** para componentes
- **Supabase** para banco de dados e backend
- **Google Tag Manager** para analytics e rastreamento

## 📋 Funcionalidades

- ✅ Formulário de captura de leads com validação
- ✅ Questionário de diagnóstico digital interativo
- ✅ Integração completa com Supabase
- ✅ Rastreamento de eventos com Google Tag Manager
- ✅ Design responsivo e moderno
- ✅ Análise de analytics em tempo real

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase
- Conta no Google Tag Manager (opcional, para analytics)

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/Rafaxdz-1000/carnaval_cdc.git
cd carnaval_cdc
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public-aqui
```

**Como obter as credenciais do Supabase:**
- Acesse: https://supabase.com/dashboard
- Selecione seu projeto
- Vá em **Settings > API**
- Copie a **URL do projeto** e a chave **anon/public**

4. **Execute o projeto em desenvolvimento**
```bash
npm run dev
```

5. **Build para produção**
```bash
npm run build
```

## 📊 Configuração do Banco de Dados

Execute o script SQL em `supabase_schema.sql` no Supabase SQL Editor para criar todas as tabelas necessárias:

- `leads` - Armazena os leads capturados
- `analytics` - Registra eventos de analytics
- `questionnaire_responses` - Armazena respostas do questionário

## 🎯 Google Tag Manager

O projeto está configurado para enviar eventos automaticamente para o GTM. Os eventos estão mapeados com prefixo `lp_*`:

- `lp_page_view` - Visualização da página
- `lp_form_start` - Abertura do formulário
- `lp_form_success` - Formulário enviado com sucesso (Conversão)
- `lp_questionnaire_complete` - Questionário completo (Conversão)
- E outros...

Consulte `MAPEAMENTO_EVENTOS_GTM.md` para detalhes completos.

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/     # Componentes React
│   ├── lib/          # Serviços (Supabase, GTM Analytics)
│   ├── pages/        # Páginas da aplicação
│   └── assets/       # Imagens e recursos
├── public/           # Arquivos estáticos
├── supabase_schema.sql  # Schema do banco de dados
└── .env.example      # Template de variáveis de ambiente
```

## 🔒 Segurança

- ⚠️ **NUNCA** commite o arquivo `.env` com credenciais reais
- O arquivo `.env` está no `.gitignore` por padrão
- Use sempre o `.env.example` como referência
- As chaves do Supabase usadas são públicas (anon key), seguras para front-end

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

## 📧 Contato

Para dúvidas ou suporte, entre em contato através do repositório.

---

Desenvolvido com ❤️ para o Clube dos Cisnes

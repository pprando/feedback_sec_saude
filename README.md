📱 Sistema de Ouvidoria / Feedback

Aplicação web para registro e acompanhamento de manifestações, como elogios, sugestões, reclamações e solicitações.

O sistema permite que o usuário envie uma manifestação e receba um protocolo único, podendo acompanhar o status posteriormente.

🚀 Funcionalidades
Registro de manifestações
Envio anônimo opcional
Geração automática de protocolo
Consulta de manifestação por protocolo
Interface otimizada para mobile
🛠️ Tecnologias
Nuxt 3
Vue 3
Tailwind CSS
PostgreSQL
Node.js
📦 Como rodar o projeto
1. Clonar o repositório
git clone <url-do-repositorio>
cd feedback-app
2. Instalar dependências
pnpm install
3. Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto com base no .env.example.

4. Rodar o projeto
pnpm dev

A aplicação estará disponível em:

http://localhost:3000
📂 Estrutura básica
/pages
  index.vue          # Formulário principal
  acompanhar.vue     # Consulta de protocolo

/server/api
  feedback.post.ts   # Criação de manifestação
  feedback.get.ts    # Consulta por protocolo
🔁 Fluxo da aplicação
Usuário envia uma manifestação
Sistema gera um protocolo único
Dados são armazenados no banco
Usuário pode consultar usando o protocolo
# Sistema de Ouvidoria / Feedback

Aplicacao web para registro e acompanhamento de manifestacoes da area da saude no municipio de Domingos Martins.

O projeto foi criado para apoiar uma boa causa: dar voz ao cidadao, facilitar o envio de elogios, sugestoes, reclamacoes e solicitacoes, e fortalecer a escuta da secretaria de saude com mais transparencia e proximidade com a populacao.

## Para que serve

Este sistema permite que qualquer usuario envie uma manifestacao de forma simples, com opcao de anonimato, e receba um protocolo unico para acompanhamento posterior.

Ele serve como um canal digital de ouvidoria, ajudando a organizar o atendimento e a registrar as demandas de forma centralizada.

## Stack

- Nuxt 3
- Vue 3
- TypeScript
- Tailwind CSS
- Nuxt UI
- PostgreSQL
- Node.js

## Funcionalidades

- Registro de manifestacoes
- Envio anonimo opcional
- Geracao automatica de protocolo
- Consulta de manifestacao por protocolo
- Interface responsiva para desktop e mobile

## Como rodar localmente

### Pre-requisitos

- Node.js instalado
- pnpm instalado
- Docker e Docker Compose instalados

### Passo a passo

1. Clone o repositorio.
2. Instale as dependencias:

```bash
pnpm install
```

3. Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.
4. Suba a aplicacao e o banco de dados:

```bash
docker compose up --build
```

5. Se preferir rodar apenas a app fora do Docker, use:

```bash
pnpm dev
```

A aplicacao ficara disponivel em `http://localhost:3000`.

## Variaveis de ambiente

Exemplo de configuracao local:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=feedback_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/feedback_db
```

Se a aplicacao estiver rodando fora do Docker, `POSTGRES_HOST=localhost` costuma funcionar.
Se o Nuxt estiver dentro de um container no mesmo `docker-compose`, use o nome do servico do banco como host.

## Banco de dados

O banco sobe com o arquivo `db/init.sql`, que cria a tabela `feedbacks` automaticamente na primeira inicializacao do container.

## Estrutura do projeto

- `app/pages/index.vue` - Formulario principal de envio
- `app/pages/acompanhar.vue` - Tela de consulta de protocolo
- `server/api/feedback.post.ts` - Endpoint de criacao de manifestacao
- `server/api/feedback.get.ts` - Endpoint de consulta de manifestacao
- `db/init.sql` - Script de criacao inicial do banco

## Fluxo da aplicacao

1. O usuario acessa o formulario.
2. Preenche a manifestacao e envia.
3. O sistema grava os dados no PostgreSQL.
4. Um protocolo unico e gerado.
5. O usuario pode acompanhar a manifestacao depois.

## Proposito do projeto

Este sistema foi pensado para contribuir com um atendimento mais humano, organizado e acessivel para a populacao de Domingos Martins.

Mais do que uma plataforma de feedback, ele representa um canal de participacao que ajuda a ouvir melhor a comunidade e apoiar melhorias reais nos servicos publicos.

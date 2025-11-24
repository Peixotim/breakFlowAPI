# BreakFlow API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

API RESTful e Real-time para o **BreakFlow**, um sistema de gerenciamento de pausas (café, almoço) focado em controle de fluxo e capacidade operacional.

O objetivo principal é evitar gargalos em operações (como suporte ou call centers) garantindo que um número limite de funcionários esteja ausente simultaneamente.

## ✨ Funcionalidades

* **Autenticação (JWT):** Sistema de login seguro baseado em Tokens JWT.
* **Multi-Tenancy:** Arquitetura que separa os dados por `Empresa` (Tenant). Um usuário de uma empresa não pode, em hipótese alguma, acessar dados de outra.
* **Controle de Acesso (RBAC):** Sistema de papéis (Roles) com 3 níveis:
    * **DONO:** Administrador mestre da empresa. Cria gestores e equipes.
    * **GESTOR:** Gerencia equipes e funcionários, cria os "Eventos de Pausa" (limites, horários).
    * **FUNCIONARIO:** Usuário final, que "bate o ponto" de saída e entrada da pausa.
* **Controle de Fluxo em Tempo Real (WebSockets):** O "coração" do projeto. Um gateway que gerencia o contador de "vagas" de pausa em tempo real, bloqueando ou liberando saídas instantaneamente.
* **Gerenciamento de Pausas:** CRUD para "Eventos de Pausa" (ex: "Almoço Equipe A"), definindo regras como limite de pessoas, duração máxima e horários permitidos.
* **Logs e Auditoria:** Registro de todos os horários de saída e volta, gerando dados para relatórios de gestores.

## 🛠️ Stack de Tecnologia

* **Framework:** [Nest.js](https://nestjs.com/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [TypeORM](https://typeorm.io/)
* **Autenticação:** [JWT](https://jwt.io/) (com [Passport.js](http://www.passportjs.org/))
* **Real-time:** [WebSockets (Socket.io)](https://socket.io/)
* **Validação:** [Class Validator](https://github.com/typestack/class-validator) e [Class Transformer](https://github.com/typestack/class-transformer)

---

## 🏁 Rodando o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (Recomendado: v18 ou superior)
* [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* Uma instância do [PostgreSQL](https://www.postgresql.org/download/) rodando (localmente ou via Docker).

### ⚙️ Configuração do Ambiente (.env)

Antes de iniciar o projeto, é necessário criar um arquivo chamado .env na raiz do projeto contendo as variáveis de ambiente utilizadas para conectar ao banco de dados e configurar o servidor.

Exemplo de configuração:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=breakflow_db
SECRET=uma_chave_segura_aqui
```
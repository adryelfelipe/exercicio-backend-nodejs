# 📍 Address Manager API

> API para **gerenciamento e compartilhamento de endereços** construída com **Node.js** e **Express**, com foco em **arquitetura em camadas, segurança e rastreabilidade**.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-black.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange.svg)](https://jwt.io/)
[![Zod](https://img.shields.io/badge/Validation-Zod-3E67B1.svg)](https://zod.dev/)

---

## 📌 Sobre o projeto

O **Address Manager** é uma API para **gestão de endereços por usuário**, permitindo cadastro, consulta, edição e remoção de endereços de forma segura e isolada por conta.

Além do CRUD, o projeto implementa **rastreabilidade de alterações** (log de auditoria) e um sistema de **compartilhamento temporário** de endereços via link assinado, sem exigir autenticação de quem recebe o link.

A construção priorizou **separação de responsabilidades** e **previsibilidade de erros**, aplicando decisões que facilitam manutenção e evolução futura.

---

## 🎯 Domínio da aplicação

- Gestão de **usuários**
- Gestão de **endereços**
- Sistema de **autenticação** via JWT
- **Auditoria** de alterações (PUT/DELETE)
- **Compartilhamento temporário** de endereços

---

## 🧠 Decisões de Engenharia

### 🔐 Autenticação e Segurança

- Autenticação via **JWT**, com middleware dedicado protegendo as rotas sensíveis
- Validação do tipo de token (`access` e `share`) para impedir o uso indevido de tokens de compartilhamento como autenticação
- Senhas armazenadas com hash via **bcrypt**, nunca em texto plano
- Isolamento de dados por usuário: cada endereço só pode ser lido, editado ou removido pelo seu próprio dono

A lógica de autenticação fica isolada no middleware, sem se misturar com as regras de negócio dos controllers/services.

---

### ⚙️ Consistência e Tratamento de Erros

- Validação de entrada centralizada com **Zod**, aplicada em todos os endpoints
- Padronização de erros seguindo **ProblemDetails (RFC 7807)**
- Centralização do tratamento via **GlobalExceptionHandler**, evitando `try/catch` duplicado nos controllers

Isso evita `try/catch` repetido em cada endpoint e deixa as respostas de erro consistentes em toda a API.

---

### 🗂️ Auditoria de Alterações

- Toda operação de `PUT` e `DELETE` é registrada em uma tabela de log
- O log guarda o **estado anterior e posterior** do dado, além de quem fez a alteração

Isso permite consultar o histórico de mudanças sem alterar o fluxo principal das operações de PUT/DELETE.

---

### 🔗 Compartilhamento Temporário

- Geração de link de compartilhamento usando **JWT com expiração configurável**
- Validação automática de expiração e integridade do token ao acessar o link
- Endpoint de acesso público, sem exigir login, mas restrito ao período de validade

O destinatário do link não precisa ter conta nem fazer login para acessar o endereço compartilhado.

---

## 🚀 Funcionalidades

- Registro e login de usuários
- CRUD completo de endereços (isolado por usuário)
- Busca de endereços por palavra-chave
- Log de auditoria para alterações e remoções
- Geração de link de compartilhamento temporário
- Acesso público a endereços compartilhados, com expiração
- Tratamento padronizado de erros (RFC 7807)

---

## 🏗️ Arquitetura

O projeto segue uma abordagem em camadas, separada por **módulo de domínio**:

```
src/
├── modules/
│   ├── auth/        → Registro, login e middleware de autenticação JWT
│   ├── user/        → Modelo e repositório de usuários
│   └── address/     → CRUD de endereços e compartilhamento temporário
└── shared/
    └── infrastructure/
        ├── client/    → Configuração do Prisma Client
        ├── errors/    → Tratamento global de erros (ProblemDetails)
        └── log/       → Registro de logs de alterações (PUT/DELETE)
```

Cada módulo é dividido em:

| Camada | Responsabilidade |
|---|---|
| **domain** | Modelos e contratos de repositório (independem de framework) |
| **application** | Controllers, services, DTOs, schemas de validação e mappers |
| **infrastructure** | Implementações concretas (Prisma, middlewares, repositórios) |

O domínio (models e contratos de repositório) não depende de Express ou do Prisma diretamente — essas dependências ficam isoladas na camada de infraestrutura.

---

## 🛠️ Stack de Tecnologias

- **Node.js 18+**
- **Express 5**
- **PostgreSQL** (hospedado via [Aiven](https://aiven.io/))
- **Prisma ORM**
- **JWT** (jsonwebtoken)
- **bcrypt**
- **Zod**

---

## 📑 Rotas da API

### Autenticação

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/user` | Registra um novo usuário | ❌ |
| `POST` | `/login` | Autentica e retorna um token JWT | ❌ |

### Endereços

> Todas as rotas abaixo exigem o header `Authorization: Bearer <token>`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/addresses` | Cria um endereço associado ao usuário autenticado |
| `GET` | `/addresses?keyword=termo` | Lista os endereços do usuário (busca opcional por palavra-chave) |
| `PUT` | `/addresses/:id` | Atualiza um endereço, se pertencer ao usuário autenticado |
| `DELETE` | `/addresses/:id` | Remove um endereço, se pertencer ao usuário autenticado |
| `POST` | `/addresses/:id/share` | Gera um link temporário de compartilhamento |

### Compartilhamento

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| `GET` | `/shared/:token` | Acessa um endereço compartilhado enquanto o token for válido | ❌ |

---

## ⚡ Como executar

### Pré-requisitos

- **Node.js 18+** instalado
- **PostgreSQL** disponível (local ou remoto)

### 1. Clonar o repositório

```bash
git clone https://github.com/adryelfelipe/Address-Manager-API.git
cd Address-Manager-API
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```dotenv
DATABASE_URL="postgres://usuario:senha@host:porta/database?sslmode=require"
BASE_URL="http://localhost:3000"
JWT_SECRET="uma-string-aleatoria-bem-grande-e-secreta"
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `BASE_URL` | URL base usada para montar os links de compartilhamento |
| `JWT_SECRET` | Chave secreta usada para assinar os tokens JWT |

> ⚠️ Nunca commite o `.env` com valores reais (ele já está no `.gitignore`)

### 4. Criar as tabelas no banco

Execute o arquivo `schema.sql` na raiz do projeto para criar as tabelas no banco de dados:

```bash
psql "postgres://usuario:senha@host:porta/database?sslmode=require" -f schema.sql
```

Ou cole o conteúdo do arquivo diretamente no seu cliente SQL (pgAdmin, DBeaver, etc).

### 5. Gerar o Prisma Client

> ⚠️ A pasta `src/shared/infrastructure/generated/prisma/` não vem no repositório — ela precisa ser gerada localmente após clonar o projeto.

```bash
npx prisma generate
```

Isso gera o client do Prisma baseado no `prisma/schema.prisma`, necessário para a aplicação se comunicar com o banco.

### 6. Iniciar a aplicação

```bash
# desenvolvimento — com reload automático via nodemon
npm run dev

# produção — node puro, sem reload
npm start
```

A API estará disponível em `http://localhost:3000`.

---

## 🧪 Exemplos de uso

<details>
<summary><b>Registrar usuário</b></summary>

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Adryel Felipe",
    "email": "adryel@example.com",
    "password": "senha123"
  }'
```
</details>

<details>
<summary><b>Login</b></summary>

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "adryel@example.com",
    "password": "senha123"
  }'
```

Resposta:
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

> Guarde esse token — ele será necessário no header `Authorization: Bearer <token>` de todas as rotas protegidas.
</details>

<details>
<summary><b>Criar endereço</b></summary>

```bash
curl -X POST http://localhost:3000/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "street": "Rua das Flores",
    "number": "123",
    "city": "Jaraguá do Sul",
    "state": "SC",
    "zipCode": "89254-000"
  }'
```
</details>

<details>
<summary><b>Listar endereços com busca</b></summary>

```bash
curl "http://localhost:3000/addresses?keyword=Flores" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```
</details>

<details>
<summary><b>Atualizar endereço</b></summary>

```bash
curl -X PUT http://localhost:3000/addresses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "street": "Rua Nova",
    "number": "456",
    "city": "Jaraguá do Sul",
    "state": "SC",
    "zipCode": "89254-111"
  }'
```
</details>

<details>
<summary><b>Remover endereço</b></summary>

```bash
curl -X DELETE http://localhost:3000/addresses/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```
</details>

<details>
<summary><b>Compartilhar endereço</b></summary>

```bash
curl -X POST http://localhost:3000/addresses/1/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{ "expiresIn": "1h" }'
```

Resposta:
```json
{ "url": "http://localhost:3000/shared/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```
</details>

<details>
<summary><b>Acessar endereço compartilhado</b></summary>

```bash
curl http://localhost:3000/shared/TOKEN_DO_COMPARTILHAMENTO
```
</details>

---

## 🧯 Tratamento de erros

Os erros seguem o formato **[RFC 7807 (Problem Details)](https://www.rfc-editor.org/rfc/rfc7807)**, tratados centralmente pelo `GlobalExceptionHandler`:

```json
{
  "type": "https://api.example.com/errors/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "One or more fields failed validation",
  "instance": "/addresses",
  "errors": [ "..." ]
}
```

---

## 💡 Conclusão

Além do CRUD básico, o projeto cobre autenticação, isolamento de dados por usuário, log de auditoria e compartilhamento temporário — atendendo aos requisitos propostos no teste técnico.

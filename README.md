# FXReplayChallenge API

REST API built with Node.js 22, Express, Prisma, and PostgreSQL.

## Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Runtime     | Node.js 22              |
| Framework   | Express 5               |
| ORM         | Prisma 6                |
| Database    | PostgreSQL 17           |
| Validation  | Zod                     |
| Testing     | Jest + Supertest        |
| Language    | TypeScript 5            |

## Prerequisites

- Node.js >= 22
- Docker & Docker Compose

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run Prisma migrations

```bash
npm run prisma:migrate
```

### 5. Start development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

## Scripts

| Script                    | Description                        |
|---------------------------|------------------------------------|
| `npm run dev`             | Start dev server with hot reload   |
| `npm run build`           | Compile TypeScript                 |
| `npm start`               | Run compiled output                |
| `npm test`                | Run all tests                      |
| `npm run test:watch`      | Run tests in watch mode            |
| `npm run test:coverage`   | Run tests with coverage report     |
| `npm run lint`            | Lint source files                  |
| `npm run lint:fix`        | Lint and auto-fix                  |
| `npm run prisma:migrate`  | Run DB migrations (dev)            |
| `npm run prisma:studio`   | Open Prisma Studio                 |

## API Endpoints

### Health

```
GET /api/v1/health
```

Returns the service and database status.

## Project Structure

```
src/
├── config/         # env, database, logger
├── errors/         # domain error classes
├── middleware/     # error, notFound handlers
├── routes/         # route definitions
├── app.ts          # Express app factory
└── server.ts       # entry point
prisma/
└── schema.prisma   # database schema
tests/
├── unit/           # unit tests
└── integration/    # integration tests
```

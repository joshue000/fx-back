# FXReplayChallenge API

REST API built with Node.js 22, Express, Prisma, and PostgreSQL for managing FX trade orders.

## Stack

| Layer          | Technology                     |
|----------------|--------------------------------|
| Runtime        | Node.js 22                     |
| Framework      | Express 5                      |
| ORM            | Prisma 6                       |
| Database       | PostgreSQL 17                  |
| Validation     | Zod                            |
| Testing        | Jest + Supertest               |
| Language       | TypeScript 5                   |
| Logging        | Winston + Morgan               |
| Metrics        | Prometheus (prom-client)       |
| Dashboards     | Grafana                        |
| Documentation  | Swagger UI (OpenAPI 3.0)       |

## Prerequisites

- Node.js >= 22
- Docker & Docker Compose

---

## Option A — Docker (recommended)

Run the full stack (API + database + observability) with a single command.

### 1. Configure environment

```bash
cp .env.example .env
# Edit .env if needed — defaults work out of the box
```

### 2. Start the stack

```bash
./scripts/start.sh
```

This will:
- Build the Docker image
- Start PostgreSQL, the API, Prometheus, and Grafana
- Run database migrations automatically
- Seed the database with 25 sample orders

### 3. Stop the stack

```bash
./scripts/stop.sh
```

---

## Option B — Manual

Run infrastructure in Docker and the API locally.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start infrastructure (database + observability)

```bash
docker compose up -d postgres prometheus grafana
```

> **Note:** When running the API locally, Prometheus cannot reach it via the Docker service name.
> Update `docker/prometheus/prometheus.yml` to use `host.docker.internal:3000` as the scrape target.

### 4. Run database migrations

```bash
npm run prisma:migrate
```

### 5. Seed the database (optional)

```bash
npm run prisma:seed
```

Inserts 25 sample trade orders across BTCUSD, EURUSD, and ETHUSD with a mix of sides, types, and statuses. Running it again resets and re-seeds from scratch.

### 6. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## Services

| Service    | URL                                       | Credentials   |
|------------|-------------------------------------------|---------------|
| API        | http://localhost:3000                     |               |
| Swagger UI | http://localhost:3000/api/v1/docs         |               |
| Metrics    | http://localhost:3000/metrics             |               |
| Prometheus | http://localhost:9090                     |               |
| Grafana    | http://localhost:3100                     | admin / admin |

---

## Scripts

| Script                      | Description                                       |
|-----------------------------|---------------------------------------------------|
| `./scripts/start.sh`        | Build and start the full Docker stack             |
| `./scripts/stop.sh`         | Stop and remove all containers                    |
| `npm run dev`               | Start dev server with hot reload (seeds DB first) |
| `npm run build`             | Compile TypeScript to `dist/`                     |
| `npm start`                 | Run compiled output                               |
| `npm test`                  | Run all tests (seeds DB after)                    |
| `npm run test:watch`        | Run tests in watch mode                           |
| `npm run test:coverage`     | Run tests with coverage report (seeds DB after)   |
| `npm run lint`              | Lint source files                                 |
| `npm run lint:fix`          | Lint and auto-fix                                 |
| `npm run prisma:migrate`    | Run DB migrations (dev)                           |
| `npm run prisma:seed`       | Seed the database with 25 sample orders           |
| `npm run prisma:studio`     | Open Prisma Studio                                |

---

## API Endpoints

### Health

```
GET /api/v1/health
```

Returns service and database status.

### Trade Orders

| Method | Path                      | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | /api/v1/trade_orders      | List orders (paginated)         |
| POST   | /api/v1/trade_orders      | Create a new order              |
| GET    | /api/v1/trade_orders/:id  | Get a single order              |
| PUT    | /api/v1/trade_orders/:id  | Update an order                 |
| DELETE | /api/v1/trade_orders/:id  | Soft-delete an order            |

Full interactive documentation is available at `/api/v1/docs`.

### Supported pairs

`BTCUSD`, `EURUSD`, `ETHUSD`

### Price policy

| Type  | Side | Rule                              |
|-------|------|-----------------------------------|
| limit | buy  | price must be **below** market    |
| limit | sell | price must be **above** market    |
| stop  | buy  | price must be **above** market    |
| stop  | sell | price must be **below** market    |
| market| any  | no price restriction              |

---

## Observability

- **Structured logs** — Winston (JSON in production, colorized in dev) via Morgan
- **Prometheus metrics** — HTTP request duration histogram + total counter per `method/route/status_code`; default Node.js metrics included
- **Grafana dashboards** — auto-provisioned with Prometheus as default datasource

---

## Project Structure

```
src/
├── config/             # env, database, logger, swagger
├── common/             # shared types (pagination)
├── domain/
│   └── trade-order/    # types, schema, repository interface, price policy
├── application/
│   └── trade-order/    # service (business logic)
├── infrastructure/
│   └── repositories/   # Prisma repository implementation
├── presentation/
│   └── trade-order/    # controller + route
├── middleware/          # error, notFound, requestLogger, metrics
├── routes/             # health, metrics, api router
├── errors/             # domain error classes
├── app.ts              # Express app factory
└── server.ts           # entry point
prisma/
├── schema.prisma        # database schema
├── seed.ts              # seed script (25 sample orders)
└── migrations/          # migration history
scripts/
├── start.sh             # start the full Docker stack
└── stop.sh              # stop the full Docker stack
docker/
├── prometheus/          # Prometheus configuration
└── grafana/             # Grafana provisioning
tests/
├── unit/                # unit tests (service + controller)
└── integration/         # integration tests (HTTP layer)
```
